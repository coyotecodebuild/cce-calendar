import { useState } from 'react'

export default function Header({ lastUpdated, emailCount, onRefresh }) {
  const [refreshing, setRefreshing] = useState(false)

  async function handleRefresh() {
    setRefreshing(true)
    await onRefresh()
    setRefreshing(false)
  }

  const lastSync = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
      })
    : null

  return (
    <div style={{ paddingTop: 28, paddingBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--teal)',
            marginBottom: 4
          }}>Coyote Creek Elementary</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', lineHeight: 1.1 }}>
            School Calendar
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 4 }}>
            Douglas County School District
          </div>
        </div>

        <button onClick={handleRefresh} disabled={refreshing} style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '1px solid var(--border-mid)',
          background: 'var(--card)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, boxShadow: 'var(--shadow)'
        }}>
          <span style={{
            display: 'inline-block',
            animation: refreshing ? 'spin 1s linear infinite' : 'none'
          }}>🔄</span>
        </button>
      </div>

      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: 'var(--status-bg)',
        borderRadius: 20, padding: '5px 12px',
        marginTop: 14, fontSize: 11,
        color: 'var(--status-text)', fontWeight: 500
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#4fd1c5', display: 'inline-block',
          boxShadow: '0 0 6px #4fd1c5'
        }} />
        {lastSync
          ? `Synced ${lastSync} · ${emailCount} emails`
          : 'Waiting for first sync'
        }
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
