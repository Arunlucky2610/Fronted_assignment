/**
 * Task Stats Component
 */

import { TaskStats } from '@/types';

interface TaskStatsDisplayProps {
  stats: TaskStats;
}

export default function TaskStatsDisplay({ stats }: TaskStatsDisplayProps) {
  const statItems = [
    { label: 'Total', value: stats.total, color: 'bg-gray-100 text-gray-800' },
    { label: 'Pending', value: stats.pending, color: 'bg-yellow-100 text-yellow-800' },
    { label: 'In Progress', value: stats['in-progress'], color: 'bg-blue-100 text-blue-800' },
    { label: 'Completed', value: stats.completed, color: 'bg-green-100 text-green-800' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statItems.map((item) => (
        <div
          key={item.label}
          className={`${item.color} rounded-lg p-4 text-center`}
        >
          <p className="text-2xl font-bold">{item.value}</p>
          <p className="text-sm font-medium">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
