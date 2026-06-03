'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { API_URL } from '@/lib/api'

export default function NewStaffPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('CLEANER')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!name || !email) {
      setError('Name and email are required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_URL}/staff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.message ?? 'Something went wrong')
        return
      }

      router.push('/dashboard/staff')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md">
      <a href="/dashboard/staff" className="text-sm text-gray-500 hover:text-gray-900 mb-6 inline-block">
        ← Back to Staff
      </a>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Staff Member</h1>

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
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="john@example.com"
          />
          <p className="text-xs text-gray-400 mt-1">An invitation will be sent to this email</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="CLEANER">Cleaner</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="BOTH">Both</option>
          </select>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Staff Member'}
        </button>
      </div>
    </div>
  )
}