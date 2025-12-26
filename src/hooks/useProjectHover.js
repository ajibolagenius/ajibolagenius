import { useEffect, useRef } from 'react'

export function useProjectHover() {
  const workRef = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    const work = workRef.current
    const overlay = overlayRef.current
    if (!work || !overlay) return

    const workItems = work.querySelectorAll('.work-item')
    const prevElements = overlay.querySelectorAll('.prev')

    // Initialize overlay position
    overlay.style.top = '0%'
    overlay.style.left = '13.25%'
    const prev2 = overlay.querySelector('#prev-2')
    if (prev2) prev2.classList.add('active')

    function removeActiveClass() {
      prevElements.forEach((prev) => {
        prev.classList.remove('active')
      })
    }

    function removeAllBgColorClasses() {
      work.classList.remove('bg-color-one', 'bg-color-two', 'bg-color-three', 'bg-color-four')
    }

    const cleanupFunctions = []

    workItems.forEach((item, index) => {
      const handleMouseMove = () => {
        removeActiveClass()
        removeAllBgColorClasses()

        const activePrev = overlay.querySelector(`#prev-${index + 1}`)
        if (activePrev) {
          activePrev.classList.add('active')
        }

        work.classList.add('hovered')

        switch (index) {
          case 0:
            overlay.style.top = '50%'
            overlay.style.left = '50%'
            work.classList.add('bg-color-one')
            break
          case 1:
            overlay.style.top = '0%'
            overlay.style.left = '13.25%'
            work.classList.add('bg-color-two')
            break
          case 2:
            overlay.style.top = '-40%'
            overlay.style.left = '-13.5%'
            work.classList.add('bg-color-three')
            break
          case 3:
            overlay.style.top = '-80%'
            overlay.style.left = '-38.5%'
            work.classList.add('bg-color-four')
            break
        }
      }

      const handleMouseOut = () => {
        work.classList.remove('hovered')
        removeAllBgColorClasses()
        overlay.style.top = '0%'
        overlay.style.left = '13.25%'
        removeActiveClass()
        const prev2 = overlay.querySelector('#prev-2')
        if (prev2) prev2.classList.add('active')
      }

      item.addEventListener('mousemove', handleMouseMove)
      item.addEventListener('mouseout', handleMouseOut)

      cleanupFunctions.push(() => {
        item.removeEventListener('mousemove', handleMouseMove)
        item.removeEventListener('mouseout', handleMouseOut)
      })
    })

    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup())
    }
  }, [])

  return { workRef, overlayRef }
}
