/**
 * One homepage section: a small mono label in a narrow left rail, content on
 * the right. The rail stacks above the content below `lg`. Section headings
 * are deliberately small — the large serif is saved for the name, case-study
 * titles and the contact line, so it keeps its weight.
 */
export function HomeSection({
  id,
  label,
  sub,
  children,
}: {
  id: string;
  label: string;
  sub?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-label`}
      className="reveal scroll-mt-24 border-t border-ink/10"
    >
      <div className="grid grid-cols-1 gap-5 py-14 lg:grid-cols-[10rem_minmax(0,1fr)] lg:gap-10 lg:py-18">
        <div className="font-mono text-body-xs text-ink/50">
          <h2 id={`${id}-label`} className="font-normal text-ink">
            {label}
          </h2>
          {sub && <p>{sub}</p>}
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
