import { useEffect, useState } from 'react';
import {
  Heart,
  Calendar,
  FileText,
  Activity,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { supabase, Reminder, MedicalRecord, WellnessLog } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [upcomingReminders, setUpcomingReminders] = useState<Reminder[]>([]);
  const [recentRecords, setRecentRecords] = useState<MedicalRecord[]>([]);
  const [weeklyWellness, setWeeklyWellness] = useState<WellnessLog[]>([]);
  const [stats, setStats] = useState({
    totalReminders: 0,
    completedToday: 0,
    totalRecords: 0,
    weeklyActivities: 0,
  });

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: reminders } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .gte('scheduled_time', new Date().toISOString())
      .order('scheduled_time', { ascending: true })
      .limit(5);

    const { data: records } = await supabase
      .from('medical_records')
      .select('*')
      .eq('user_id', user.id)
      .order('record_date', { ascending: false })
      .limit(5);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { data: wellness } = await supabase
      .from('wellness_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('log_date', weekAgo.toISOString().split('T')[0])
      .order('log_date', { ascending: false });

    const { count: totalReminders } = await supabase
      .from('reminders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_active', true);

    const { count: completedToday } = await supabase
      .from('reminders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_completed', true)
      .gte('scheduled_time', today.toISOString());

    const { count: totalRecords } = await supabase
      .from('medical_records')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    setUpcomingReminders(reminders || []);
    setRecentRecords(records || []);
    setWeeklyWellness(wellness || []);
    setStats({
      totalReminders: totalReminders || 0,
      completedToday: completedToday || 0,
      totalRecords: totalRecords || 0,
      weeklyActivities: wellness?.length || 0,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'medicine':
        return <Heart className="w-6 h-6" />;
      case 'appointment':
        return <Calendar className="w-6 h-6" />;
      case 'exercise':
        return <Activity className="w-6 h-6" />;
      default:
        return <Clock className="w-6 h-6" />;
    }
  };

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case 'diagnosis':
        return 'bg-red-100 text-red-700';
      case 'treatment':
        return 'bg-blue-100 text-blue-700';
      case 'prescription':
        return 'bg-green-100 text-green-700';
      case 'lab_result':
        return 'bg-yellow-100 text-yellow-700';
      case 'vaccination':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
        <p className="text-xl text-gray-600">Here's your health overview for today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-10 h-10 opacity-80" />
            <span className="text-3xl font-bold">{stats.totalReminders}</span>
          </div>
          <h3 className="text-lg font-semibold">Active Reminders</h3>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-10 h-10 opacity-80" />
            <span className="text-3xl font-bold">{stats.completedToday}</span>
          </div>
          <h3 className="text-lg font-semibold">Completed Today</h3>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-10 h-10 opacity-80" />
            <span className="text-3xl font-bold">{stats.totalRecords}</span>
          </div>
          <h3 className="text-lg font-semibold">Medical Records</h3>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-10 h-10 opacity-80" />
            <span className="text-3xl font-bold">{stats.weeklyActivities}</span>
          </div>
          <h3 className="text-lg font-semibold">Weekly Activities</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Clock className="w-7 h-7 text-teal-600" />
            Upcoming Reminders
          </h2>
          {upcomingReminders.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">No upcoming reminders</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-teal-300 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 flex-shrink-0">
                      {getReminderIcon(reminder.reminder_type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{reminder.title}</h3>
                      <p className="text-gray-600">{reminder.description}</p>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                        <span>{formatDate(reminder.scheduled_time)}</span>
                        <span className="font-semibold text-teal-600">
                          {formatTime(reminder.scheduled_time)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FileText className="w-7 h-7 text-teal-600" />
            Recent Medical Records
          </h2>
          {recentRecords.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">No medical records yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentRecords.map((record) => (
                <div
                  key={record.id}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-teal-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getRecordTypeColor(
                            record.record_type
                          )}`}
                        >
                          {record.record_type.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{record.title}</h3>
                      {record.doctor_name && (
                        <p className="text-gray-600">Dr. {record.doctor_name}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-2">{formatDate(record.record_date)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {weeklyWellness.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Activity className="w-7 h-7 text-teal-600" />
            This Week's Wellness Activities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weeklyWellness.map((log) => (
              <div
                key={log.id}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-teal-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold">
                    {log.log_type.toUpperCase()}
                  </span>
                  {log.duration_minutes > 0 && (
                    <span className="text-gray-600">{log.duration_minutes} min</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{log.activity}</h3>
                <p className="text-sm text-gray-500 mt-2">{formatDate(log.log_date)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
