// src\app\statistiques\layout.tsx
import Sidebar from '../../components/dashboard/Sidebar';
import StatisticDashboardHeader from '../../components/dashboard/StatisticHeader';

export default function StatisticsDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <StatisticDashboardHeader /> {/* Dashboard-specific header */}
        <main className="flex-1 overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
