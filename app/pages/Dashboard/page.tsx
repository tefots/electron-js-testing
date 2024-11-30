import { DashboardLayout } from './../../components/DashboardComponents/DashboardLayout'
import { StatsCard } from './../../components/DashboardComponents/StatsCard'
import { RecentActivity } from './../../components/DashboardComponents/RecentActivity'
import { DataTable } from './../../components/DashboardComponents/DataTable'
import { Users, ShoppingCart, DollarSign, TrendingUp, Book } from 'lucide-react'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Price Book"   icon={<Book size={24} />} />
        <StatsCard title="Reports"  icon={<ShoppingCart size={24} />} />
        <StatsCard title=""  icon={<DollarSign size={24} />} />
        <StatsCard title="Growth"  icon={<TrendingUp size={24} />} />
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

