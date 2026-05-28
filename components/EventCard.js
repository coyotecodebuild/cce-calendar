const COLORS = {
  holiday: '#e24b4a',
  event: '#378add',
  deadline: '#ef9f27',
  early: '#639922',
  other: '#888780'
}

const LABELS = {
  holiday: 'No school',
  event: 'Event',
  deadline: 'Deadline',
  early: 'Early release',
  other: 'Info'
}

export default function EventCard({ event: ev }) {
  const color = COLORS[ev.category] || COLORS.other
  const label = LABELS[ev.category] || 'Info'
  const dateStr = new Date(ev.date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  })

  return (
    <div style={{
      background: 'var(--card)',
      borderRadius: 12,
      padding: '12px 14px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      boxShadow: 'var(--shadow)',
      borderLeft: `4px solid ${color}`
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 600,
          color: 'var(--text)', marginBottom: 4
        }}>{ev.title}</div>
        <div style={{
          fontSize: 12, color: 'var(--text-muted)',
          display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center'
        }}>
          <span>📅 {dateStr}</span>
          {ev.time && <span>🕐 {ev.time}</span>}
          {ev.notes && <span style={{ color: 'var(--text-faint)' }}>{ev.notes}</span>}
        </div>
      </div>
      <div style={{
        fontSize: 11, padding: '3px 8px',
        borderRadius: 10,
        background: color + '22',
        color: color,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        flexShrink: 0
      }}>{label}</div>
    </div>
  )
}
