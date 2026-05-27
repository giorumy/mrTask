import { API_URL } from '@/lib/api'

async function getProperty(id: string) {
  const res = await fetch(` ${API_URL}/properties/${id}`, {
    cache: 'no-store',
  })
  return res.json()
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const property = await getProperty(id)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
      <a href="/dashboard/properties" className="text-sm text-gray-500 hover:text-gray-900">
        ← Back to Properties
      </a>
      
      <a
        href={`/dashboard/properties/${property.id}/edit`}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
      >
        Edit Property
      </a>
    </div>      

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        {property.coverImageUrl && (
          <img
            src={property.coverImageUrl}
            alt={property.name}
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">{property.name}</h1>
          <p className="text-gray-500 mt-1">{property.address}</p>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">WiFi Password</p>
              <p className="text-gray-900 font-medium mt-1">
                {property.wifiPassword ?? 'Not set'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Door PIN</p>
              <p className="text-gray-900 font-medium mt-1">
                {property.doorPin ?? 'Not set'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Upcoming Reservations</h2>
          {property.reservations?.length === 0 ? (
            <p className="text-sm text-gray-500">No upcoming reservations</p>
          ) : (
            <ul className="space-y-3">
              {property.reservations?.map((res: any) => (
                <li key={res.id} className="text-sm">
                  <p className="font-medium text-gray-900">
                    {new Date(res.guestArrival).toLocaleDateString()} →{' '}
                    {new Date(res.guestDeparture).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Open Tasks</h2>
          {property.tasks?.length === 0 ? (
            <p className="text-sm text-gray-500">No open tasks</p>
          ) : (
            <ul className="space-y-3">
              {property.tasks?.map((task: any) => (
                <li key={task.id} className="text-sm">
                  <p className="font-medium text-gray-900">{task.title}</p>
                  <p className="text-gray-500">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}