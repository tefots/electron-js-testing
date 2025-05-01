import { DashboardLayout } from './../../components/DashboardComponents/DashboardLayout';
import { StatsCard } from './../../components/DashboardComponents/StatsCard';
import {  SalesGraph } from '../../components/DashboardComponents/SalesGraph';
import { DataTable } from './../../components/DashboardComponents/DataTable';
import { Book, FileText, Package, CreditCard } from 'lucide-react';
import { DashboardHeader } from '@/app/components/DashboardComponents/DashboardHeader';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardHeader />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard title="POS" icon={<CreditCard size={30} />} href="/pages/Pos" />
        <StatsCard title="Price Book" icon={<Book size={30} />} href="/dashboard/price-book" />
        <StatsCard title="Reports" icon={<FileText size={30} />} href="/dashboard/reports" />
        <StatsCard title="Stock Levels" icon={<Package size={30} />} href="/dashboard/stock-levels" />
      
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2">
        <SalesGraph />
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-green-600">Top selling Products</h2>
          <DataTable />
        </div>
      </div>
    </DashboardLayout>
  );
}
