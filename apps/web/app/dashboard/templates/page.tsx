import { API_URL } from '@/lib/api'

async function getTemplates() {
  const res = await fetch(`${API_URL}/task-templates`, { cache: 'no-store' })
  return res.json()
}

export default async function TemplatesPage() {
  const templates = await getTemplates()

  const typeColors: Record<string, string> = {
    CLEANING: 'bg-blue-100 text-blue-700',
    INSPECTION: 'bg-yellow-100 text-yellow-700',
    MAINTENANCE: 'bg-red-100 text-red-700',
    OTHER: 'bg-gray-100 text-gray-700',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Task Templates</h1>
        <a
          href="/dashboard/templates/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          New Template
        </a>
      </div>

      {templates.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No templates yet.</p>
          <a href="/dashboard/templates/new" className="text-blue-600 text-sm font-medium mt-2 inline-block hover:underline">
            Create your first template
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
          {templates.map((template: any) => (
            <div key={template.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{template.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[template.type]}`}>
                      {template.type}
                    </span>
                    {!template.isActive && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                        Inactive
                      </span>
                    )}
                  </div>
                  {template.recurrence && (
                    <p className="text-xs text-gray-500 mt-0.5">Recurrence: {template.recurrence}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">
                    Used {template._count?.tasks ?? 0} times
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={`/dashboard/templates/${template.id}/apply`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Apply
                </a>
                <a
                  href={`/dashboard/templates/${template.id}/edit`}
                  className="text-sm text-gray-500 hover:underline"
                >
                  Edit
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}