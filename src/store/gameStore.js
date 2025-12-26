import { create } from 'zustand'

export const useGameStore = create((set) => ({
    // Achievements
    achievements: [],
    unlockedAchievements: [],

    // Menu states
    isMenuOpen: false,
    isDevMenuOpen: false,

    // Game UI states
    showNotifications: true,
    notificationQueue: [],

    // Actions
    unlockAchievement: (achievement) => set((state) => {
        if (state.unlockedAchievements.includes(achievement.id)) {
            return state
        }
        return {
            unlockedAchievements: [...state.unlockedAchievements, achievement.id],
            achievements: [...state.achievements, achievement],
            notificationQueue: [
                ...state.notificationQueue,
                {
                    id: Date.now(),
                    type: 'achievement',
                    message: `Achievement Unlocked: ${achievement.name}`,
                    achievement,
                },
            ],
        }
    }),

    toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
    toggleDevMenu: () => set((state) => ({ isDevMenuOpen: !state.isDevMenuOpen })),

    addNotification: (notification) => set((state) => ({
        notificationQueue: [...state.notificationQueue, notification],
    })),

    removeNotification: (id) => set((state) => ({
        notificationQueue: state.notificationQueue.filter((n) => n.id !== id),
    })),

    clearNotifications: () => set({ notificationQueue: [] }),
}))
