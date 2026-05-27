'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { API_URL } from '@/lib/api'

const PIN_LENGTH = 4

export default function StaffLoginPage() {
  const router = useRouter()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(finalPin: string) {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/auth/staff/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: finalPin }),
      })
      if (!res.ok) {
        setError('Invalid PIN. Please try again.')
        setPin('')
        return
      }
      const { token, staff } = await res.json()
      localStorage.setItem('staff_token', token)
      localStorage.setItem('staff_name', staff.name)
      router.push('/staff/tasks')
    } catch {
      setError('Something went wrong.')
      setPin('')
    } finally {
      setLoading(false)
    }
  }

  function handleDigit(digit: string) {
    if (pin.length >= PIN_LENGTH || loading) return
    const newPin = pin + digit
    setPin(newPin)
    if (newPin.length === PIN_LENGTH) handleLogin(newPin)
  }

  function handleDelete() {
    setPin((prev) => prev.slice(0, -1))
  }

  const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫']

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-80">
        <h1 className="text-xl font-semibold text-gray-900 text-center mb-1">
          Enter PIN To Continue
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Please enter your {PIN_LENGTH} digit PIN.
        </p>

        <div className="flex justify-center gap-4 mb-4">
          {[...Array(PIN_LENGTH)].map((_, i) => (
            <div
              key={i}
              className="w-12 h-12 border-b-2 border-gray-300 flex items-center justify-center"
            >
              <span className="text-2xl font-semibold text-gray-900">
                {pin[i] ?? ''}
              </span>
            </div>
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center mb-4">{error}</p>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            marginTop: '24px',
          }}
        >
          {keys.map((key, i) => (
            <button
              key={i}
              onClick={() =>
                key === '⌫'
                  ? handleDelete()
                  : key !== ''
                  ? handleDigit(key)
                  : undefined
              }
              disabled={loading || key === ''}
              style={{
                height: '64px',
                borderRadius: '50%',
                fontSize: '24px',
                fontWeight: 300,
                background: key === '' ? 'transparent' : '#f3f4f6',
                border: 'none',
                cursor: key === '' ? 'default' : 'pointer',
                visibility: key === '' ? 'hidden' : 'visible',
              }}
            >
              {key}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}