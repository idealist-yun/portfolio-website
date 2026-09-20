// IDD Agent Lab engine: runs the real Python package in-browser via Pyodide.
importScripts("https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js");

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
