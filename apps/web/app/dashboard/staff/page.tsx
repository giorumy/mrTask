import { API_URL } from '@/lib/api'

async function getStaff() {
  const res = await fetch(`${API_URL}/staff`, {
    cache: 'no-store',
  })
  return res.json()
}

export default async function StaffPage() {
  const staff = await getStaff()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Staff</h1>
        <a
          href="/dashboard/staff/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Add Staff
        </a>
      </div>

      {staff.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No staff members yet.</p>
          <a
            href="/dashboard/staff/new"
            className="text-blue-600 text-sm font-medium mt-2 inline-block hover:underline"
          >
            Add your first staff member
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
          {staff.map((member: any) => (
            <div key={member.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-gray-900">{member.name}</p>
                <p className="text-sm text-gray-500 capitalize">{member.role.toLowerCase()}</p>
              </div>
              <a
                href={`/dashboard/staff/${member.id}/edit`}
                className="text-sm text-blue-600 hover:underline"
              >
                Edit
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}