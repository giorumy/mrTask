import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="font-bold text-xl text-gray-900">MrTask</span>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/dashboard/properties" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Properties
            </Link>
            <Link href="/dashboard/tasks" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Tasks
            </Link>
            <Link href="/dashboard/staff" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Staff
            </Link>
          </div>
        </div>
        <UserButton />
      </nav>
      <main className="p-6">
        {children}
      </main>
    </div>
  )
}