'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import StaffStatusUpdater from './StaffStatusUpdater'
import { API_URL } from '@/lib/api'

export default function StaffTaskDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [task, setTask] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('staff_token')
    if (!token) {
      router.push('/staff/login')
      return
    }

    fetch(` ${API_URL}/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setTask(data)
        setLoading(false)
      })
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <a href="/staff/tasks" className="text-sm text-gray-500 hover:text-gray-900 mb-6 inline-block">
        ← Back to Tasks
      </a>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
        <div className="flex items-start justify-between gap-2 mb-4">
  <h1 className="text-xl font-bold text-gray-900">{task.title}</h1>
  <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ${
    task.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
    task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
    'bg-green-100 text-green-700'
  }`}>
    {task.status.replace('_', ' ')}
  </span>
</div>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Property</p>
            <p className="font-medium text-gray-900 mt-1">{task.property?.name}</p>
            <p className="text-sm text-gray-500">{task.property?.address}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Due Date</p>
            <p className="font-medium text-gray-900 mt-1">
              {new Date(task.dueDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
        <h2 className="font-semibold text-gray-900 mb-3">Property Access</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide">WiFi</p>
            <p className="font-medium text-gray-900 mt-1">
              {task.property?.wifiPassword ?? 'Not set'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Door PIN</p>
            <p className="font-medium text-gray-900 mt-1">
              {task.property?.doorPin ?? 'Not set'}
            </p>
          </div>
        </div>
      </div>

      <StaffStatusUpdater
        taskId={task.id}
        currentStatus={task.status}
        onStatusChange={(status) => setTask((prev: any) => ({ ...prev, status }))}
      />
    </div>
  )
}