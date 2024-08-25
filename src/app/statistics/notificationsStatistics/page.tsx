// src/app/statistics/notificationsStatistics/page.tsx
'use client'
import React, { useMemo } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Card = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-white shadow-md rounded-lg p-6 mb-6">
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

const formatUserType = (userType: string) => {
  switch (userType.toLowerCase()) {
    case 'user': return 'Résident';
    case 'syndic': return 'Syndic';
    default: return userType;
  }
};

export default function NotificationStatisticsPage() {
  const { notifications, loading, error } = useNotifications();

  const stats = useMemo(() => {
    if (!notifications.length) return null;

    const totalNotifications = notifications.length;

    // Volume de Notifications au Fil du Temps
    const volumeOverTime = notifications.reduce((acc, notification) => {
      const date = new Date(notification.createdAt).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Notifications Lues vs Non Lues
    const readVsUnread = notifications.reduce((acc, notification) => {
      acc[notification.isRead ? 'Notifications Lues' : 'Notifications Non Lues']++;
      return acc;
    }, { 'Notifications Lues': 0, 'Notifications Non Lues': 0 });

    // Notifications par Type d'Utilisateur
    const byUserType = notifications.reduce((acc, notification) => {
      const userType = formatUserType(notification.recipient?.userType || 'Inconnu');
      acc[userType] = (acc[userType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Taux de Lecture des Notifications
    const readRate = Object.entries(volumeOverTime).map(([date, total]) => {
      const read = notifications.filter(n => new Date(n.createdAt).toISOString().split('T')[0] === date && n.isRead).length;
      return { date, taux: (read / total) * 100 };
    });

    // Top 5 Utilisateurs par Nombre de Notifications Reçues
    const userNotificationCounts = notifications.reduce((acc, notification) => {
      const userId = notification.userId.toString();
      if (!acc[userId]) {
        acc[userId] = { 
          user: `${notification.recipient?.name || ''} ${notification.recipient?.surname || ''}`,
          count: 0
        };
      }
      acc[userId].count++;
      return acc;
    }, {} as Record<string, { user: string; count: number }>);

    const topUsers = Object.values(userNotificationCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalNotifications,
      volumeOverTime: Object.entries(volumeOverTime).map(([date, count]) => ({ date, count })),
      readVsUnread: Object.entries(readVsUnread).map(([status, count]) => ({ status, count })),
      byUserType: Object.entries(byUserType).map(([type, count]) => ({ type, count })),
      readRate,
      topUsers
    };
  }, [notifications]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Erreur: {error}</div>;
  if (!stats) return <div>Aucune donnée disponible</div>;

  return (
    <div className="space-y-6">
      <Card title="Total des Notifications Envoyées">
        <p className="text-4xl font-bold">{stats.totalNotifications}</p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Volume de Notifications au Fil du Temps">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.volumeOverTime}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" name="Nombre de notifications" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Notifications Lues vs Non Lues">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.readVsUnread}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="status"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                {stats.readVsUnread.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Notifications par Type d'Utilisateur">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.byUserType}>
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Nombre de notifications" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Taux de Lecture des Notifications">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.readRate}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="taux" name="Taux de lecture (%)" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Top 5 Utilisateurs par Notifications Reçues">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.topUsers}>
              <XAxis dataKey="user" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Nombre de notifications" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
