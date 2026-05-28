import EventCard from './EventCard'

export default function EventList({ events }) {
  const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date))

  if (!sorted.length) {
    return (
      <div style={{ textAlign: 'center', padding: 40, color: '#888', fontSize: 14 }}>
        No events match this filter
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {sorted.map((ev, i) => <EventCard key={i} event={ev} />)}
    </div>
  )
}
