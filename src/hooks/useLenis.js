import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { ScrollTrigger } from '../utils/gsap'

export function useLenis() {
    const lenisRef = useRef(null)
    const rafRef = useRef(null)

    useEffect(() => {
        // Initialize Lenis
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        })

        lenisRef.current = lenis
        // Make Lenis available globally for keyboard shortcuts
        window.lenis = lenis

        // Integrate with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update)

        // RequestAnimationFrame loop
        function raf(time) {
            lenis.raf(time)
            rafRef.current = requestAnimationFrame(raf)
        }
        rafRef.current = requestAnimationFrame(raf)

        // ScrollTrigger integration
        ScrollTrigger.scrollerProxy(document.body, {
            scrollTop(value) {
                if (value !== undefined) {
                    lenis.scrollTo(value, { immediate: true })
                }
                return lenis.scroll || window.scrollY
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight,
                }
            },
            pinType: document.body.style.transform ? 'transform' : 'fixed',
        })

        ScrollTrigger.addEventListener('refresh', () => {
            lenis.resize()
        })

        ScrollTrigger.defaults({
            scroller: document.body,
        })

        // Initial refresh
        setTimeout(() => {
            ScrollTrigger.refresh()
        }, 100)

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current)
            }
            delete window.lenis
            lenis.destroy()
            ScrollTrigger.removeEventListener('refresh', () => lenis.resize())
        }
    }, [])

    return { lenisRef }
}
