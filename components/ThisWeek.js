import EventCard from './EventCard'

export default function ThisWeek({ events }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const weekEnd = new Date(today)
  weekEnd.setDate(weekEnd.getDate() + 7)

  const weekEvents = [...events]
    .filter(e => {
      const d = new Date(e.date + 'T12:00:00')
      return d >= today && d <= weekEnd
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  const grouped = {}
  weekEvents.forEach(ev => {
    if (!grouped[ev.date]) grouped[ev.date] = []
    grouped[ev.date].push(ev)
  })

  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    return d
  })

  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  if (weekEvents.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '48px 20px',
        background: 'var(--card)', borderRadius: 16,
        border: '1px solid var(--card-border)'
      }}>
        <div style={{ fontSize: 44, marginBottom: 14 }}>🌤️</div>
        <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 17, color: 'var(--text)' }}>
          Nothing this week
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          No school events in the next 7 days. Enjoy the break!
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 14
      }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--text-faint)'
        }}>
          UPCOMING ({weekEvents.length})
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>
          {today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
          {weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {days.map((day, i) => {
          const dateKey = day.toISOString().slice(0, 10)
          const dayEvs = grouped[dateKey] || []
          if (dayEvs.length === 0) return null

          const isToday = i === 0
          const isTomorrow = i === 1
          const dayLabel = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : dayNames[day.getDay()]

          return (
            <div key={dateKey}>
              <div style={{
                fontSize: 11, fontWeight: 600,
                color: isToday ? 'var(--teal)' : 'var(--text-faint)',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                marginBottom: 6, paddingLeft: 2
              }}>
                {dayLabel} · {monthNames[day.getMonth()]} {day.getDate()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {dayEvs.map((ev, idx) => (
                  <EventCard key={idx} event={ev} showDate={false} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
