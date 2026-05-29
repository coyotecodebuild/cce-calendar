import { useState } from 'react'
import EventCard from './EventCard'

const COLORS = {
  holiday: '#e24b4a',
  event: '#378add',
  deadline: '#ef9f27',
  early: '#4caf7d',
  other: '#71717a'
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function Calendar({ events, selectedDay, onSelectDay }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  function changeMonth(dir) {
    let m = month + dir
    let y = year
    if (m > 11) { m = 0; y++ }
    if (m < 0) { m = 11; y-- }
    setMonth(m)
    setYear(y)
    onSelectDay(null)
  }

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevDays = new Date(year, month, 0).getDate()

  function eventsForDay(day) {
    return events.filter(e => {
      const d = new Date(e.date + 'T12:00:00')
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
    })
  }

  const selectedEvents = selectedDay ? eventsForDay(selectedDay) : []

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16
      }}>
        <button onClick={() => changeMonth(-1)} style={{
          width: 34, height: 34, borderRadius: 10,
          border: '1px solid var(--border-mid)',
          background: 'var(--card)', fontSize: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)'
        }}>‹</button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>
            {MONTHS[month]}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>{year}</div>
        </div>
        <button onClick={() => changeMonth(1)} style={{
          width: 34, height: 34, borderRadius: 10,
          border: '1px solid var(--border-mid)',
          background: 'var(--card)', fontSize: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)'
        }}>›</button>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 3, marginBottom: 3
      }}>
        {DAYS.map((d, i) => (
          <div key={i} style={{
            textAlign: 'center', fontSize: 11, fontWeight: 700,
            color: 'var(--text-faint)', padding: '4px 0',
            letterSpacing: '0.05em'
          }}>{d}</div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`prev-${i}`} style={{
            minHeight: 50, padding: 5, borderRadius: 10,
            background: 'var(--bg-2)', opacity: 0.4
          }}>
            <div style={{ fontSize: 12, color: 'var(--text-faint)', fontWeight: 500 }}>
              {prevDays - firstDay + 1 + i}
            </div>
          </div>
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
          const isSel = selectedDay === day
          const dayEvs = eventsForDay(day)
          const hasEvents = dayEvs.length > 0

          return (
            <div key={day}
              onClick={() => hasEvents && onSelectDay(isSel ? null : day)}
              style={{
                minHeight: 50, padding: 5, borderRadius: 10,
                background: isSel ? 'var(--teal-glow)' : isToday ? 'rgba(26,158,143,0.08)' : 'var(--card)',
                border: isSel ? '1px solid rgba(26,158,143,0.5)' : isToday ? '1px solid rgba(26,158,143,0.3)' : '1px solid var(--card-border)',
                cursor: hasEvents ? 'pointer' : 'default',
                transition: 'all 0.15s'
              }}>
              <div style={{
                fontSize: 12, fontWeight: isToday ? 800 : 500,
                color: isToday ? '#4fd1c5' : 'var(--text-muted)',
                marginBottom: 3
              }}>{day}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {dayEvs.slice(0, 3).map((ev, idx) => (
                  <div key={idx} style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: COLORS[ev.category] || COLORS.other,
                    boxShadow: `0 0 4px ${COLORS[ev.category] || COLORS.other}88`
                  }} />
                ))}
              </div>
            </div>
          )
        })}

        {Array.from({ length: (7 - ((firstDay + daysInMonth) % 7)) % 7 }).map((_, i) => (
          <div key={`next-${i}`} style={{
            minHeight: 50, padding: 5, borderRadius: 10,
            background: 'var(--bg-2)', opacity: 0.4
          }}>
            <div style={{ fontSize: 12, color: 'var(--text-faint)', fontWeight: 500 }}>{i + 1}</div>
          </div>
        ))}
      </div>

      {selectedDay && selectedEvents.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: 'var(--text-faint)',
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10
          }}>
            {new Date(year, month, selectedDay).toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric'
            }).toUpperCase()}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {selectedEvents.map((ev, i) => <EventCard key={i} event={ev} showDate={false} />)}
          </div>
        </div>
      )}
    </div>
  )
}

