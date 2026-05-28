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
    const key = ev.date
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(ev)
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
        textAlign: 'center', padding: '40px 20px',
        background: 'white', borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🌤️</div>
        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 16 }}>Nothing this week</div>
        <div style={{ fontSize: 14, color: '#888' }}>
          No school events in the next 7 days. Enjoy the break!
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{
        background: '#e8f7f5',
        borderRadius: 10,
        padding: '10px 14px',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 13,
        color: '#0f6e62'
      }}>
        <span>
          <strong>{weekEvents.length} event{weekEvents.length !== 1 ? 's' : ''}</strong> this week
        </span>
        <span style={{ fontSize: 12, color: '#888' }}>
          {today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
          {weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {days.map((day, i) => {
          const dateKey = day.toISOString().slice(0, 10)
          const dayEvs = grouped[dateKey] || []
          const isToday = i === 0
          const isTomorrow = i === 1
          const isWeekend = day.getDay() === 0 || day.getDay() === 6

          const dayLabel = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : dayNames[day.getDay()]
          const dateLabel = `${monthNames[day.getMonth()]} ${day.getDate()}`

          return (
            <div key={dateKey}>
              <div style={{
                display: 'flex', alignItems: 'center',
                gap: 10, marginBottom: dayEvs.length > 0 ? 8 : 0
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: isToday ? '#1a9e8f' : isWeekend ? '#f5f5f5' : 'white',
                  border: isToday ? 'none' : '1px solid #eee',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span style={{
                    fontSize: 14, fontWeight: 700, lineHeight: 1,
                    color: isToday ? 'white' : isWeekend ? '#bbb' : '#333'
                  }}>{day.getDate()}</span>
                </div>

                <div>
                  <div style={{
                    fontSize: 14, fontWeight: isToday ? 700 : 500,
                    color: isToday ? '#1a9e8f' : isWeekend ? '#bbb' : '#333'
                  }}>
                    {dayLabel}
                    {isToday && (
                      <span style={{
                        marginLeft: 6, fontSize: 11,
                        background: '#1a9e8f', color: 'white',
                        padding: '1px 6px', borderRadius: 10, fontWeight: 600
                      }}>Today</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: '#aaa' }}>{dateLabel}</div>
                </div>

                {dayEvs.length === 0 && (
                  <div style={{ flex: 1, height: 1, background: '#f0f0f0', marginLeft: 4 }} />
                )}
              </div>

              {dayEvs.length > 0 && (
                <div style={{ marginLeft: 46, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {dayEvs.map((ev, idx) => <EventCard key={idx} event={ev} />)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
