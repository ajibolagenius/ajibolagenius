import { create } from 'zustand'

export const useGameStore = create((set) => ({
    // The "Player" Stats
    level: 1,
    xp: 0,
    isMenuOpen: false,

    // Actions
    toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
    addXp: (amount) => set((state) => ({ xp: state.xp + amount })),

    // A "Cheat Code" mode for recruiters
    devMode: false,
    toggleDevMode: () => set((state) => ({ devMode: !state.devMode })),
}))
