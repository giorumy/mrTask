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
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3">Property</th>
                <th className="text-left px-6 py-3">Address</th>
                <th className="text-left px-6 py-3">WiFi</th>
                <th className="text-left px-6 py-3">PIN</th>
              </tr>
            </thead>

            <tbody>
              {properties.map((property: any) => (
                <tr
                  key={property.id}
                  className="group relative border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-6 py-3 font-medium text-gray-900">
                    <a
                      href={`/dashboard/properties/${property.id}`}
                      className="absolute inset-0 z-10"
                      aria-label={`Open ${property.name}`}
                    />
                    <span className="relative z-20">{property.name}</span>
                  </td>

                  <td className="p-3 text-gray-500">
                    <span className="relative z-20">{property.address}</span>
                  </td>

                  <td className="p-3 text-gray-500">
                    <span className="relative z-20">
                      {property.wifiPassword ?? '—'}
                    </span>
                  </td>

                  <td className="p-3 text-gray-500">
                    <span className="relative z-20">
                      {property.doorPin ?? '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  )
}