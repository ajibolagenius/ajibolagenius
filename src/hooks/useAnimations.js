import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'

export function useAnimations() {
    useEffect(() => {
        // Create a GSAP Context for easy cleanup
        let ctx = gsap.context(() => {

            // --- 1. Loader Animation ---
            const counterEl = document.getElementById('counter')

            if (counterEl) {
                let counter = { value: 0 }

                gsap.to(counter, {
                    duration: 2,
                    value: 100,
                    ease: 'none',
                    onUpdate: function () {
                        const currentPercentage = Math.ceil(counter.value)
                        counterEl.textContent = currentPercentage + '%'

                        gsap.to('.bar2', {
                            width: currentPercentage + '%',
                            ease: 'none',
                            duration: 0.1,
                        })
                    },
                    onComplete: () => {
                        const tl = gsap.timeline()
                        tl.to('.counter', { opacity: 0, duration: 0.5, ease: 'power4.inOut' })
                            .to('.bar', { opacity: 0, duration: 0.5, ease: 'power4.inOut' }, '-=0.3')
                            .to('.loader-container', { y: '-120%', duration: 1.6, ease: 'power4.inOut' })
                    }
                })
            }

            // --- 2. Scroll Animations (Delayed) ---
            // We use a small delay to ensure the DOM layout is final
            setTimeout(() => {
                // Reveal Animations
                const revealElements = gsap.utils.toArray('.reveal')
                revealElements.forEach((reveal) => {
                    const h1 = reveal.querySelector('h1')
                    if (h1) {
                        gsap.to(h1, {
                            scrollTrigger: {
                                trigger: reveal,
                                start: 'top 60%',
                                // REMOVED: scroller: '#main' (Let Lenis handle the window scroll)
                            },
                            y: 0,
                            skewY: 0,
                            duration: 0.6,
                            ease: 'power2.ease'
                        })
                    }
                })

                // Sticky Tools Heading
                const toolHeadings = gsap.utils.toArray('.tools_heading')
                toolHeadings.forEach((heading) => {
                    gsap.timeline({
                        scrollTrigger: {
                            trigger: heading,
                            start: 'top 5%',
                            end: 'bottom top', // Defined an end point for safety
                            scrub: true,
                            pin: true,
                            toggleActions: 'restart complete reverse resume',
                        },
                    })
                })

                ScrollTrigger.refresh()
            }, 500) // Increased delay slightly to be safe
        })

        // Cleanup: Kills ALL animations created in this scope automatically
        return () => ctx.revert()
    }, [])
}
