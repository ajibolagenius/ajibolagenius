export function EdgeMarquee({ items }: { items: string[] }) {
    if (items.length === 0) return null;

    // Repeat the phrase set so one half of the track always exceeds the
    // viewport size — required for a gapless -50% translate loop.
    const half = Array.from({ length: 3 }).flatMap(() => items);

    return (
        <>
            {/* Mobile/tablet: horizontal strip at the sidebar's bottom edge */}
            <div
                aria-hidden="true"
                className="pointer-events-none select-none overflow-hidden border-b border-ink/10 bg-panel py-2.5 lg:hidden print:hidden"
            >
                <div className="animate-marquee-x flex w-max">
                    {[0, 1].map((copy) => (
                        <div key={copy} className="flex items-center">
                            {half.map((item, i) => (
                                <span key={i} className="flex items-center">
                                    <span className="px-4 font-mono text-body-xs uppercase tracking-[0.25em] whitespace-nowrap text-ink/30">
                                        {item}
                                    </span>
                                    <span className="text-body-xs text-accent/50">
                                        ✦
                                    </span>
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Desktop: vertical strip riding the sidebar's right border */}
            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-y-0 left-72 z-30 hidden w-8 select-none overflow-hidden lg:block print:hidden"
            >
                <div className="animate-marquee-y flex flex-col items-center">
                    {[0, 1].map((copy) => (
                        <div key={copy} className="flex flex-col items-center">
                            {half.map((item, i) => (
                                <span key={i} className="flex flex-col items-center">
                                    <span className="py-4 font-mono text-body-xs uppercase tracking-[0.25em] text-ink/30 [writing-mode:vertical-rl]">
                                        {item}
                                    </span>
                                    <span className="text-body-xs text-accent/50">
                                        ✦
                                    </span>
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
