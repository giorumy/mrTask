'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NewTaskPage() {
  const router = useRouter()
  const [properties, setProperties] = useState<any[]>([])
  const [staff, setStaff] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [type, setType] = useState('CLEANING')
  const [propertyId, setPropertyId] = useState('')
  const [assigneeId, setAssigneeId] = useState('')
  const [dueDate, setDueDate] = useState('')

  useEffect(() => {
    fetch('http://localhost:3001/properties')
      .then((r) => r.json())
      .then(setProperties)

    fetch('http://localhost:3001/staff')
      .then((r) => r.json())
      .then(setStaff)
  }, [])

  async function handleSubmit() {
    if (!title || !propertyId || !dueDate) {
      setError('Title, property and due date are required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          type,
          propertyId,
          assigneeId: assigneeId || undefined,
          dueDate,
        }),
      })

      if (!res.ok) throw new Error('Failed to create task')

      router.push('/dashboard/tasks')
      router.refresh()
    } catch (e) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md">
      <a href="/dashboard/tasks" className="text-sm text-gray-500 hover:text-gray-900 mb-6 inline-block">
        ← Back to Tasks
      </a>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Task</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Standard Cleaning"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="CLEANING">Cleaning</option>
            <option value="INSPECTION">Inspection</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
          <select
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a property</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
          <select
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Unassigned</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </div>
    </div>
  )
}