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
            background: '#e8f7f5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22
          }}>🏫</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>
              Coyote Creek Calendar
            </div>
            <div style={{ fontSize: 12, color: '#888' }}>
              Douglas County School District
            </div>
          </div>
        </div>

        <button onClick={handleRefresh} disabled={refreshing} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 14px',
          borderRadius: 8,
          border: '1px solid #ddd',
          background: 'white',
          fontSize: 13,
          fontWeight: 500,
          color: '#444',
          boxShadow: '0 1px 2px rgba(0,0,0,0.06)'
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
        background: '#e8f7f5',
        borderRadius: 8,
        padding: '8px 12px',
        marginTop: 12,
        fontSize: 12,
        color: '#0f6e62'
      }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: '#1a9e8f', display: 'inline-block', flexShrink: 0
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
