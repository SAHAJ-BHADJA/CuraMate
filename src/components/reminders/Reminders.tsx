import { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  Plus,
  Heart,
  Activity,
  Clock,
  Check,
  X,
  Bell,
  Pill,
} from 'lucide-react';
import { supabase, Reminder } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { bpMedicationReminderTemplates, toIsoAtClock } from '../../data/patientHealth';

type ReminderType = Reminder['reminder_type'];
type ReminderFrequency = Reminder['frequency'];

export default function Reminders() {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'medicine' | 'appointment' | 'exercise'>('all');

  const [newReminder, setNewReminder] = useState({
    reminder_type: 'medicine' as ReminderType,
    title: '',
    description: '',
    scheduled_time: '',
    frequency: 'once' as ReminderFrequency,
  });

  const bpMedicationReminders = useMemo<Reminder[]>(() => {
    const baseDate = new Date();

    return bpMedicationReminderTemplates.map((template, index) => ({
      id: template.id,
      user_id: user?.id || 'bp-template-user',
      reminder_type: template.reminderType,
      title: template.title,
      description: template.description,
      scheduled_time: toIsoAtClock(baseDate, template.scheduledClock),
      frequency: template.frequency,
      is_completed: false,
      is_active: true,
      notification_sent: false,
      created_at: new Date(baseDate.getTime() - index * 60000).toISOString(),
    }));
  }, [user]);

  useEffect(() => {
    loadReminders();
  }, [user]);

  const loadReminders = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', user.id)
      .order('scheduled_time', { ascending: true });

    if (!error && data) {
      setReminders(data);
    }
    setLoading(false);
  };

  const handleAddReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase.from('reminders').insert({
      user_id: user.id,
      reminder_type: newReminder.reminder_type,
      title: newReminder.title,
      description: newReminder.description,
      scheduled_time: newReminder.scheduled_time,
      frequency: newReminder.frequency,
      is_active: true,
      is_completed: false,
    });

    if (!error) {
      setShowAddModal(false);
      setNewReminder({
        reminder_type: 'medicine',
        title: '',
        description: '',
        scheduled_time: '',
        frequency: 'once',
      });
      loadReminders();
    }
  };

  const toggleComplete = async (reminder: Reminder) => {
    const isTemplate = reminder.id.startsWith('BP-REM-');
    if (isTemplate) return;

    const { error } = await supabase
      .from('reminders')
      .update({ is_completed: !reminder.is_completed })
      .eq('id', reminder.id);

    if (!error) {
      loadReminders();
    }
  };

  const deleteReminder = async (id: string) => {
    const isTemplate = id.startsWith('BP-REM-');
    if (isTemplate) return;

    const { error } = await supabase.from('reminders').delete().eq('id', id);

    if (!error) {
      loadReminders();
    }
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'medicine':
        return <Heart className="w-7 h-7" />;
      case 'appointment':
        return <Calendar className="w-7 h-7" />;
      case 'exercise':
        return <Activity className="w-7 h-7" />;
      default:
        return <Bell className="w-7 h-7" />;
    }
  };

  const getReminderColor = (type: string) => {
    switch (type) {
      case 'medicine':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'appointment':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'exercise':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    };
  };

  const allReminders = useMemo(() => {
    return [...bpMedicationReminders, ...reminders].sort(
      (a, b) => new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime()
    );
  }, [bpMedicationReminders, reminders]);

  const filteredReminders =
    filter === 'all' ? allReminders : allReminders.filter((reminder) => reminder.reminder_type === filter);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Active Reminders</h1>
          <p className="text-xl text-gray-600">Stay on top of your BP and daily health schedule</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 text-white px-6 py-4 rounded-lg text-lg font-semibold hover:bg-teal-700 transition-colors shadow-lg flex items-center gap-2"
        >
          <Plus className="w-6 h-6" />
          Add Reminder
        </button>
      </div>

      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
        <h2 className="text-2xl font-bold text-red-800 mb-4 flex items-center gap-2">
          <Pill className="w-7 h-7" />
          BP Medication Reminders
        </h2>
        <ul className="space-y-2 text-red-900">
          {bpMedicationReminderTemplates.map((template) => (
            <li key={template.id} className="text-lg">• {template.description}</li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('medicine')}
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-colors ${
              filter === 'medicine'
                ? 'bg-red-600 text-white'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            Medicine
          </button>
          <button
            onClick={() => setFilter('appointment')}
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-colors ${
              filter === 'appointment'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            Appointments
          </button>
          <button
            onClick={() => setFilter('exercise')}
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-colors ${
              filter === 'exercise'
                ? 'bg-green-600 text-white'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            Exercise
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredReminders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Bell className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">No reminders yet</h3>
          <p className="text-lg text-gray-600">Create your first reminder to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredReminders.map((reminder) => {
            const datetime = formatDateTime(reminder.scheduled_time);
            const isTemplate = reminder.id.startsWith('BP-REM-');

            return (
              <div
                key={reminder.id}
                className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow ${
                  reminder.is_completed ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-16 h-16 rounded-lg flex items-center justify-center border-2 ${getReminderColor(
                      reminder.reminder_type
                    )}`}
                  >
                    {getReminderIcon(reminder.reminder_type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3
                          className={`text-2xl font-bold text-gray-800 mb-2 ${
                            reminder.is_completed ? 'line-through' : ''
                          }`}
                        >
                          {reminder.title}
                        </h3>
                        {reminder.description && (
                          <p className="text-lg text-gray-600 mb-3">{reminder.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 text-base">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-5 h-5" />
                            <span>{datetime.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-teal-600 font-semibold">
                            <Clock className="w-5 h-5" />
                            <span>{datetime.time}</span>
                          </div>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                            {reminder.frequency.toUpperCase()}
                          </span>
                          {isTemplate && (
                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                              BP PLAN
                            </span>
                          )}
                          {reminder.is_completed && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                              COMPLETED
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleComplete(reminder)}
                          disabled={isTemplate}
                          className={`p-3 rounded-lg transition-colors ${
                            reminder.is_completed
                              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              : 'bg-green-100 text-green-600 hover:bg-green-200'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                          title={reminder.is_completed ? 'Mark as incomplete' : 'Mark as complete'}
                        >
                          <Check className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => deleteReminder(reminder.id)}
                          disabled={isTemplate}
                          className="p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete reminder"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-800">Add Reminder</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <form onSubmit={handleAddReminder} className="p-6 space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Reminder Type
                </label>
                <select
                  value={newReminder.reminder_type}
                  onChange={(e) =>
                    setNewReminder({ ...newReminder, reminder_type: e.target.value as ReminderType })
                  }
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                >
                  <option value="medicine">Medicine</option>
                  <option value="appointment">Appointment</option>
                  <option value="exercise">Exercise</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="e.g., Take blood pressure medication"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newReminder.description}
                  onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  rows={3}
                  placeholder="Additional details..."
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Date and Time
                </label>
                <input
                  type="datetime-local"
                  value={newReminder.scheduled_time}
                  onChange={(e) =>
                    setNewReminder({ ...newReminder, scheduled_time: e.target.value })
                  }
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Frequency</label>
                <select
                  value={newReminder.frequency}
                  onChange={(e) =>
                    setNewReminder({ ...newReminder, frequency: e.target.value as ReminderFrequency })
                  }
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                >
                  <option value="once">Once</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-teal-600 text-white rounded-lg text-lg font-semibold hover:bg-teal-700 transition-colors shadow-lg"
                >
                  Add Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

