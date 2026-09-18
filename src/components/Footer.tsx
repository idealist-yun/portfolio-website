import { profile } from "@/data/profile";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          <a
            href={`mailto:${profile.email}`}
            className="hover:text-accent transition-colors"
          >
            {profile.email}
          </a>
          <span>{profile.location}</span>
        </div>
      </div>
    </footer>
  );
}
