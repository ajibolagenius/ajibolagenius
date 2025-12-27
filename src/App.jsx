import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom' // Added useLocation
import { tinykeys } from 'tinykeys'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { useGameStore } from './store/useGameStore'

// Import Pages
import Home from './pages/Home'
import Approach from './pages/Approach'
import Portfolio from './pages/Portfolio'
import Resume from './pages/Resume'
import Courses from './pages/Courses'
import Contact from './pages/Contact'

function App() {
    useSmoothScroll()
    const toggleDevMode = useGameStore((state) => state.toggleDevMode)
    const devMode = useGameStore((state) => state.devMode)

    // Optional: Reset scroll on route change
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        const unsubscribe = tinykeys(window, {
            "Shift+D": () => {
                toggleDevMode()
                alert("Developer Mode Activated! 🚀")
            },
        })
        return () => unsubscribe()
    }, [])

    return (
        <div className={devMode ? "debug-screens" : ""}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/approach" element={<Approach />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/resume" element={<Resume />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
        </div>
    )
}

export default App
