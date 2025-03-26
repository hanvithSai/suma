import type { Metadata } from "next"
import DashboardContent from "./dashboard-content"
import Header from "../comp/Header"

export const metadata: Metadata = {
  title: "Dashboard | SUMA",
  description: "Create or join interactive rooms for engaging sessions",
}

export default function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // const username = await getUsernameFromGoogleOAuth()
  const username = "John Wick"
  // const action = searchParams.action as string | undefined
  const action = undefined

  return (
    <div className="min-h-screen bg-gray-100">
      <Header showNavLinks={false} />
      <DashboardContent initialAction={action} username={username} />
    </div>
  )
}
