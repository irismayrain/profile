export default function Footer({ name }: { name: string }) {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between px-9 py-7 font-mono text-[11px] text-ink-mute">
        <span>
          © {new Date().getFullYear()} {name}
          <span className="ml-3 text-ink-faint">/ All rights reserved.</span>
        </span>
        <span className="hidden md:inline">
          made with <span className="font-serif-ac text-lav-500">care</span> & coffee
        </span>
      </div>
    </footer>
  );
}
