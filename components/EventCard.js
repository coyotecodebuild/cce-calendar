const COLORS = {
  holiday: '#e24b4a',
  event: '#378add',
  deadline: '#ef9f27',
  early: '#4caf7d',
  other: '#71717a'
}

const LABELS = {
  holiday: 'No School',
  event: 'Event',
  deadline: 'Deadline',
  early: 'Early Release',
  other: 'Info'
}

export default function EventCard({ event: ev, showDate = true }) {
  const color = COLORS[ev.category] || COLORS.other
  const label = LABELS[ev.category] || 'Info'
  const date = new Date(ev.date + 'T12:00:00')
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  const day = date.getDate()

  return (
    <div style={{
      background: 'var(--card)',
      borderRadius: 14,
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 14,
      border: '1px solid var(--card-border)',
      borderLeft: `3px solid ${color}`,
      boxShadow: 'var(--shadow-card)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 60,
        background: `linear-gradient(to right, ${color}15, transparent)`,
        pointerEvents: 'none'
      }} />

      {showDate && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          minWidth: 36, paddingTop: 2, flexShrink: 0
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
            color: color, lineHeight: 1
          }}>{month}</div>
          <div style={{
            fontSize: 26, fontWeight: 800, color: 'var(--text)',
            lineHeight: 1.1
          }}>{day}</div>
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 15, fontWeight: 700,
          color: 'var(--text)', marginBottom: 4, lineHeight: 1.3
        }}>{ev.title}</div>
        <div style={{
          fontSize: 12, color: 'var(--text-muted)',
          display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center'
        }}>
          {ev.time && <span>🕐 {ev.time}</span>}
          {ev.notes && <span style={{ color: 'var(--text-faint)' }}>{ev.notes}</span>}
        </div>
      </div>

      <div style={{
        fontSize: 11, padding: '3px 10px',
        borderRadius: 20,
        background: color + '22',
        color: color,
        fontWeight: 700,
        whiteSpace: 'nowrap',
        flexShrink: 0,
        letterSpacing: '0.03em',
        border: `1px solid ${color}33`
      }}>{label}</div>
    </div>
  )
}
