'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { API_URL } from '@/lib/api'

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function TaskCard({ task }: { task: any }) {
  return (
    <a
      href={`/staff/tasks/${task.id}`}
      className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-gray-900 text-sm">{task.title}</p>
        <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${statusColors[task.status]}`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>
      <p className="text-xs text-gray-500 mt-2">{task.property?.name}</p>
    </a>
  )
}

export default function StaffTasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<any[]>([])
  const [staffName, setStaffName] = useState('')
  const [loading, setLoading] = useState(true)
  const [calendarExpanded, setCalendarExpanded] = useState(false)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [selectedDate, setSelectedDate] = useState(new Date(today))
  const [monthStart, setMonthStart] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  // week containing selected date
  const weekStart = new Date(selectedDate)
  weekStart.setDate(selectedDate.getDate() - selectedDate.getDay())
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return d
  })

  // month grid
  const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate()
  const firstDayOfWeek = monthStart.getDay()
  const monthDays = Array.from({ length: firstDayOfWeek + daysInMonth }, (_, i) => {
    if (i < firstDayOfWeek) return null
    const d = new Date(monthStart)
    d.setDate(i - firstDayOfWeek + 1)
    return d
  })

  useEffect(() => {
    const token = localStorage.getItem('staff_token')
    const name = localStorage.getItem('staff_name')
    if (!token) { router.push('/staff/login'); return }
    setStaffName(name ?? '')
    const payload = JSON.parse(atob(token.split('.')[1]))
    const staffId = payload.sub
    fetch(` ${API_URL}/tasks?assigneeId=${staffId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setTasks(data); setLoading(false) })
  }, [])

  function handleLogout() {
    localStorage.removeItem('staff_token')
    localStorage.removeItem('staff_name')
    router.push('/staff/login')
  }

  const hasTasksOnDate = (date: Date) =>
    tasks.some((t) => isSameDay(new Date(t.dueDate), date))

  const tasksForSelected = tasks.filter((t) =>
    isSameDay(new Date(t.dueDate), selectedDate)
  )

  const upcoming = tasks.filter((t) => {
    const due = new Date(t.dueDate)
    due.setHours(0, 0, 0, 0)
    return due > selectedDate
  })

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <p className="text-xs text-gray-400">
            {today.toLocaleDateString('en-US', { weekday: 'short' })},
          </p>
          <p className="text-xl font-bold text-gray-900">
            {today.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCalendarExpanded(!calendarExpanded)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-lg"
          >
            📅
            {tasks.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
            )}
          </button>
          <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-gray-700">
            Logout
          </button>
        </div>
      </div>

      {/* Expanded Month Calendar */}
      {calendarExpanded && (
  <div style={{ background: 'white', borderBottom: '1px solid #f3f4f6', padding: '16px 24px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
      <p style={{ fontWeight: 600, color: '#111827' }}>
        {monthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </p>
      <div style={{ display: 'flex', gap: '4px' }}>
        <button
          onClick={() => setMonthStart(new Date(monthStart.getFullYear(), monthStart.getMonth() - 1, 1))}
          style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '18px', color: '#6b7280' }}
        >‹</button>
        <button
          onClick={() => setMonthStart(new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1))}
          style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '18px', color: '#6b7280' }}
        >›</button>
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '4px' }}>
      {dayNames.map((d) => (
        <p key={d} style={{ textAlign: 'center', fontSize: '11px', color: '#9ca3af', fontWeight: 500, margin: 0 }}>{d}</p>
      ))}
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
      {monthDays.map((day, i) => {
        if (!day) return <div key={i} />
        const isSelected = isSameDay(day, selectedDate)
        const isToday = isSameDay(day, today)
        const hasTasks = hasTasksOnDate(day)
        return (
          <button
            key={i}
            onClick={() => { setSelectedDate(new Date(day)); setCalendarExpanded(false) }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '6px 0',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              background: isSelected ? '#111827' : isToday ? '#eff6ff' : 'transparent',
            }}
          >
            <span style={{
              fontSize: '13px',
              fontWeight: 500,
              color: isSelected ? 'white' : isToday ? '#2563eb' : '#374151',
            }}>
              {day.getDate()}
            </span>
            <div style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              marginTop: '2px',
              background: hasTasks ? (isSelected ? 'white' : '#3b82f6') : 'transparent',
            }} />
          </button>
        )
      })}
    </div>
  </div>
)}

      {/* Week Strip */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
          {weekDays.map((day, i) => {
            const isSelected = isSameDay(day, selectedDate)
            const isToday = isSameDay(day, today)
            const hasTasks = hasTasksOnDate(day)
            return (
              <button
  key={i}
  onClick={() => setSelectedDate(new Date(day))}
  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0', borderRadius: '12px', background: isSelected ? '#111827' : 'transparent', border: 'none', cursor: 'pointer', width: '100%' }}
>
  <span style={{ fontSize: '11px', marginBottom: '4px', color: isSelected ? '#d1d5db' : '#9ca3af' }}>
    {dayNames[day.getDay()]}
  </span>
  <span style={{ fontSize: '14px', fontWeight: 600, color: isSelected ? 'white' : isToday ? '#2563eb' : '#1f2937' }}>
    {day.getDate()}
  </span>
  <div style={{ width: '4px', height: '4px', borderRadius: '50%', marginTop: '4px', background: hasTasks ? (isSelected ? 'white' : '#3b82f6') : 'transparent' }} />
</button>
            )
          })}
        </div>
      </div>

    {/* Tasks for selected day */}
<div className="px-6 py-4">
  <div className="flex items-center justify-between mb-4">
    <p className="font-semibold text-gray-900">
      {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
    </p>
    <span className="text-xs text-gray-400">{tasksForSelected.length} tasks</span>
  </div>

  {tasksForSelected.length === 0 ? (
    <div className="text-center py-8">
      <p className="text-gray-400 text-sm">No tasks for this day</p>
    </div>
  ) : (
    <div className="space-y-3 mb-6">
      {tasksForSelected.map((task) => <TaskCard key={task.id} task={task} />)}
    </div>
  )}

  {/* Upcoming tasks */}
  {(() => {
    const upcoming = tasks.filter((t) => {
      const due = new Date(t.dueDate)
      due.setHours(0, 0, 0, 0)
      return due > selectedDate
    })
    if (upcoming.length === 0) return null
    return (
      <div className="mt-6">
        <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-4">
          Upcoming Tasks
        </p>
        <div className="space-y-3">
          {upcoming.map((task) => (
            <a
              key={task.id}
              href={`/staff/tasks/${task.id}`}
              className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-gray-900 text-sm">{task.title}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${statusColors[task.status]}`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{task.property?.name}</p>
              <p className="text-xs text-gray-400 mt-1">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            </a>
          ))}
        </div>
      </div>
    )
  })()}
</div>
    </div>
  )
}