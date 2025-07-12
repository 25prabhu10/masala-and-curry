import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import apiClient from '@/lib/api-client'
import authClient from '@/lib/auth-client'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  useEffect(() => {
    async function fetchData() {
      const res = await apiClient.api.v1.$get()
      console.log(`Response from API:`, res)

      const me = await authClient.getSession()
      console.log(`Current session:`, me)
    }

    fetchData()
  }, [])
  return <div className="p-2">Hello from About {JSON.stringify(import.meta.env)}!</div>
}
