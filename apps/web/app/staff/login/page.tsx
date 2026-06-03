'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser, SignIn } from '@clerk/nextjs'
import { API_URL } from '@/lib/api'

export default function StaffLoginPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded || !user) return

    async function linkStaff() {
      try {
        const res = await fetch(`${API_URL}/auth/staff/link`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clerkId: user!.id,
            email: user!.primaryEmailAddress?.emailAddress,
          }),
        })

        if (!res.ok) {
          // Not a staff member — sign them out
          router.push('/sign-in')
          return
        }

        const { token, staff } = await res.json()
        localStorage.setItem('staff_token', token)
        localStorage.setItem('staff_name', staff.name)
        router.push('/staff/tasks')
      } catch {
        router.push('/sign-in')
      }
    }

    linkStaff()
  }, [isLoaded, user])

  if (isLoaded && user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Signing you in...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Staff Login</h1>
        <SignIn
          routing="hash"
          fallbackRedirectUrl="/staff/login"
        />
      </div>
    </div>
  )
}