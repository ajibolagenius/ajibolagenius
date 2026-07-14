import Link from "next/link";

export function Nav() {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
      <Link href="/" className="text-sm font-semibold tracking-tight">
        Ajibola
      </Link>
      <nav className="flex items-center gap-6 text-sm text-neutral-500">
        <Link href="/" className="hover:text-neutral-900 dark:hover:text-neutral-100">
          Home
        </Link>
        <Link href="/work" className="hover:text-neutral-900 dark:hover:text-neutral-100">
          Work
        </Link>
      </nav>
    </header>
  );
}
