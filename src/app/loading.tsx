export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page content"
      className="flex min-h-screen flex-1 flex-col"
    >
      <div className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-ink/10 bg-cream/80 px-6 backdrop-blur">
        <div className="h-4 w-28 animate-pulse rounded bg-ink/10" />
        <div className="h-8 w-20 animate-pulse rounded-full bg-ink/10" />
      </div>

      <div className="flex flex-1">
        {/* Desktop sidebar placeholder */}
        <aside className="hidden w-80 shrink-0 border-r border-ink/10 p-8 lg:block">
          <div className="flex flex-col gap-6">
            <div className="h-20 w-20 animate-pulse rounded-full bg-ink/10" />
            <div className="flex flex-col gap-2">
              <div className="h-6 w-3/4 animate-pulse rounded bg-ink/10" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-ink/10" />
            </div>
            <div className="flex flex-col gap-3 pt-6">
              <div className="h-4 w-full animate-pulse rounded bg-ink/10" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-ink/10" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-ink/10" />
            </div>
          </div>
        </aside>

        {/* Main content placeholder */}
        <div className="flex-1 p-6 lg:p-10">
          <div className="mx-auto flex max-w-3xl flex-col gap-8">
            <div className="flex flex-col gap-3">
              <div className="h-10 w-2/3 animate-pulse rounded bg-ink/10" />
              <div className="h-5 w-full max-w-md animate-pulse rounded bg-ink/10" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="h-48 animate-pulse rounded-md border border-ink/10 bg-panel/60 p-6" />
              <div className="h-48 animate-pulse rounded-md border border-ink/10 bg-panel/60 p-6" />
            </div>
          </div>
        </div>
      </div>
      <span className="sr-only">Loading content...</span>
    </div>
  );
}
