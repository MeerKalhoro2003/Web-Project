import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  // Mock data for the chart requirement, this will later be fetched from /api/admin/dashboard
  const data = [
    { name: "Jan", premium: 4000, claims: 2400 },
    { name: "Feb", premium: 3000, claims: 1398 },
    { name: "Mar", premium: 2000, claims: 9800 },
  ];

  return (
    <div className="p-6 transition-all duration-300 ease-in-out">
      <h1 className="text-2xl font-bold mb-6">Admin Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow-sm border border-slate-100">
          <h4 className="text-slate-500 text-sm font-semibold">Total Users</h4>
          <p className="text-2xl font-bold">1,204</p>
        </div>
        <div className="bg-white p-4 rounded shadow-sm border border-slate-100">
          <h4 className="text-slate-500 text-sm font-semibold">
            Active Policies
          </h4>
          <p className="text-2xl font-bold">845</p>
        </div>
        <div className="bg-white p-4 rounded shadow-sm border border-slate-100">
          <h4 className="text-slate-500 text-sm font-semibold">
            Premium Revenue
          </h4>
          <p className="text-2xl font-bold">₨ 12.4M</p>
        </div>
        <div className="bg-white p-4 rounded shadow-sm border border-slate-100">
          <h4 className="text-slate-500 text-sm font-semibold">
            Total Payouts
          </h4>
          <p className="text-2xl font-bold">₨ 4.1M</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-80">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <h3 className="mb-4 font-semibold text-slate-700">
            Premium vs Payouts
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Bar dataKey="premium" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="claims" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
