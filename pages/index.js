import { useState, useEffect } from 'react'
import Head from 'next/head'
import Calendar from '../components/Calendar'
import EventList from '../components/EventList'
import Header from '../components/Header'
import GradeFilter, { filterEventsByGrade } from '../components/GradeFilter'
import ThisWeek from '../components/ThisWeek'

export default function Home() {
  const [events, setEvents] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [emailCount, setEmailCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('week')
  const [filter, setFilter] = useState('all')
  const [selectedGrades, setSelectedGrades] = useState([])
  const [selectedDay, setSelectedDay] = useState(null)

  useEffect(() => { fetchEvents() }, [])

  async function fetchEvents() {
    setLoading(true)
    try {
      const res = await fetch('/api/events')
      const data = await res.json()
      setEvents(data.events || [])
      setLastUpdated(data.lastUpdated)
      setEmailCount(data.emailCount || 0)
    } catch (e) {
      console.error('Failed to load events', e)
    }
    setLoading(false)
  }

  const categoryFiltered = filter === 'all' ? events : events.filter(e => e.category === filter)
  const filtered = filterEventsByGrade(categoryFiltered, selectedGrades)

  const today = new Date()
  const upcoming = filtered.filter(e => {
    const d = new Date(e.date + 'T12:00:00')
    const diff = (d - today) / 86400000
    return diff >= 0 && diff <= 7
  })
  const thisMonth = filtered.filter(e => {
    const d = new Date(e.date + 'T12:00:00')
    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
  })

  const tabs = [
    { key: 'week', label: 'This Week' },
    { key: 'calendar', label: 'Calendar' },
    { key: 'list', label: 'All Events' },
  ]

  const categoryFilters = [
    { key: 'all', label: 'All', color: null },
    { key: 'holiday', label: 'No School', color: '#e24b4a' },
    { key: 'event', label: 'Events', color: '#378add' },
    { key: 'deadline', label: 'Deadlines', color: '#ef9f27' },
    { key: 'early', label: 'Early Release', color: '#4caf7d' },
  ]

  return (
    <>
      <Head>
        <title>Coyote Creek School Calendar</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="School events for Coyote Creek Elementary - Douglas County School District" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0a0a0b" />
      </Head>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 16px 60px' }}>
        <Header lastUpdated={lastUpdated} emailCount={emailCount} onRefresh={fetchEvents} />

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10, marginBottom: 24
        }}>
          {[
            { label: 'TOTAL', value: filtered.length },
            { label: 'THIS MONTH', value: thisMonth.length },
            { label: 'THIS WEEK', value: upcoming.length },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--card)',
              borderRadius: 12, padding: '14px 16px',
              border: '1px solid var(--card-border)'
            }}>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
                color: 'var(--text-faint)', marginBottom: 6
              }}>{s.label}</div>
              <div style={{
                fontSize: 30, fontWeight: 800, color: 'var(--teal)',
                lineHeight: 1
              }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex', gap: 4,
          background: 'var(--card)',
          borderRadius: 12, padding: 4,
          marginBottom: 20,
          border: '1px solid var(--card-border)'
        }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              flex: 1, padding: '9px 8px',
              fontSize: 13, fontWeight: 600,
              background: activeTab === tab.key ? 'var(--teal)' : 'transparent',
              border: 'none', borderRadius: 9,
              color: activeTab === tab.key ? 'white' : 'var(--text-muted)',
              transition: 'all 0.15s'
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{
          display: 'flex', gap: 6, marginBottom: 16,
          flexWrap: 'wrap', alignItems: 'center'
        }}>
          {categoryFilters.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: '5px 12px', borderRadius: 20,
              border: '1px solid',
              borderColor: filter === f.key
                ? (f.color || 'var(--teal)')
                : 'var(--border-mid)',
              background: filter === f.key
                ? (f.color ? f.color + '22' : 'var(--chip-active-bg)')
                : 'var(--chip-bg)',
              color: filter === f.key
                ? (f.color || 'var(--chip-active-text)')
                : 'var(--text-muted)',
              fontSize: 12, fontWeight: filter === f.key ? 700 : 400,
              display: 'flex', alignItems: 'center', gap: 5
            }}>
              {f.color && (
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: f.color, display: 'inline-block',
                  boxShadow: filter === f.key ? `0 0 5px ${f.color}` : 'none'
                }} />
              )}
              {f.label}
            </button>
          ))}

          <div style={{ width: 1, height: 18, background: 'var(--border-mid)' }} />

          <GradeFilter
            selectedGrades={selectedGrades}
            onChange={(grades) => { setSelectedGrades(grades); setSelectedDay(null) }}
          />
        </div>

        {selectedGrades.length > 0 && (
          <div style={{
            fontSize: 12, color: 'var(--status-text)',
            marginBottom: 14, marginTop: -8,
            display: 'flex', alignItems: 'center', gap: 6
          }}>
            <span>Showing: <strong>{selectedGrades.join(', ')} Grade</strong></span>
            <span style={{ color: 'var(--text-faint)' }}>· School-wide events always shown</span>
          </div>
        )}

        {loading ? (
          <div style={{
            textAlign: 'center', padding: 48, color: 'var(--text-faint)',
            background: 'var(--card)', borderRadius: 16,
            border: '1px solid var(--card-border)'
          }}>
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '48px 20px',
            background: 'var(--card)', borderRadius: 16,
            border: '1px solid var(--card-border)'
          }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>📭</div>
            <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 17, color: 'var(--text)' }}>
              No events yet
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Check back soon — Danny will sync school emails regularly.
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'week' && <ThisWeek events={filtered} />}
            {activeTab === 'calendar' && (
              <Calendar events={filtered} selectedDay={selectedDay} onSelectDay={setSelectedDay} />
            )}
            {activeTab === 'list' && <EventList events={filtered} />}
          </>
        )}
      </div>
    </>
  )
}
