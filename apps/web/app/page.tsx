import { UserButton } from '@clerk/nextjs'

export default function Home() {
  return (
    <main>
      <h1>MrTask</h1>
      <UserButton />
    </main>
  )
}