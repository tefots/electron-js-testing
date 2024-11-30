import { DashboardLayout } from './../../components/DashboardComponents/DashboardLayout'
import { StatsCard } from './../../components/DashboardComponents/StatsCard'
import { RecentActivity } from './../../components/DashboardComponents/RecentActivity'
import { DataTable } from './../../components/DashboardComponents/DataTable'
import { Users, ShoppingCart, DollarSign, TrendingUp, Book, FileText, Package, CreditCard } from 'lucide-react'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Price Book"   icon={<Book size={30} />} />
        <StatsCard title="Reports"  icon={<FileText size={30} />} />
        <StatsCard title="Stock Levels"  icon={<Package size={30} />} />
        <StatsCard title="POS"  icon={<CreditCard size={30} />} />
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

