'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function StatusUpdater({
  taskId,
  currentStatus,
}: {
  taskId: string
  currentStatus: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function updateStatus(status: string) {
    setLoading(true)
    await fetch(`http://localhost:3001/tasks/${taskId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="font-semibold text-gray-900 mb-4">Update Status</h2>
      <div className="flex gap-3">
        {currentStatus !== 'PENDING' && (
          <button
            onClick={() => updateStatus('PENDING')}
            disabled={loading}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 disabled:opacity-50"
          >
            Mark Pending
          </button>
        )}
        {currentStatus !== 'IN_PROGRESS' && (
          <button
            onClick={() => updateStatus('IN_PROGRESS')}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            Start Task
          </button>
        )}
        {currentStatus !== 'COMPLETED' && (
          <button
            onClick={() => updateStatus('COMPLETED')}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
          >
            Complete Task
          </button>
        )}
      </div>
    </div>
  )
}