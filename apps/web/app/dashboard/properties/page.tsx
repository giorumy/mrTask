import { API_URL } from '@/lib/api'

async function getProperties() {
  const res = await fetch(`${API_URL}/properties`, {
    cache: 'no-store',
  })
  return res.json()
}

export default async function PropertiesPage() {
  const properties = await getProperties()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Properties</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property: any) => (
          <a
            key={property.id}
            href={`/dashboard/properties/${property.id}`}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {property.coverImageUrl && (
              <img
                src={property.coverImageUrl}
                alt={property.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="font-semibold text-gray-900">{property.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{property.address}</p>
              <div className="flex gap-4 mt-3">
                <span className="text-xs text-gray-500">
                  WiFi: {property.wifiPassword ?? '—'}
                </span>
                <span className="text-xs text-gray-500">
                  PIN: {property.doorPin ?? '—'}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}