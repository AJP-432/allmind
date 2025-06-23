export function Footer() {
  return (
    <footer className="w-full border-t border-border/40">
      <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center space-x-2">
            <span className="font-bold">AllMind</span>
          </div>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built for the AllMind SWE internship technical assignment.{" "}
            <span className="hidden md:inline">
              Press{" "}
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">Ctrl</span>K
              </kbd>{" "}
              to open the AI Copilot.
            </span>
            <span className="md:hidden">
              Tap the AI button in the header to open the copilot.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
