'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewStaffPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!name || !pin) {
      setError('Name and PIN are required')
      return
    }
    if (pin.length < 4) {
      setError('PIN must be at least 4 digits')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('http://localhost:3001/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, pin }),
      })

      if (!res.ok) throw new Error('Failed to create staff member')

      router.push('/dashboard/staff')
      router.refresh()
    } catch (e) {
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
          <label className="block text-sm font-medium text-gray-700 mb-1">PIN</label>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="4-digit PIN"
            maxLength={6}
          />
          <p className="text-xs text-gray-500 mt-1">Staff will use this PIN to log in</p>
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