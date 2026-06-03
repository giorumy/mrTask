import StatusUpdater from './StatusUpdater'
import EditTask from './EditTask'
import { API_URL } from '@/lib/api'

async function getTask(id: string) {
  const res = await fetch(`${API_URL}/tasks/${id}`, { cache: 'no-store' })
  return res.json()
}

async function getProperty(id: string) {
  const res = await fetch(`${API_URL}/properties/${id}`, { cache: 'no-store' })
  return res.json()
}

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const task = await getTask(id)
  const property = await getProperty(task.propertyId)

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-green-100 text-green-700',
  }

  const typeColors: Record<string, string> = {
    CLEANING: 'bg-blue-100 text-blue-700',
    MAINTENANCE: 'bg-red-100 text-red-700',
    INSPECTION: 'bg-yellow-100 text-yellow-700',
    OTHER: 'bg-gray-100 text-gray-700',
  }

  const triggerLabels: Record<string, string> = {
    DEPARTURE: 'After Guest Departure',
    ARRIVAL: 'Before Guest Arrival',
    RECURRING: 'Recurring',
    ONE_OFF: 'One Off',
  }

  return (
    <div>
      <a href="/dashboard/tasks" className="text-sm text-gray-500 hover:text-gray-900 mb-6 inline-block">
        ← Back to Tasks
      </a>

      {/* Task Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
          <div className="flex gap-2 shrink-0">
            <span className={`text-xs px-2 py-1 rounded-full ${typeColors[task.taskType]}`}>
              {task.taskType}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[task.status]}`}>
              {task.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {task.template && (
          <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-lg px-4 py-2 mb-4">
            <span className="text-purple-500">🔄</span>
            <div>
              <p className="text-xs text-purple-600 font-medium">
                Auto-generated from template: <span className="font-semibold">{task.template.name}</span>
              </p>
              <p className="text-xs text-purple-500">
                Trigger: {triggerLabels[task.template.triggerType]}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Created</p>
            <p className="text-gray-900 font-medium mt-1">
              {new Date(task.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Due Date</p>
            <p className="text-gray-900 font-medium mt-1">
              {new Date(task.dueDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Property Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Property</h2>
          <div className="flex items-start gap-3 mb-4">
            {property.coverImageUrl && (
              <img
                src={property.coverImageUrl}
                alt={property.name}
                className="w-14 h-14 rounded-lg object-cover shrink-0"
              />
            )}
            <div>
              <p className="font-medium text-gray-900">{property.name}</p>
              <p className="text-sm text-gray-500 mt-0.5">{property.address}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">WiFi</p>
              <p className="text-gray-900 font-medium mt-1 text-sm">
                {property.wifiPassword ?? 'Not set'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Door PIN</p>
              <p className="text-gray-900 font-medium mt-1 text-sm">
                {property.doorPin ?? 'Not set'}
              </p>
            </div>
          </div>
        </div>

        {/* Assignment */}
        <EditTask task={task} />
      </div>

      {/* Status */}
      <StatusUpdater taskId={task.id} currentStatus={task.status} />
    </div>
  )
}