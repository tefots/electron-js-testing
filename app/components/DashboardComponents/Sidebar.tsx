import { Home, Users, ShoppingCart, BarChart2, Settings } from 'lucide-react'
import Link from 'next/link'

export function DashboardSidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <div className="text-2xl font-bold mb-8">Admin Dashboard</div>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <Home className="mr-2" size={20} />
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/dashboard/users" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <Users className="mr-2" size={20} />
              Users
            </Link>
          </li>
          <li>
            <Link href="/dashboard/products" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <ShoppingCart className="mr-2" size={20} />
              Products
            </Link>
          </li>
          <li>
            <Link href="/dashboard/analytics" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <BarChart2 className="mr-2" size={20} />
              Analytics
            </Link>
          </li>
          <li>
            <Link href="/dashboard/settings" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <Settings className="mr-2" size={20} />
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

