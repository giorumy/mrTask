'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { API_URL } from '@/lib/api'

export default function EditTask({ task }: { task: any }) {
  const router = useRouter()
  const [staff, setStaff] = useState<any[]>([])
  const [assignedTo, setAssignedTo] = useState(task.assignedTo ?? '')
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  )
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/staff`)
      .then((r) => r.json())
      .then(setStaff)
  }, [])

  async function handleSave() {
    setLoading(true)
    await fetch(`${API_URL}/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assignedTo: assignedTo || null,
        dueDate,
      }),
    })
    setOpen(false)
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">Assignment</h2>
        <button
          onClick={() => setOpen(!open)}
          className="text-sm text-blue-600 hover:underline"
        >
          {open ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {!open ? (
        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Assigned To</p>
            <p className="text-gray-900 font-medium mt-1">
              {task.assignee?.name ?? 'Unassigned'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Due Date</p>
            <p className="text-gray-900 font-medium mt-1">
              {new Date(task.dueDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
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
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  )
}