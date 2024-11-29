import { DashboardLayout } from './../../components/DashboardComponents/DashboardLayout'
import { StatsCard } from './../../components/DashboardComponents/StatsCard'
import { RecentActivity } from './../../components/DashboardComponents/RecentActivity'
import { DataTable } from './../../components/DashboardComponents/DataTable'
import { Users, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Users" value="1,234" icon={<Users size={24} />} />
        <StatsCard title="Total Products" value="567" icon={<ShoppingCart size={24} />} />
        <StatsCard title="Revenue" value="$12,345" icon={<DollarSign size={24} />} />
        <StatsCard title="Growth" value="+15%" icon={<TrendingUp size={24} />} />
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2">
        <RecentActivity />
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Product Overview</h2>
          <DataTable />
        </div>
      </div>
    </DashboardLayout>
  )
}

