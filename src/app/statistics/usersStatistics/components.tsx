//src\app\statistics\usersStatistics\components.tsx
import React from 'react';
import { useUsers } from '@/hooks/useUsers';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const UserTypeDistributionChart = () => {
  const { appUsers } = useUsers();
  
  const data = React.useMemo(() => {
    const distribution = appUsers.reduce((acc, user) => {
      const displayType = user.userType.toLowerCase() === 'user' ? 'Résident' : 
                          user.userType.toLowerCase() === 'syndic' ? 'Syndic' : 
                          user.userType;
      acc[displayType] = (acc[displayType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  }, [appUsers]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};