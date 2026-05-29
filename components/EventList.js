import EventCard from './EventCard'

export default function EventList({ events }) {
  const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date))

  const grouped = {}
  sorted.forEach(ev => {
    const d = new Date(ev.date + 'T12:00:00')
    const key = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(ev)
  })

  if (!sorted.length) {
    return (
      <div style={{
        textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)',
        fontSize: 14, background: 'var(--card)', borderRadius: 16,
        border: '1px solid var(--card-border)'
      }}>
        No events match this filter
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {Object.entries(grouped).map(([month, evs]) => (
        <div key={month}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--text-faint)',
            marginBottom: 10
          }}>{month} ({evs.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {evs.map((ev, i) => <EventCard key={i} event={ev} />)}
          </div>
        </div>
      ))}
    </div>
  )
}
