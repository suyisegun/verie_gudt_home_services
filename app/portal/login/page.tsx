import { Suspense } from 'react'
import { LoginForm } from '@/components/portal/login-form'

export default function PortalLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  )
}
