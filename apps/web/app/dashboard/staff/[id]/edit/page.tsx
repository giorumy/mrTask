'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { API_URL } from '@/lib/api'

export default function EditStaffPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('CLEANER')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API_URL}/staff/${id}`)
      .then((r) => r.json())
      .then((member) => {
        if (member) {
          setName(member.name)
          setEmail(member.email ?? '')
          setRole(member.role)
        }
      })
  }, [id])

  async function handleSubmit() {
    if (!name || !email) {
      setError('Name and email are required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_URL}/staff/${id}`, {
        method: 'PATCH',
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

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this staff member?')) return
    await fetch(`${API_URL}/staff/${id}`, { method: 'DELETE' })
    router.push('/dashboard/staff')
    router.refresh()
  }

  return (
    <div className="max-w-md">
      <a href="/dashboard/staff" className="text-sm text-gray-500 hover:text-gray-900 mb-6 inline-block">
        ← Back to Staff
      </a>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Staff Member</h1>

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
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
          {loading ? 'Saving...' : 'Save Changes'}
        </button>

        <button
          onClick={handleDelete}
          className="w-full bg-white text-red-600 border border-red-200 py-2 rounded-lg text-sm font-medium hover:bg-red-50"
        >
          Delete Staff Member
        </button>
      </div>
    </div>
  )
}