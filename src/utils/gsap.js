import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

// Register ScrollTrigger globally
gsap.registerPlugin(ScrollTrigger)

// Configure GSAP to avoid string evaluation (CSP compliance)
// Use ease objects instead of strings where possible
gsap.config({
    nullTargetWarn: false,
    trialWarn: false,
})

export { gsap, ScrollTrigger }
