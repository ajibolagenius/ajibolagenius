export function SiteFooter({ name }: { name: string }) {
  return (
    <div className="lg:ml-80">
      <div className="mx-auto flex max-w-3xl items-center justify-between border-t border-ink/10 px-6 py-6 text-body-s text-ink/60">
        <p>© {new Date().getFullYear()} {name}</p>
        <a href="#top" className="hover:text-ink">
          Back to Top
        </a>
      </div>
    </div>
  );
}
