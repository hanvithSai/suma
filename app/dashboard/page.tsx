import type { Metadata } from "next"
import DashboardContent from "./dashboard-content"
import Header from "../../components/Header"
import { getUsernameFromGoogleOAuth } from "../../utils/auth"

export const metadata: Metadata = {
  title: "Dashboard | SUMA",
  description: "Create or join interactive rooms for engaging sessions",
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const username = await getUsernameFromGoogleOAuth()
  const action = searchParams.action as string | undefined

  return (
    <div className="min-h-screen bg-gray-100">
      <Header showNavLinks={false} />
      <DashboardContent initialAction={action} username={username} />
    </div>
  )
}

