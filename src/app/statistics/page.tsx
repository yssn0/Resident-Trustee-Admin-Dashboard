// src\app\statistics\page.tsx
'use client'
import React, { useMemo } from 'react';
import { useReclamations } from '@/hooks/useReclamations';
import { useUsers } from '@/hooks/useUsers';
import { useNotifications } from '@/hooks/useNotifications';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Bell, TriangleAlert, Users } from 'lucide-react';
import { ReclamationProblemeTypeChart } from './reclamationsStatistics/components';
import { UserTypeDistributionChart } from './usersStatistics/components';

const Card = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-white shadow-md rounded-lg p-6 mb-6">
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

const MetricCard = ({ title, value, Icon }: { title: string, value: number, Icon: React.ElementType }) => (
  <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
    <div className="mr-4">
      <Icon size={48} className="text-blue-500" />
    </div>
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  </div>
);

export default function StatisticsPage() {
  const { reclamations, loading: reclamationsLoading, error: reclamationsError } = useReclamations();
  const { appUsers, loading: usersLoading, error: usersError } = useUsers();
  const { notifications, loading: notificationsLoading, error: notificationsError } = useNotifications();

  const stats = useMemo(() => {
    if (!reclamations.length || !appUsers.length || !notifications.length) return null;

    const totalReclamations = reclamations.length;
    const totalUsers = appUsers.length;
    const totalNotifications = notifications.length;

    // Recent activity timeline (combine recent items from all categories)
    const recentActivity = [
      ...reclamations.map(r => ({ type: 'Réclamation', date: r.date, title: r.problem })),
      ...appUsers.map(u => ({ type: 'Utilisateur', date: u._id.getTimestamp(), title: `${u.name} ${u.surname}` })),
      ...notifications.map(n => ({ type: 'Notification', date: n.createdAt, title: n.title }))
    ]
      .filter(activity => activity.date !== undefined) // Filter out undefined dates
      .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()) // Use non-null assertion operator
      .slice(0, 10);

    return {
      totalReclamations,
      totalUsers,
      totalNotifications,
      recentActivity
    };
  }, [reclamations, appUsers, notifications]);

  if (reclamationsLoading || usersLoading || notificationsLoading) return <LoadingSpinner />;
  if (reclamationsError || usersError || notificationsError) return <div>Erreur: {reclamationsError || usersError || notificationsError}</div>;
  if (!stats) return <div>Aucune donnée disponible</div>;

  return (
    <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden">
        <h2 className="text-3xl font-bold mb-8">Tableau de Bord des Statistiques</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard title="Total Utilisateurs" value={stats.totalUsers} Icon={Users} />
          <MetricCard title="Total Réclamations" value={stats.totalReclamations} Icon={TriangleAlert} />
          <MetricCard title="Total Notifications" value={stats.totalNotifications} Icon={Bell} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card title="Distribution des Types d'Utilisateurs">
            <UserTypeDistributionChart />
          </Card>

          <Card title="Réclamations par Type de Problème">
            <ReclamationProblemeTypeChart />
          </Card>
        </div>

          <Card title="Activité Récente">
            <ul className="divide-y divide-gray-200">
              {stats.recentActivity.map((activity, index) => (
                <li key={index} className="py-4">
                  <div className="flex space-x-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">{activity.type}</h3>
                        <p className="text-sm text-gray-500">{new Date(activity.date ?? "").toLocaleDateString()}</p>
                      </div>
                      <p className="text-sm text-gray-500">{activity.title}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
      </div>
  );
}
