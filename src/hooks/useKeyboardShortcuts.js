import { useEffect } from 'react'
import tinykeys from 'tinykeys'
import { useGameStore } from '../store/gameStore'

export function useKeyboardShortcuts() {
  const { toggleDevMenu, unlockAchievement } = useGameStore()

  useEffect(() => {
    // Developer shortcuts
    const unsubscribe = tinykeys(window, {
      // Toggle dev menu: Cmd/Ctrl + Shift + D
      '$mod+Shift+d': (event) => {
        event.preventDefault()
        toggleDevMenu()
      },

      // Unlock test achievement: Cmd/Ctrl + Shift + A
      '$mod+Shift+a': (event) => {
        event.preventDefault()
        unlockAchievement({
          id: 'test-achievement',
          name: 'Test Achievement',
          description: 'You found the secret shortcut!',
          icon: '🎉',
        })
      },

      // Scroll to top: Cmd/Ctrl + Shift + T
      '$mod+Shift+t': (event) => {
        event.preventDefault()
        // Get Lenis instance from window if available, otherwise use native scroll
        if (window.lenis) {
          window.lenis.scrollTo(0, { immediate: false })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      },

      // Toggle menu: Cmd/Ctrl + M
      '$mod+m': (event) => {
        event.preventDefault()
        const { toggleMenu } = useGameStore.getState()
        toggleMenu()
      },
    })

    return () => {
      unsubscribe()
    }
  }, [toggleDevMenu, unlockAchievement])
}
