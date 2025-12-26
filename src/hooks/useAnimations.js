import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'

export function useAnimations() {
  useEffect(() => {
    const triggers = []

    // Loader animation - runs immediately
    let counter = { value: 0 }

    gsap.to(counter, {
      duration: 2,
      value: 100,
      ease: 'none',
      onUpdate: function () {
        const currentPercentage = Math.ceil(counter.value)
        const counterEl = document.getElementById('counter')
        if (counterEl) {
          counterEl.textContent = currentPercentage + '%'
        }

        gsap.to('.bar2', {
          width: currentPercentage + '%',
          ease: 'none',
          duration: 0.1,
        })
      },
      onComplete: () => {
        const tl4 = gsap.timeline()
        tl4.to('.counter', {
          ease: 'power4.inOut',
          opacity: 0,
          duration: 0.5,
        })

        tl4.to(
          '.bar',
          {
            ease: 'power4.inOut',
            opacity: 0,
            duration: 0.5,
          },
          '-=.3'
        )

        tl4.to('.loader-container', {
          y: '-120%',
          ease: 'power4.inOut',
          duration: 1.6,
        })
      },
    })

    // Wait for DOM and Locomotive Scroll to be ready for scroll animations
    const timeoutId = setTimeout(() => {
      const mainElement = document.querySelector('#main')
      if (!mainElement) return

      // Reveal animations
      const revealElements = gsap.utils.toArray('.reveal')
      revealElements.forEach((reveal) => {
        const h1 = reveal.querySelector('h1')
        if (h1) {
          const trigger = gsap.to(h1, {
            scrollTrigger: {
              trigger: reveal,
              start: 'top 60%',
              scroller: '#main',
            },
            y: 0,
            skewY: 0,
            ease: 'power2.ease',
            duration: 0.6,
          })
          if (trigger.scrollTrigger) {
            triggers.push(trigger.scrollTrigger)
          }
        }
      })

      // Sticky Scroll for tools heading
      const toolHeadings = gsap.utils.toArray('.tools_heading')
      toolHeadings.forEach((heading) => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: heading,
            toggleActions: 'restart complete reverse resume',
            start: 'top 5%',
            scrub: true,
            pin: true,
            scroller: '#main',
          },
        })
        if (timeline.scrollTrigger) {
          triggers.push(timeline.scrollTrigger)
        }
      })

      ScrollTrigger.refresh()
    }, 200)

    return () => {
      clearTimeout(timeoutId)
      triggers.forEach((trigger) => {
        if (trigger) trigger.kill()
      })
      // Also kill any remaining triggers
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger && !triggers.includes(trigger)) {
          trigger.kill()
        }
      })
    }
  }, [])
}
