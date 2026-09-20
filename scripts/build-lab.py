#!/usr/bin/env python3
"""Build the in-browser IDD Agent Lab into public/lab/.

The lab in the IDD Agent Simulation repo is a Python stdlib HTTP server. This
script turns it into a fully static bundle that runs on any static host by
executing the *same* Python package in the browser via Pyodide (WebAssembly):

    public/lab/index.html          the lab UI (api() bridged to a Web Worker)
    public/lab/worker.js           loads Pyodide, routes /api/* to Python
    public/lab/idd_bundle.zip      idd_agent_sim package + synthetic data

Nothing is modified in the source repo; this only reads from it.

Usage:
    python3 scripts/build-lab.py [path/to/IDD Agent Simulation]
"""

from __future__ import annotations

import base64
import json
import re
import shutil
import sys
import tempfile
import zipfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lab_i18n import OVERRIDES, RUNS  # noqa: E402

WEBSITE = Path(__file__).resolve().parents[1]
DEFAULT_IDD = Path.home() / "Desktop/0. Github/2. Disability/2-3. IDD Agent Simulation"
OUT = WEBSITE / "public" / "lab"
PYODIDE_VERSION = "0.27.7"  # Python 3.12.7, ships pyyaml 6.0.2

# Only synthetic demo data goes into the public bundle.
DATA_DIRS = ("profiles", "scenarios", "clinical")

BRIDGE_PY = '''"""Route the lab's /api/* calls to lab.actions (mirrors lab/server.py)."""
import json
from pathlib import Path

from idd_agent_sim.lab import actions

ROOT = Path("/home/pyodide/idd")


def handle(method, path, body_json):
    try:
        if method == "GET":
            if path == "/api/state":
                return 200, json.dumps(actions.lab_state(ROOT), ensure_ascii=False)
            if path.startswith("/api/runs/"):
                run_id = path[len("/api/runs/"):]
                try:
                    return 200, json.dumps(actions.load_lab_run(ROOT, run_id), ensure_ascii=False)
                except ValueError as error:
                    return 404, json.dumps({"error": str(error)})
            return 404, json.dumps({"error": "not found: " + path})
        payload = json.loads(body_json or "{}")
        if path == "/api/agents":
            data = actions.create_agent(ROOT, payload)
        elif path == "/api/scenarios":
            data = actions.create_scenario(ROOT, payload)
        elif path == "/api/run":
            data = actions.run_lab_experiment(ROOT, payload)
        else:
            return 404, json.dumps({"error": "not found: " + path})
        return 200, json.dumps(data, ensure_ascii=False)
    except ValueError as error:
        return 400, json.dumps({"error": str(error)}, ensure_ascii=False)
    except Exception as error:  # surface unexpected errors to the UI toast
        return 500, json.dumps({"error": "Engine error: " + repr(error)})
'''

WORKER_JS = """// IDD Agent Lab engine: runs the real Python package in-browser via Pyodide.
importScripts("https://cdn.jsdelivr.net/pyodide/v%(pv)s/full/pyodide.js");

let ready = null;
let handle = null;

function progress(message) {
  self.postMessage({ type: "progress", message });
}

async function boot() {
  progress("Loading Python runtime (first visit downloads ~10 MB, then cached)...");
  const pyodide = await loadPyodide();
  progress("Loading PyYAML...");
  await pyodide.loadPackage("pyyaml");
  progress("Unpacking simulation engine...");
  const buf = await (await fetch("idd_bundle.zip")).arrayBuffer();
  pyodide.unpackArchive(buf, "zip", { extractDir: "/home/pyodide/idd" });
  pyodide.runPython(`
import sys
sys.path.insert(0, "/home/pyodide/idd/src")
sys.path.insert(0, "/home/pyodide/idd")
import bridge
`);
  handle = pyodide.runPython("bridge.handle");
  progress("ready");
}

self.onmessage = async (event) => {
  const { id, method, path, body } = event.data;
  try {
    if (!ready) ready = boot();
    await ready;
    const [status, text] = handle(method, path, body ? JSON.stringify(body) : "").toJs();
    self.postMessage({ id, status, text });
  } catch (error) {
    self.postMessage({ id, status: 500, text: JSON.stringify({ error: String(error) }) });
  }
};

// Start booting immediately so the engine is warm by the time the user clicks Run.
ready = boot().catch((error) => progress("Engine failed to load: " + error));
""" % {"pv": PYODIDE_VERSION}

# Replaces the template's fetch()-based api() with a Web Worker bridge, and
# adds a small engine-status pill + credit footer.
API_BRIDGE_JS = """const __engine = new Worker('worker.js');
let __rid = 0;
const __pending = new Map();
let __engineReady = false;
function __setEngine(text, ok) {
  const el = document.getElementById('engine-pill');
  if (!el) return;
  el.textContent = text;
  el.dataset.ok = ok ? '1' : '0';
}
__engine.onmessage = (e) => {
  const m = e.data;
  if (m.type === 'progress') {
    if (m.message === 'ready') { __engineReady = true; __setEngine('Engine ready', true); }
    else __setEngine(m.message, false);
    return;
  }
  const p = __pending.get(m.id);
  if (!p) return;
  __pending.delete(m.id);
  let data; try { data = JSON.parse(m.text); } catch (_) { data = {}; }
  if (m.status >= 400) p.reject(new Error(data.error || ('HTTP ' + m.status)));
  else p.resolve(data);
};
function api(path, body) {
  if (!__engineReady) toast('Python engine is still loading, your request will run as soon as it is ready...');
  return new Promise((resolve, reject) => {
    const id = ++__rid;
    __pending.set(id, { resolve, reject });
    __engine.postMessage({ id, method: body ? 'POST' : 'GET', path, body });
  });
}"""

PILL_AND_CREDITS_HTML = """
<style>
#engine-pill{position:fixed;right:12px;bottom:12px;z-index:50;padding:6px 12px;border-radius:999px;
font:600 12px/1 system-ui,sans-serif;background:#111827;color:#fff;opacity:.92;max-width:70vw}
#engine-pill[data-ok="1"]{background:#059669}
#lab-credit{margin:28px auto 72px;max-width:920px;padding:0 16px;font:12px/1.6 system-ui,sans-serif;color:#6b7280;text-align:center}
#lab-credit a{color:inherit}
</style>
<div id="engine-pill" data-ok="0">Starting engine...</div>
<div id="lab-credit">
Runs entirely in your browser (Python via Pyodide). Nothing you create is sent or stored anywhere.<br>
All agents are synthetic. Environment concept and map from <em>Generative Agents</em>
(Park, O'Brien, Cai, Morris, Liang &amp; Bernstein, UIST 2023, Apache-2.0); game art by
PixyMoon (background), LimeZu (furniture/interior), and ぴぽ (characters).
Simulator by Sang-yun Lee &mdash; a research prototype, not a clinical tool.
</div>
"""


def find_api_block(template: str) -> tuple[int, int]:
    start = template.index("async function api(path, body) {")
    end = template.index("function avatarFor(id)")
    return start, end


HANGUL_RUN = re.compile(r"[가-힣][가-힣0-9 ·]*[가-힣0-9]|[가-힣]")
SKIP_TRANSLATE = {"dashboard_template.py"}  # standalone dashboards; not used by the lab
TEXT_SUFFIXES = {".py", ".yaml", ".yml", ".csv"}


def translate_tree(root: Path) -> None:
    """Apply OVERRIDES then RUNS to every text file under root; report leftovers."""
    assert len(set(RUNS.values())) == len(RUNS), "RUNS translations must be unique"
    overrides = sorted(OVERRIDES, key=lambda kv: -len(kv[0]))
    override_hits = {ko: 0 for ko, _ in overrides}
    leftovers: dict[str, set[str]] = {}

    def sub_run(match: re.Match, name: str) -> str:
        run = match.group(0)
        if run in RUNS:
            return RUNS[run]
        leftovers.setdefault(run, set()).add(name)
        return run

    for path in sorted(root.rglob("*")):
        if not path.is_file() or path.suffix not in TEXT_SUFFIXES or path.name in SKIP_TRANSLATE:
            continue
        text = path.read_text(encoding="utf-8")
        for ko, en in overrides:
            if ko in text:
                override_hits[ko] += text.count(ko)
                text = text.replace(ko, en)
        text = HANGUL_RUN.sub(lambda m: sub_run(m, path.name), text)
        path.write_text(text, encoding="utf-8")

    unused = [ko for ko, n in override_hits.items() if n == 0]
    if unused:
        print(f"[i18n] {len(unused)} overrides matched nothing:")
        for ko in unused:
            print("   ", ko[:90])
    if leftovers:
        print(f"[i18n] {len(leftovers)} untranslated Hangul runs:")
        for run, names in sorted(leftovers.items()):
            print("   ", run, sorted(names))


def avatar_data_uris(idd: Path, limit: int = 12) -> list[str]:
    d = idd / "external/generative_agents/environment/frontend_server/static_dirs/assets/characters/profile"
    if not d.exists():
        return []
    return [
        "data:image/png;base64," + base64.b64encode(p.read_bytes()).decode("ascii")
        for p in sorted(d.glob("*.png"))[:limit]
    ]


def build(idd: Path) -> None:
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True)

    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp) / "idd"
        # translated working copy: package + synthetic data only
        shutil.copytree(
            idd / "src" / "idd_agent_sim",
            root / "src" / "idd_agent_sim",
            ignore=shutil.ignore_patterns("__pycache__", "*.pyc"),
        )
        for name in DATA_DIRS:
            src = idd / "data" / name
            if src.exists():
                shutil.copytree(src, root / "data" / name)
        (root / "outputs" / "lab_runs").mkdir(parents=True)
        translate_tree(root)

        # import the *translated* package to render the boot payload
        sys.path.insert(0, str(root / "src"))
        from idd_agent_sim.dashboard import _map_image_data_uri  # noqa: E402
        from idd_agent_sim.lab import actions  # noqa: E402
        from idd_agent_sim.lab.template import TEMPLATE  # noqa: E402

        boot = {
            "state": actions.lab_state(root),
            "map_image": _map_image_data_uri(),
            "avatars": avatar_data_uris(idd),
        }

        zip_path = OUT / "idd_bundle.zip"
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
            for path in sorted(root.rglob("*")):
                if not path.is_file() or "__pycache__" in path.parts or path.suffix == ".pyc":
                    continue
                if path.name == "server.py":  # HTTP layer is replaced by the worker
                    continue
                z.write(path, path.relative_to(root))
            z.writestr("bridge.py", BRIDGE_PY)

    payload = json.dumps(boot, ensure_ascii=False).replace("</", "<\\/")
    html = TEMPLATE.replace("__LAB_BOOT__", payload)
    start, end = find_api_block(html)
    html = html[:start] + API_BRIDGE_JS + "\n" + html[end:]
    html = html.replace("</body>", PILL_AND_CREDITS_HTML + "</body>", 1)
    html = html.replace('<html lang="ko">', '<html lang="en">')

    (OUT / "index.html").write_text(html, encoding="utf-8")
    (OUT / "worker.js").write_text(WORKER_JS, encoding="utf-8")

    for f in sorted(OUT.iterdir()):
        print(f"{f.name:20s} {f.stat().st_size / 1024:8.1f} KB")


if __name__ == "__main__":
    idd_root = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_IDD
    build(idd_root)
