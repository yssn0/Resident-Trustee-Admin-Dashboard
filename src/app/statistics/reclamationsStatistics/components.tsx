import React, { useMemo } from 'react';
import { useReclamations } from '@/hooks/useReclamations';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Reclamation } from '@/types/reclamation';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const ReclamationProblemeTypeChart = () => {
  const { reclamations, loading: reclamationsLoading, error: reclamationsError } = useReclamations();

  const stats = useMemo(() => {
    if (!reclamations.length) return null;

    const problemTypes: { [key: string]: number } = {};

    reclamations.forEach((rec: Reclamation) => {
      if (rec.problem && rec.problem !== '') {
        problemTypes[rec.problem] = (problemTypes[rec.problem] || 0) + 1;
      }
    });

    return {
      problemTypes: Object.entries(problemTypes).map(([name, value]) => ({ name, value })),
    };
  }, [reclamations]);

  if (reclamationsError) return <div>Erreur: {reclamationsError}</div>;
  if (!stats) return <div>Aucune donnée disponible</div>;

  return (
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
  );
};
