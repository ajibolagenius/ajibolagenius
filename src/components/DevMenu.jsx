import { useGameStore } from '../store/gameStore'
import { X } from '@phosphor-icons/react'

function DevMenu() {
  const { isDevMenuOpen, toggleDevMenu, unlockedAchievements, achievements } = useGameStore()

  if (!isDevMenuOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 9999,
        padding: '2rem',
        color: '#e9e9e9',
        fontFamily: 'monospace',
        overflow: 'auto',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Developer Menu</h2>
          <button
            onClick={toggleDevMenu}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#e9e9e9',
              cursor: 'pointer',
              padding: '0.5rem',
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Keyboard Shortcuts</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <kbd style={{ backgroundColor: '#323232', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                Cmd/Ctrl + Shift + D
              </kbd>{' '}
              - Toggle Dev Menu
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <kbd style={{ backgroundColor: '#323232', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                Cmd/Ctrl + Shift + A
              </kbd>{' '}
              - Unlock Test Achievement
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <kbd style={{ backgroundColor: '#323232', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                Cmd/Ctrl + Shift + T
              </kbd>{' '}
              - Scroll to Top
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <kbd style={{ backgroundColor: '#323232', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                Cmd/Ctrl + M
              </kbd>{' '}
              - Toggle Menu
            </li>
          </ul>
        </div>

        <div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            Achievements ({unlockedAchievements.length})
          </h3>
          {achievements.length === 0 ? (
            <p style={{ color: '#5f5f5f' }}>No achievements unlocked yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {achievements.map((achievement) => (
                <li
                  key={achievement.id}
                  style={{
                    marginBottom: '1rem',
                    padding: '1rem',
                    backgroundColor: '#323232',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '2rem' }}>{achievement.icon || '🏆'}</span>
                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                        {achievement.name}
                      </div>
                      <div style={{ color: '#5f5f5f', fontSize: '0.9rem' }}>
                        {achievement.description}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default DevMenu
