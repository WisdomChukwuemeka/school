// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#34d399', '#60a5fa', '#facc15', '#f87171'];

export const AdminDashboard = () => {
  const [data, setData] = useState({
    tasks: [],
    users: [],
    stats: {
      totalUsers: 0,
      totalTasks: 0,
    },
  });

  const fetchData = async () => {
    const res = await getDashboardData();
    setData(res);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-gray-800">
      <h1 className="text-3xl font-bold mb-6"> Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Stats Cards */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex items-center gap-4">
          <i className="bi bi-people-fill text-3xl text-blue-600"></i>
          <div>
            <p className="text-sm">Total Users</p>
            <h2 className="text-xl font-bold">{data.stats.totalUsers}</h2>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6 flex items-center gap-4">
          <i className="bi bi-list-task text-3xl text-green-600"></i>
          <div>
            <p className="text-sm">Total Tasks</p>
            <h2 className="text-xl font-bold">{data.stats.totalTasks}</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Tasks Per User</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.tasks}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="taskCount" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">User Role Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.users}
                dataKey="value"
                nameKey="role"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.users.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};


