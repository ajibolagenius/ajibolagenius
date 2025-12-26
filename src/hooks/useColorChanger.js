import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'

export function useColorChanger() {
  useEffect(() => {

    const triggers = []
    let timeoutId

    // Wait for DOM and Lenis to be ready
    timeoutId = setTimeout(() => {
      const mainElement = document.querySelector('#main')
      if (!mainElement) return

      const scrollColorElems = document.querySelectorAll('[data-bgcolor]')

      if (scrollColorElems.length === 0) return

      scrollColorElems.forEach((colorSection, i) => {
        const prevBg = i === 0 ? '' : scrollColorElems[i - 1].dataset.bgcolor
        const prevText = i === 0 ? '' : scrollColorElems[i - 1].dataset.textcolor

        const trigger = ScrollTrigger.create({
          trigger: colorSection,
          scroller: document.body,
          start: 'top 50%',
          onEnter: () => {
            const main = document.querySelector('#main')
            if (main) {
              gsap.to(main, {
                backgroundColor: colorSection.dataset.bgcolor,
                color: colorSection.dataset.textcolor,
                overwrite: 'auto',
              })
            }
          },
          onLeaveBack: () => {
            const main = document.querySelector('#main')
            if (main) {
              gsap.to(main, {
                backgroundColor: prevBg,
                color: prevText,
                overwrite: 'auto',
              })
            }
          },
        })

        triggers.push(trigger)
      })
    }, 200)

    return () => {
      clearTimeout(timeoutId)
      triggers.forEach((trigger) => {
        if (trigger) trigger.kill()
      })
      // Clean up any remaining color changer triggers
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger && trigger.vars?.trigger?.hasAttribute('data-bgcolor')) {
          trigger.kill()
        }
      })
    }
  }, [])
}
