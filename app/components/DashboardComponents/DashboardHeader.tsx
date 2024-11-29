import { Bell, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DashboardHeader() {
  return (
    <header className="bg-white shadow-sm p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <User size={20} />
          </Button>
        </div>
      </div>
    </header>
  )
}

