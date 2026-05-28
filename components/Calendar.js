import { useState } from 'react'
import EventCard from './EventCard'

const COLORS = {
  holiday: '#e24b4a',
  event: '#378add',
  deadline: '#ef9f27',
  early: '#639922',
  other: '#888780'
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
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
        marginBottom: 10
      }}>
        <button onClick={() => changeMonth(-1)} style={{
          width: 32, height: 32, borderRadius: 8,
          border: '1px solid var(--border-mid)',
          background: 'var(--card)', fontSize: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text)'
        }}>‹</button>
        <span style={{ fontWeight: 600, fontSize: 16, color: 'var(--text)' }}>
          {MONTHS[month]} {year}
        </span>
        <button onClick={() => changeMonth(1)} style={{
          width: 32, height: 32, borderRadius: 8,
          border: '1px solid var(--border-mid)',
          background: 'var(--card)', fontSize: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text)'
        }}>›</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 2 }}>
        {DAYS.map(d => (
          <div key={d} style={{
            textAlign: 'center', fontSize: 11,
            color: 'var(--text-faint)', padding: '4px 0', fontWeight: 500
          }}>{d}</div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`prev-${i}`} style={{
            minHeight: 56, padding: 4, borderRadius: 8,
            background: 'var(--card)', opacity: 0.3
          }}>
            <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>{prevDays - firstDay + 1 + i}</div>
          </div>
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
          const isSel = selectedDay === day
          const dayEvs = eventsForDay(day)
          const hasEvents = dayEvs.length > 0

          return (
            <div key={day} onClick={() => hasEvents && onSelectDay(isSel ? null : day)}
              style={{
                minHeight: 56, padding: 4, borderRadius: 8,
                background: isToday ? 'var(--status-bg)' : 'var(--card)',
                border: isSel ? '2px solid var(--teal)' : isToday ? '1px solid var(--teal)' : '1px solid var(--border)',
                cursor: hasEvents ? 'pointer' : 'default',
                transition: 'border-color 0.1s'
              }}>
              <div style={{
                fontSize: 11,
                color: isToday ? 'var(--teal)' : 'var(--text-muted)',
