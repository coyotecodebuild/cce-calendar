import { useState, useEffect } from 'react'
import Head from 'next/head'
import Calendar from '../components/Calendar'
import EventList from '../components/EventList'
import Header from '../components/Header'

export default function Home() {
  const [events, setEvents] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [emailCount, setEmailCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('calendar')
  const [filter, setFilter] = useState('all')
  const [selectedDay, setSelectedDay] = useState(null)

  useEffect(() => {
    fetchEvents()
  }, [])

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

  const filtered = filter === 'all'
    ? events
    : events.filter(e => e.category === filter)

  const today = new Date()
  const upcoming = events.filter(e => {
    const d = new Date(e.date + 'T12:00:00')
    const diff = (d - today) / 86400000
    return diff >= 0 && diff <= 7
  })
  const thisMonth = events.filter(e => {
    const d = new Date(e.date + 'T12:00:00')
    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
  })

  return (
    <>
      <Head>
        <title>Coyote Creek School Calendar</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="School events for Coyote Creek Elementary - Douglas County School District" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1a9e8f" />
      </Head>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 16px 40px' }}>
        <Header lastUpdated={lastUpdated} emailCount={emailCount} onRefresh={fetchEvents} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10,
          marginBottom: 20
        }}>
          {[
            { label: 'Total events', value: events.length },
            { label: 'This month', value: thisMonth.length },
            { label: 'Next 7 days', value: upcoming.length },
          ].map(s => (
            <div key={s.label} style={{
              background: 'white',
              borderRadius: 10,
              padding: '12px 14px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
            }}>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 26, fontWeight: 600, color: '#1a9e8f' }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex',
          borderBottom: '1px solid #eee',
          marginBottom: 16,
          gap: 4
        }}>
          {['calendar', 'list'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '10px 16px',
              fontSize: 14,
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #1a9e8f' : '2px solid transparent',
              color: activeTab === tab ? '#1a9e8f' : '#888',
              fontWeight: activeTab === tab ? 600 : 400,
              textTransform: 'capitalize',
              marginBottom: -1
            }}>
              {tab === 'calendar' ? '📅 Calendar' : '📋 List'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'All' },
            { key: 'holiday', label: '🔴 No school' },
            { key: 'event', label: '🔵 Events' },
            { key: 'deadline', label: '🟡 Deadlines' },
            { key: 'early', label: '🟢 Early release' },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: '5px 12px',
              borderRadius: 20,
              border: '1px solid',
              borderColor: filter === f.key ? '#1a9e8f' : '#ddd',
              background: filter === f.key ? '#e8f7f5' : 'white',
              color: filter === f.key ? '#1a9e8f' : '#666',
              fontSize: 12,
              fontWeight: filter === f.key ? 600 : 400
            }}>
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: 40, color: '#888',
            background: 'white', borderRadius: 12,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>No events yet</div>
            <div style={{ fontSize: 14 }}>Check back soon — Danny will sync school emails regularly.</div>
          </div>
        ) : (
          <>
            {activeTab === 'calendar' && (
              <Calendar
                events={filtered}
                selectedDay={selectedDay}
                onSelectDay={setSelectedDay}
              />
            )}
            {activeTab === 'list' && (
              <EventList events={filtered} />
            )}
          </>
        )}
      </div>
    </>
  )
}
