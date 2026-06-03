import Link from 'next/link'
import { API_URL } from '@/lib/api'


async function getTasks() {
  const res = await fetch(`${API_URL}/tasks`, {
    cache: 'no-store',
  })
  return res.json()
}

export default async function TasksPage() {
  const tasks = await getTasks()

  const pending = tasks.filter((t: any) => t.status === 'PENDING')
  const inProgress = tasks.filter((t: any) => t.status === 'IN_PROGRESS')
  const completed = tasks.filter((t: any) => t.status === 'COMPLETED')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <Link
          href="/dashboard/tasks/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Create Task
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-100 rounded-lg p-4">
          <h2 className="font-semibold text-gray-700 mb-4">
            Pending <span className="text-gray-400 font-normal">({pending.length})</span>
          </h2>
          <div className="space-y-3">
            {pending.map((task: any) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-4">
          <h2 className="font-semibold text-gray-700 mb-4">
            In Progress <span className="text-gray-400 font-normal">({inProgress.length})</span>
          </h2>
          <div className="space-y-3">
            {inProgress.map((task: any) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-4">
          <h2 className="font-semibold text-gray-700 mb-4">
            Completed <span className="text-gray-400 font-normal">({completed.length})</span>
          </h2>
          <div className="space-y-3">
            {completed.map((task: any) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TaskCard({ task }: { task: any }) {
  const typeColors: Record<string, string> = {
    ONE_OFF: 'bg-gray-100 text-gray-700',
    ARRIVAL: 'bg-green-100 text-green-700',
    DEPARTURE: 'bg-blue-100 text-blue-700',
    RECURRING: 'bg-purple-100 text-purple-700',
  }

  return (
    <Link
      href={`/dashboard/tasks/${task.id}`}
      className="block bg-white rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-gray-900 text-sm">{task.title}</p>
        <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${typeColors[task.type]}`}>
          {task.type}
        </span>
      </div>
      <p className="text-xs text-gray-500 mt-2">{task.property?.name}</p>
      <p className="text-xs text-gray-400 mt-1">
        Due: {new Date(task.dueDate).toLocaleDateString()}
      </p>
      {task.assignee && (
        <p className="text-xs text-gray-400 mt-1">→ {task.assignee.name}</p>
      )}
      </Link>
  )
}