import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function useFooterEyes() {
  const svgRef = useRef(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const mouse = svg.createSVGPoint()
    let requestId = null
    let leftEye = null
    let rightEye = null

    function updateEyes() {
      if (!leftEye || !rightEye) return

      const point = mouse.matrixTransform(svg.getScreenCTM().inverse())

      leftEye.updateCenter()
      rightEye.updateCenter()
      leftEye.rotateTo(point)
      rightEye.rotateTo(point)

      requestId = null
    }

    function onFrame() {
      updateEyes()
    }

    function onMouseMove(event) {
      mouse.x = event.clientX
      mouse.y = event.clientY

      if (!requestId) {
        requestId = requestAnimationFrame(onFrame)
      }
    }

    function onScroll() {
      if (!requestId) {
        requestId = requestAnimationFrame(onFrame)
      }
    }

    function createEye(selector) {
      const element = svg.querySelector(selector)
      if (!element) return null

      gsap.set(element, {
        transformOrigin: 'center',
      })

      let bbox = element.getBBox()
      let centerX = bbox.x + bbox.width / 2
      let centerY = bbox.y + bbox.height / 2

      function updateCenter() {
        bbox = element.getBBox()
        centerX = bbox.x + bbox.width / 2
        centerY = bbox.y + bbox.height / 2
      }

      function rotateTo(point) {
        const dx = point.x - centerX
        const dy = point.y - centerY
        const angle = Math.atan2(dy, dx)

        gsap.to(element, { duration: 0.3, rotation: angle + '_rad_short' })
      }

      return {
        element,
        rotateTo,
        updateCenter,
      }
    }

    leftEye = createEye('#left-eye')
    rightEye = createEye('#right-eye')

    if (!leftEye || !rightEye) {
      return
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
      if (requestId) {
        cancelAnimationFrame(requestId)
      }
    }
  }, [])

  return svgRef
}
