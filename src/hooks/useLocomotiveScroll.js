import { useEffect, useRef } from 'react'
import LocomotiveScroll from 'locomotive-scroll'
import { ScrollTrigger } from '../utils/gsap'

export function useLocomotiveScroll() {
    const scrollRef = useRef(null)
    const locoScrollRef = useRef(null)

    useEffect(() => {
        if (!scrollRef.current) return

        const locoScroll = new LocomotiveScroll({
            el: scrollRef.current,
            smooth: true,
            smoothMobile: true,
        })

        locoScrollRef.current = locoScroll

        // ResizeObserver for dynamic updates
        const resizeObserver = new ResizeObserver(() => locoScroll.update())
        resizeObserver.observe(scrollRef.current)

        // ScrollTrigger integration
        ScrollTrigger.scrollerProxy(scrollRef.current, {
            scrollTop(value) {
                if (value !== undefined) {
                    locoScroll.scrollTo(value, 0, 0)
                }
                return locoScroll.scroll.instance.scroll.y
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight,
                }
            },
            pinType: scrollRef.current.style.transform ? 'transform' : 'fixed',
        })

        locoScroll.on('scroll', ScrollTrigger.update)

        ScrollTrigger.addEventListener('refresh', () => locoScroll.update())

        ScrollTrigger.defaults({
            scroller: scrollRef.current,
        })

        // Small delay to ensure everything is initialized
        setTimeout(() => {
            ScrollTrigger.refresh()
        }, 100)

        return () => {
            resizeObserver.disconnect()
            if (locoScroll) {
                locoScroll.destroy()
            }
            ScrollTrigger.removeEventListener('refresh', () => locoScroll.update())
        }
    }, [])

    return { scrollRef, locoScrollRef }
}
