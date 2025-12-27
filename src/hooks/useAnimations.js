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
                    ease: 'none', // 'none' is safe, doesn't require parsing
                    onUpdate: function () {
                        const currentPercentage = Math.ceil(counter.value)
                        counterEl.textContent = currentPercentage + '%'

                        gsap.to('.bar2', {
                            width: currentPercentage + '%',
                            ease: 'none', // 'none' is safe
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

            setTimeout(() => {
                const revealElements = gsap.utils.toArray('.reveal')
                revealElements.forEach((reveal) => {
                    const h1 = reveal.querySelector('h1')
                    if (h1) {
                        gsap.to(h1, {
                            scrollTrigger: {
                                trigger: reveal,
                                start: 'top 60%',
                                scroller: document.body,
                            },
                            y: 0,
                            skewY: 0,
                            duration: 0.6,
                            ease: 'power2.ease'
                        })
                    }
                })

                const toolHeadings = gsap.utils.toArray('.tools_heading')
                toolHeadings.forEach((heading) => {
                    gsap.timeline({
                        scrollTrigger: {
                            trigger: heading,
                            start: 'top 5%',
                            end: 'bottom top',
                            scrub: true,
                            pin: true,
                            toggleActions: 'restart complete reverse resume',
                            scroller: document.body,
                        },
                    })
                })

                ScrollTrigger.refresh()
            }, 500)
        })

        // Cleanup: Kills ALL animations created in this scope automatically
        return () => ctx.revert()
    }, [])
}
