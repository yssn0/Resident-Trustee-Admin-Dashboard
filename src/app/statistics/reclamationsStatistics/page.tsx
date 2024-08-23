//src\app\statistics\reclamationsStatistics\page.tsx

'use client'
import React, { useMemo } from 'react';
import { useReclamations } from '@/hooks/useReclamations';
import { useUsers } from '@/hooks/useUsers';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Image from 'next/image';
import { AppUser } from '@/types/appUser';
import { Reclamation } from '@/types/reclamation';
import * as Realm from 'realm-web';
import LoadingSpinner from '@/components/ui/LoadingSpinner';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const STATUS_COLORS = {
  'Ouverte': '#EEEEEE',
  'Prise en charge': '#D9EBF1',
  'Traité': '#F2FAEB'
};

const Card = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-white shadow-md rounded-lg p-6 mb-6">
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

const SatisfactionEmoji = ({ level }: { level: number | null }) => {
  switch (level) {
    case 0:
      return <Image src="/images/sad.png" alt="Triste" width={24} height={24} />;
    case 50:
      return <Image src="/images/medium.png" alt="Neutre" width={24} height={24} />;
    case 100:
      return <Image src="/images/happy.png" alt="Content" width={24} height={24} />;
    default:
      return null;
  }
};

export default function ReclamationsStatisticsPage() {
  const { reclamations, loading: reclamationsLoading, error: reclamationsError } = useReclamations();
  const { appUsers, loading: usersLoading, error: usersError } = useUsers();

  const getUserName = (userId: Realm.BSON.ObjectId) => {
    const user = appUsers.find(u => u._id.toString() === userId.toString());
    return user ? `${user.name} ${user.surname}` : 'Inconnu';
  };

  const stats = useMemo(() => {
    if (!reclamations.length) return null;

    const totalReclamations = reclamations.length;
    const problemTypes: { [key: string]: number } = {};
    const reclamationsOverTime: { [key: string]: number } = {};
    const satisfactionLevels: { [key: string]: number } = { 0: 0, 50: 0, 100: 0, null: 0 };
    const syndicReclamations: { [key: string]: number } = {};
    const statusCounts: { [key: string]: number } = { Ouverte: 0, 'Prise en charge': 0, Traité: 0 };

    reclamations.forEach((rec: Reclamation) => {
      if (rec.problem && rec.problem !== '') {
        problemTypes[rec.problem] = (problemTypes[rec.problem] || 0) + 1;
      }

      const date = rec.date ? new Date(rec.date).toISOString().split('T')[0] : '';
      if (date) {
        reclamationsOverTime[date] = (reclamationsOverTime[date] || 0) + 1;
      }

      if (rec.satisfactionLevel !== undefined && rec.satisfactionLevel !== null) {
        satisfactionLevels[rec.satisfactionLevel.toString()] = (satisfactionLevels[rec.satisfactionLevel.toString()] || 0) + 1;
      } else {
        satisfactionLevels['null'] = (satisfactionLevels['null'] || 0) + 1;
      }

      if (rec.syndicId) {
        const syndicIdString = rec.syndicId.toString();
        syndicReclamations[syndicIdString] = (syndicReclamations[syndicIdString] || 0) + 1;
      }

      if (rec.status) {
        statusCounts[rec.status] = (statusCounts[rec.status] || 0) + 1;
      }
    });

    return {
      totalReclamations,
      problemTypes: Object.entries(problemTypes).map(([name, value]) => ({ name, value })),
      reclamationsOverTime: Object.entries(reclamationsOverTime).map(([date, count]) => ({ date, count })),
      satisfactionLevels,
      topSyndics: Object.entries(syndicReclamations)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id, count]) => ({ id: new Realm.BSON.ObjectId(id), count })),
      statusCounts
    };
  }, [reclamations]);

  if (reclamationsLoading || usersLoading) return <LoadingSpinner />;
  if (reclamationsError || usersError) return <div>Erreur: {reclamationsError || usersError}</div>;
  if (!stats) return <div>Aucune donnée disponible</div>;

  const topSyndicsWithNames = stats.topSyndics.map(s => ({
    ...s,
    name: getUserName(s.id)
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Total des Réclamations">
        <p className="text-4xl font-bold">{stats.totalReclamations}</p>
      </Card>

      <Card title="Niveaux de Satisfaction">
        <div className="flex justify-between">
          <div className="flex flex-col items-center">
            <SatisfactionEmoji level={0} />
            <p className="mt-2">Triste: {stats.satisfactionLevels['0']}</p>
          </div>
          <div className="flex flex-col items-center">
            <SatisfactionEmoji level={50} />
            <p className="mt-2">Neutre: {stats.satisfactionLevels['50']}</p>
          </div>
          <div className="flex flex-col items-center">
            <SatisfactionEmoji level={100} />
            <p className="mt-2">Content: {stats.satisfactionLevels['100']}</p>
          </div>
          <div className="flex flex-col items-center">
          <div className="w-6 h-6 mb-2"></div> {/* Placeholder for alignment */}
            <p>Sans réaction: {stats.satisfactionLevels['null']}</p>
          </div>
        </div>
      </Card>

      <Card title="Réclamations par Type de Problème">
        {stats.problemTypes.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.problemTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {stats.problemTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>Aucune donnée disponible sur les types de problèmes</p>
        )}
      </Card>

      <Card title="Réclamations au Fil du Temps">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.reclamationsOverTime}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" name="Nombre de réclamations" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Top Syndics par Réclamations Traitées">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topSyndicsWithNames}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Nombre de réclamations" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Statut des Réclamations">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={Object.entries(stats.statusCounts).map(([status, count]) => ({ status, count }))}>
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Nombre de réclamations">
              {Object.entries(stats.statusCounts).map(([status, _], index) => (
                <Cell key={`cell-${index}`} fill={STATUS_COLORS[status as keyof typeof STATUS_COLORS]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}