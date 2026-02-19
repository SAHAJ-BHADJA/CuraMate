import { useEffect, useState } from 'react';
import { Users, Stethoscope, AlertTriangle, MessageSquare, Activity, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    activeAlerts: 0,
    pendingFeedback: 0,
    todayReminders: 0,
    weeklyActivities: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);

    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'patient');

    const { count: totalDoctors } = await supabase
      .from('doctors')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    const { count: activeAlerts } = await supabase
      .from('emergency_alerts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { count: pendingFeedback } = await supabase
      .from('feedback')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count: todayReminders } = await supabase
      .from('reminders')
      .select('*', { count: 'exact', head: true })
      .gte('scheduled_time', today.toISOString());

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { count: weeklyActivities } = await supabase
      .from('wellness_logs')
      .select('*', { count: 'exact', head: true })
      .gte('log_date', weekAgo.toISOString().split('T')[0]);

    setStats({
      totalUsers: totalUsers || 0,
      totalDoctors: totalDoctors || 0,
      activeAlerts: activeAlerts || 0,
      pendingFeedback: pendingFeedback || 0,
      todayReminders: todayReminders || 0,
      weeklyActivities: weeklyActivities || 0,
    });

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-16">
          <div className="inline-block w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-xl text-gray-600">System overview and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-10 h-10 opacity-80" />
            <span className="text-4xl font-bold">{stats.totalUsers}</span>
          </div>
          <h3 className="text-xl font-semibold">Total Patients</h3>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Stethoscope className="w-10 h-10 opacity-80" />
            <span className="text-4xl font-bold">{stats.totalDoctors}</span>
          </div>
          <h3 className="text-xl font-semibold">Active Doctors</h3>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-10 h-10 opacity-80" />
            <span className="text-4xl font-bold">{stats.activeAlerts}</span>
          </div>
          <h3 className="text-xl font-semibold">Active Alerts</h3>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="w-10 h-10 opacity-80" />
            <span className="text-4xl font-bold">{stats.pendingFeedback}</span>
          </div>
          <h3 className="text-xl font-semibold">Pending Feedback</h3>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-10 h-10 opacity-80" />
            <span className="text-4xl font-bold">{stats.todayReminders}</span>
          </div>
          <h3 className="text-xl font-semibold">Today's Reminders</h3>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-10 h-10 opacity-80" />
            <span className="text-4xl font-bold">{stats.weeklyActivities}</span>
          </div>
          <h3 className="text-xl font-semibold">Weekly Activities</h3>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
            <Users className="w-8 h-8 text-blue-600 mb-2" />
            <p className="font-semibold text-gray-800">Manage Users</p>
          </button>
          <button className="p-6 bg-teal-50 border-2 border-teal-200 rounded-lg hover:bg-teal-100 transition-colors">
            <Stethoscope className="w-8 h-8 text-teal-600 mb-2" />
            <p className="font-semibold text-gray-800">Manage Doctors</p>
          </button>
          <button className="p-6 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 transition-colors">
            <AlertTriangle className="w-8 h-8 text-red-600 mb-2" />
            <p className="font-semibold text-gray-800">View Alerts</p>
          </button>
          <button className="p-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors">
            <MessageSquare className="w-8 h-8 text-yellow-600 mb-2" />
            <p className="font-semibold text-gray-800">Review Feedback</p>
          </button>
        </div>
      </div>
    </div>
  );
}
