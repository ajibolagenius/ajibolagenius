export function SectionHeading({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <h2 id={id} className="text-h2 scroll-mt-24 font-normal">
      {children}
    </h2>
  );
}
