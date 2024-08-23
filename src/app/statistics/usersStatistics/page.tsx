'use client'
import React, { useMemo } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { useSponsorships } from '@/hooks/useSponsorships';
import { useReclamations } from '@/hooks/useReclamations';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Card = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-white shadow-md rounded-lg p-6 mb-6">
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

export default function UserStatisticsPage() {
  const { appUsers, loading: usersLoading, error: usersError } = useUsers();
  const { sponsorships, loading: sponsorshipsLoading, error: sponsorshipsError } = useSponsorships();
  const { reclamations, loading: reclamationsLoading, error: reclamationsError } = useReclamations();

  const stats = useMemo(() => {
    if (!appUsers.length || !sponsorships.length || !reclamations.length) return null;

    // User Type Distribution
    const userTypeDistribution = appUsers.reduce((acc, user) => {
      acc[user.userType] = (acc[user.userType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Sponsorship Growth Over Time
    const sponsorshipGrowth = sponsorships.reduce((acc, sponsorship) => {
      const date = sponsorship.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Top Sponsors
    const topSponsors = Object.entries(
      sponsorships.reduce((acc, sponsorship) => {
        const userId = sponsorship.userId.toString();
        acc[userId] = (acc[userId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    )
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([userId, count]) => {
        const user = appUsers.find(u => u._id.toString() === userId);
        return { name: user ? `${user.name} ${user.surname}` : 'Unknown', count };
      });

    // User Registration Trend
    const userRegistrationTrend = appUsers.reduce((acc, user) => {
      const date = user._id.getTimestamp().toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Most Active Users
    const userActivity = appUsers.map(user => {
      const userId = user._id.toString();
      const reclamationCount = reclamations.filter(r => r.userId?.toString() === userId).length;
      const sponsorshipCount = sponsorships.filter(s => s.userId.toString() === userId).length;
      return {
        name: `${user.name} ${user.surname}`,
        activity: reclamationCount + sponsorshipCount
      };
    }).sort((a, b) => b.activity - a.activity).slice(0, 5);

    return {
      userTypeDistribution: Object.entries(userTypeDistribution).map(([name, value]) => ({ name, value })),
      sponsorshipGrowth: Object.entries(sponsorshipGrowth).map(([date, count]) => ({ date, count })),
      topSponsors,
      userRegistrationTrend: Object.entries(userRegistrationTrend).map(([date, count]) => ({ date, count })),
      mostActiveUsers: userActivity
    };
  }, [appUsers, sponsorships, reclamations]);

  if (usersLoading || sponsorshipsLoading || reclamationsLoading) return <LoadingSpinner />;
  if (usersError || sponsorshipsError || reclamationsError) return <div>Erreur: {usersError || sponsorshipsError || reclamationsError}</div>;
  if (!stats) return <div>Aucune donnée disponible</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Distribution des Types d'Utilisateurs">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={stats.userTypeDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {stats.userTypeDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Croissance des Parrainages">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.sponsorshipGrowth}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" name="Nombre de parrainages" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Top 5 des Parrains">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.topSponsors}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Nombre de parrainages" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Tendance des Inscriptions d'Utilisateurs">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.userRegistrationTrend}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" name="Nouvelles inscriptions" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Utilisateurs les Plus Actifs">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.mostActiveUsers}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="activity" name="Niveau d'activité" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}