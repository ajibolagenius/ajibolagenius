import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { tinykeys } from 'tinykeys'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { useGameStore } from './store/useGameStore'
import Home from './pages/Home'
import Approach from './pages/Approach'

function App() {
    useSmoothScroll()

    const toggleDevMode = useGameStore((state) => state.toggleDevMode)
    const devMode = useGameStore((state) => state.devMode)

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
            </Routes>
        </div>
    )
}

export default App
