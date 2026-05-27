export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Properties</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">17</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Active Tasks</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Staff Members</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
        </div>
      </div>
    </div>
  )
}