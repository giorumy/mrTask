import StatusUpdater from './StatusUpdater'
import { API_URL } from '@/lib/api'

async function getTask(id: string) {
  const res = await fetch(` ${API_URL}/tasks/${id}`, {
    cache: 'no-store',
  })
  return res.json()
}

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const task = await getTask(id)

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-green-100 text-green-700',
  }

  const typeColors: Record<string, string> = {
    CLEANING: 'bg-blue-100 text-blue-700',
    INSPECTION: 'bg-yellow-100 text-yellow-700',
    MAINTENANCE: 'bg-red-100 text-red-700',
    OTHER: 'bg-gray-100 text-gray-700',
  }

  return (
    <div className="max-w-2xl">
      <a href="/dashboard/tasks" className="text-sm text-gray-500 hover:text-gray-900 mb-6 inline-block">
        ← Back to Tasks
      </a>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
          <div className="flex gap-2 shrink-0">
            <span className={`text-xs px-2 py-1 rounded-full ${typeColors[task.type]}`}>
              {task.type}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[task.status]}`}>
              {task.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Property</p>
            <p className="text-gray-900 font-medium mt-1">{task.property?.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Assigned To</p>
            <p className="text-gray-900 font-medium mt-1">{task.assignee?.name ?? 'Unassigned'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Due Date</p>
            <p className="text-gray-900 font-medium mt-1">
              {new Date(task.dueDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Created</p>
            <p className="text-gray-900 font-medium mt-1">
              {new Date(task.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Property Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide">WiFi Password</p>
            <p className="text-gray-900 font-medium mt-1">
              {task.property?.wifiPassword ?? 'Not set'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Door PIN</p>
            <p className="text-gray-900 font-medium mt-1">
              {task.property?.doorPin ?? 'Not set'}
            </p>
          </div>
        </div>
      </div>

      <StatusUpdater taskId={task.id} currentStatus={task.status} />
    </div>
  )
}