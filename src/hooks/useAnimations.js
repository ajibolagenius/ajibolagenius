import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function useAnimations() {
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger)

    // Reveal animations
    gsap.utils.toArray('.reveal').forEach((reveal) => {
      const h1 = reveal.querySelector('h1')
      if (h1) {
        gsap.to(h1, {
          scrollTrigger: {
            trigger: reveal,
            start: 'top 60%',
          },
          y: 0,
          skewY: 0,
          ease: 'power2.ease',
          duration: 0.6,
        })
      }
    })

    // Sticky Scroll for tools heading
    gsap.utils.toArray('.tools_heading').forEach((heading) => {
      gsap.timeline({
        scrollTrigger: {
          trigger: heading,
          toggleActions: 'restart complete reverse resume',
          start: 'top 5%',
          scrub: true,
          pin: true,
        },
      })
    })

    // Loader animation
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

    ScrollTrigger.refresh()

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])
}
