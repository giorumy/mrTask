'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { API_URL } from '@/lib/api'

export default function EditPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [property, setProperty] = useState<any>(null)
  const [wifiPassword, setWifiPassword] = useState('')
  const [doorPin, setDoorPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(` ${API_URL}/properties/${id}`)
      .then((r) => r.json())
      .then((p) => {
        setProperty(p)
        setWifiPassword(p.wifiPassword ?? '')
        setDoorPin(p.doorPin ?? '')
      })
  }, [id])

  async function handleSubmit() {
    setLoading(true)
    setError('')

    try {
      const res = await fetch(` ${API_URL}/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wifiPassword, doorPin }),
      })

      if (!res.ok) throw new Error('Failed to update property')

      router.push(`/dashboard/properties/${id}`)
      router.refresh()
    } catch (e) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!property) return <p className="text-gray-500">Loading...</p>

  return (
    <div className="min-h-screen px-4 pt-16">
      <div className="max-w-md mx-auto">
        
        <a
          href={`/dashboard/properties/${id}`}
          className="text-sm text-gray-500 hover:text-gray-900 mb-6 inline-block"
        >
          ← Back to Property
        </a>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Edit Property
        </h1>

        <p className="text-gray-500 mb-6">
          {property.name}
        </p>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
              {error}
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WiFi Password
            </label>
            <input
              type="text"
              value={wifiPassword}
              onChange={(e) => setWifiPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Door PIN
            </label>
            <input
              type="text"
              value={doorPin}
              onChange={(e) => setDoorPin(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}