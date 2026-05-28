import { useState } from 'react'

const GRADES = ['K', '1st', '2nd', '3rd', '4th', '5th', '6th']

const GRADE_KEYWORDS = {
  'K':    ['kindergarten', 'kinder', 'k '],
  '1st':  ['1st grade', 'first grade', 'grade 1'],
  '2nd':  ['2nd grade', 'second grade', 'grade 2'],
  '3rd':  ['3rd grade', 'third grade', 'grade 3'],
  '4th':  ['4th grade', 'fourth grade', 'grade 4'],
  '5th':  ['5th grade', 'fifth grade', 'grade 5'],
  '6th':  ['6th grade', 'sixth grade', 'grade 6'],
}

export function filterEventsByGrade(events, selectedGrades) {
  if (!selectedGrades || selectedGrades.length === 0) return events

  return events.filter(ev => {
    const text = ((ev.title || '') + ' ' + (ev.notes || '')).toLowerCase()

    const mentionsAnyGrade = Object.values(GRADE_KEYWORDS).some(keywords =>
      keywords.some(kw => text.includes(kw))
    )

    if (!mentionsAnyGrade) return true

    return selectedGrades.some(grade =>
      GRADE_KEYWORDS[grade]?.some(kw => text.includes(kw))
    )
  })
}

export default function GradeFilter({ selectedGrades, onChange }) {
  const [open, setOpen] = useState(false)

  function toggleGrade(grade) {
    if (selectedGrades.includes(grade)) {
      onChange(selectedGrades.filter(g => g !== grade))
    } else {
      onChange([...selectedGrades, grade])
    }
  }

  const hasSelection = selectedGrades.length > 0
  const label = hasSelection ? selectedGrades.join(', ') : 'All grades'

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          padding: '5px 12px',
          borderRadius: 20,
          border: '1px solid',
          borderColor: hasSelection ? '#1a9e8f' : '#ddd',
          background: hasSelection ? '#e8f7f5' : 'white',
          color: hasSelection ? '#1a9e8f' : '#666',
          fontSize: 12,
          fontWeight: hasSelection ? 600 : 400,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          whiteSpace: 'nowrap'
        }}
      >
        🎓 {label}
        <span style={{ fontSize: 10 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 10 }}
          />
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            zIndex: 20,
            background: 'white',
            borderRadius: 12,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            border: '1px solid #eee',
            padding: '12px 14px',
            minWidth: 180
          }}>
            <div style={{
              fontSize: 11, fontWeight: 600, color: '#999',
              textTransform: 'uppercase', letterSpacing: '0.05em',
              marginBottom: 10
            }}>Filter by grade</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button
                onClick={() => { onChange([]); setOpen(false) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 8px', borderRadius: 8,
                  border: 'none',
                  background: selectedGrades.length === 0 ? '#e8f7f5' : 'transparent',
                  color: selectedGrades.length === 0 ? '#1a9e8f' : '#444',
                  fontSize: 13, fontWeight: selectedGrades.length === 0 ? 600 : 400,
                  textAlign: 'left', cursor: 'pointer'
                }}
              >
                <span style={{
                  width: 16, height: 16, borderRadius: '50%',
                  border: '2px solid',
                  borderColor: selectedGrades.length === 0 ? '#1a9e8f' : '#ccc',
                  background: selectedGrades.length === 0 ? '#1a9e8f' : 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {selectedGrades.length === 0 && (
                    <span style={{ color: 'white', fontSize: 10 }}>✓</span>
                  )}
                </span>
                All grades
              </button>

              {GRADES.map(grade => {
                const selected = selectedGrades.includes(grade)
                return (
                  <button
                    key={grade}
                    onClick={() => toggleGrade(grade)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '6px 8px', borderRadius: 8,
                      border: 'none',
                      background: selected ? '#e8f7f5' : 'transparent',
                      color: selected ? '#1a9e8f' : '#444',
                      fontSize: 13, fontWeight: selected ? 600 : 400,
                      textAlign: 'left', cursor: 'pointer'
                    }}
                  >
                    <span style={{
                      width: 16, height: 16, borderRadius: 4,
                      border: '2px solid',
                      borderColor: selected ? '#1a9e8f' : '#ccc',
                      background: selected ? '#1a9e8f' : 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {selected && <span style={{ color: 'white', fontSize: 10 }}>✓</span>}
                    </span>
                    {grade} Grade
                  </button>
                )
              })}
            </div>

            {hasSelection && (
              <button
                onClick={() => { onChange([]); setOpen(false) }}
                style={{
                  marginTop: 10, width: '100%',
                  padding: '6px 0', borderRadius: 8,
                  border: '1px solid #eee',
                  background: 'white', color: '#888',
                  fontSize: 12, cursor: 'pointer'
                }}
              >
                Clear grade filter
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
