'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { API_URL } from '@/lib/api'

export default function NewTemplatePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [taskType, setTaskType] = useState('CLEANING')
  const [triggerType, setTriggerType] = useState('ONE_OFF')
  const [description, setDescription] = useState('')
  const [recurrenceIntervalDays, setRecurrenceIntervalDays] = useState('')
  const [defaultAssigneeId, setDefaultAssigneeId] = useState('')
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const [isActive, setIsActive] = useState(true)
  const [properties, setProperties] = useState<any[]>([])
  const [staff, setStaff] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API_URL}/properties`)
      .then((r) => r.json())
      .then(setProperties)
    fetch(`${API_URL}/staff`)
      .then((r) => r.json())
      .then(setStaff)
  }, [])

  function toggleProperty(id: string) {
    setSelectedProperties((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  async function handleSubmit() {
    if (!name) { setError('Name is required'); return }
    if (selectedProperties.length === 0) { setError('Select at least one property'); return }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_URL}/task-templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          taskType,
          triggerType,
          description: description || undefined,
          recurrenceIntervalDays: triggerType === 'RECURRING' && recurrenceIntervalDays
            ? parseInt(recurrenceIntervalDays)
            : undefined,
          defaultAssigneeId: defaultAssigneeId || undefined,
          propertyIds: selectedProperties,
          isActive,
        }),
      })

      if (!res.ok) throw new Error('Failed to create template')

      router.push('/dashboard/templates')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg">
      <a href="/dashboard/templates" className="text-sm text-gray-500 hover:text-gray-900 mb-6 inline-block">
        ← Back to Templates
      </a>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Template</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Standard Cleaning"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Task Type</label>
          <select
            value={taskType}
            onChange={(e) => setTaskType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="CLEANING">Cleaning</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="INSPECTION">Inspection</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trigger</label>
          <select
            value={triggerType}
            onChange={(e) => setTriggerType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ONE_OFF">One Off</option>
            <option value="DEPARTURE">After Guest Departure</option>
            <option value="ARRIVAL">Before Guest Arrival</option>
            <option value="RECURRING">Recurring</option>
          </select>
        </div>

        {triggerType === 'RECURRING' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Repeat every (days)</label>
            <input
              type="number"
              value={recurrenceIntervalDays}
              onChange={(e) => setRecurrenceIntervalDays(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="7"
              min="1"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-gray-400 font-normal">(optional)</span></label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            placeholder="Additional instructions..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Default Assignee <span className="text-gray-400 font-normal">(optional)</span></label>
          <select
            value={defaultAssigneeId}
            onChange={(e) => setDefaultAssigneeId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Unassigned</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Properties</label>
          <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-48 overflow-y-auto">
            {properties.map((p) => (
              <label key={p.id} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedProperties.includes(p.id)}
                  onChange={() => toggleProperty(p.id)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-900">{p.name}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1">{selectedProperties.length} selected</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Template'}
        </button>
      </div>
    </div>
  )
}