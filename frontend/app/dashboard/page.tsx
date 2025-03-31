import DashboardContent from "./dashboard-content"
import Header from "../comp/Header"
import { AuthProvider } from "@/app/auth/auth-context"

export default function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const action = searchParams.action as string | undefined

  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Header showNavLinks={false} />
        <DashboardContent initialAction={action} />
      </div>
    </AuthProvider>
  )
}

