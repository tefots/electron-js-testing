import { ReactNode } from 'react'
import { DashboardSidebar } from './Sidebar'


interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* <DashboardHeader /> */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          {children}
        </main>
      </div>
    </div>
  )
}

