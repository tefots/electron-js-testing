import { DashboardLayout } from '../DashboardComponents/DashboardLayout';
import { DataTable } from './../../components/DashboardComponents/DataTable';

export default function UsersPage() {
  return (
    <DashboardLayout>
        <div className="bg-slate-500">
        <h1 className="text-2xl font-bold mb-4">Users</h1>
        <DataTable />
        </div>
    </DashboardLayout>

  );
}
