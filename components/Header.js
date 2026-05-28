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
    <div style={{ paddingTop: 24, paddingBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'var(--status-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22
          }}>🏫</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>
              Coyote Creek Calendar
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Douglas County School District
            </div>
          </div>
        </div>

        <button onClick={handleRefresh} disabled={refreshing} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 14px', borderRadius: 8,
          border: '1px solid var(--border-mid)',
          background: 'var(--card)', fontSize: 13,
          fontWeight: 500, color: 'var(--text-muted)',
          boxShadow: 'var(--shadow)'
        }}>
          <span style={{
            display: 'inline-block',
            animation: refreshing ? 'spin 1s linear infinite' : 'none'
          }}>🔄</span>
          {refreshing ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'var(--status-bg)', borderRadius: 8,
        padding: '8px 12px', marginTop: 12,
        fontSize: 12, color: 'var(--status-text)'
      }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: 'var(--teal)', display: 'inline-block', flexShrink: 0
        }} />
        {lastSync
          ? `Last updated ${lastSync} · ${emailCount} emails scanned`
          : 'Waiting for first sync from Danny'
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
