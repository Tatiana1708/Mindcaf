import React from 'react';
import { BarChart3, Mail as MailIcon, Users, Clock } from 'lucide-react';

export function Dashboard() {
  const stats = [
    { title: 'Courriers Entrants', value: '28', icon: MailIcon, color: 'bg-blue-500' },
    { title: 'Courriers Sortants', value: '15', icon: MailIcon, color: 'bg-green-500' },
    { title: 'En Attente', value: '5', icon: Clock, color: 'bg-yellow-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div key={stat.title} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}