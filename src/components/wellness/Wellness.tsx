import { useEffect, useState } from 'react';
import { Activity, Plus, Apple, Heart, Smile, X } from 'lucide-react';
import { supabase, WellnessLog } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { getPatientWellnessRecommendations, identifyDiabetesType, mockBpLabReports } from '../../data/patientHealth';

type LogType = WellnessLog['log_type'];

export default function Wellness() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<WellnessLog[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'diet' | 'yoga' | 'stress' | 'exercise'>('all');

  const selectedPatientReport = mockBpLabReports[0];
  const diabetesType = identifyDiabetesType(selectedPatientReport);
  const recommendations = getPatientWellnessRecommendations(selectedPatientReport);

  const [newLog, setNewLog] = useState({
    log_type: 'diet' as LogType,
    activity: '',
    duration_minutes: 0,
    notes: '',
    mood_rating: 3,
    log_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadLogs();
  }, [user]);

  const loadLogs = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('wellness_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('log_date', { ascending: false });

    if (!error && data) {
      setLogs(data);
    }
    setLoading(false);
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase.from('wellness_logs').insert({
      user_id: user.id,
      log_type: newLog.log_type,
      activity: newLog.activity,
      duration_minutes: newLog.duration_minutes,
      notes: newLog.notes,
      mood_rating: newLog.mood_rating,
      log_date: newLog.log_date,
    });

    if (!error) {
      setShowAddModal(false);
      setNewLog({
        log_type: 'diet',
        activity: '',
        duration_minutes: 0,
        notes: '',
        mood_rating: 3,
        log_date: new Date().toISOString().split('T')[0],
      });
      loadLogs();
    }
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'diet':
        return <Apple className="w-7 h-7" />;
      case 'yoga':
        return <Heart className="w-7 h-7" />;
      case 'stress':
        return <Smile className="w-7 h-7" />;
      case 'exercise':
        return <Activity className="w-7 h-7" />;
      default:
        return <Activity className="w-7 h-7" />;
    }
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'diet':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'yoga':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'stress':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'exercise':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getMoodEmoji = (rating: number) => {
    const emojis = [':(', ':|', ':)', ':D', 'Excellent'];
    return emojis[rating - 1] || ':)';
  };

  const filteredLogs = filter === 'all' ? logs : logs.filter((log) => log.log_type === filter);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Wellness Tracking</h1>
          <p className="text-xl text-gray-600">Monitor your daily health activities</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 text-white px-6 py-4 rounded-lg text-lg font-semibold hover:bg-teal-700 transition-colors shadow-lg flex items-center gap-2"
        >
          <Plus className="w-6 h-6" />
          Log Activity
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-teal-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Wellness Recommendations</h2>
        <p className="text-gray-600 mb-4">
          Personalized plan for BP patient. Diabetes status: <span className="font-semibold">{diabetesType}</span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-teal-700 mb-2">Diet Tips</h3>
            <ul className="space-y-1 text-gray-700">
              {recommendations.dietTips.map((tip) => (
                <li key={tip}>• {tip}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-teal-700 mb-2">Exercise Suggestions</h3>
            <ul className="space-y-1 text-gray-700">
              {recommendations.exerciseSuggestions.map((tip) => (
                <li key={tip}>• {tip}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-teal-700 mb-2">Lifestyle Advice</h3>
            <ul className="space-y-1 text-gray-700">
              {recommendations.lifestyleAdvice.map((tip) => (
                <li key={tip}>• {tip}</li>
              ))}
            </ul>
          </div>
        </div>
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
            All Activities
          </button>
          <button
            onClick={() => setFilter('diet')}
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-colors ${
              filter === 'diet'
                ? 'bg-green-600 text-white'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            Diet
          </button>
          <button
            onClick={() => setFilter('yoga')}
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-colors ${
              filter === 'yoga'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            Yoga
          </button>
          <button
            onClick={() => setFilter('stress')}
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-colors ${
              filter === 'stress'
                ? 'bg-yellow-600 text-white'
                : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
            }`}
          >
            Stress Management
          </button>
          <button
            onClick={() => setFilter('exercise')}
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-colors ${
              filter === 'exercise'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
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
      ) : filteredLogs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Activity className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">No activities logged yet</h3>
          <p className="text-lg text-gray-600">Start tracking your wellness journey today</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-lg flex items-center justify-center border-2 ${getLogColor(log.log_type)}`}>
                  {getLogIcon(log.log_type)}
                </div>
                {log.mood_rating && (
                  <span className="text-sm font-semibold text-gray-600">Mood: {getMoodEmoji(log.mood_rating)}</span>
                )}
              </div>

              <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold border mb-3 ${getLogColor(log.log_type)}`}>
                {log.log_type.toUpperCase()}
              </span>

              <h3 className="text-xl font-bold text-gray-800 mb-2">{log.activity}</h3>

              {log.duration_minutes > 0 && (
                <p className="text-gray-600 mb-2">Duration: {log.duration_minutes} minutes</p>
              )}

              {log.notes && <p className="text-gray-600 mb-3 text-sm">{log.notes}</p>}

              <p className="text-sm text-gray-500">{formatDate(log.log_date)}</p>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-800">Log Wellness Activity</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <form onSubmit={handleAddLog} className="p-6 space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Activity Type
                </label>
                <select
                  value={newLog.log_type}
                  onChange={(e) => setNewLog({ ...newLog, log_type: e.target.value as LogType })}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                >
                  <option value="diet">Diet</option>
                  <option value="yoga">Yoga</option>
                  <option value="stress">Stress Management</option>
                  <option value="exercise">Exercise</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Activity</label>
                <input
                  type="text"
                  value={newLog.activity}
                  onChange={(e) => setNewLog({ ...newLog, activity: e.target.value })}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="e.g., Morning walk, Healthy breakfast"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={newLog.duration_minutes}
                  onChange={(e) =>
                    setNewLog({ ...newLog, duration_minutes: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Mood Rating (1-5)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setNewLog({ ...newLog, mood_rating: rating })}
                      className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-colors ${
                        newLog.mood_rating === rating
                          ? 'bg-teal-100 border-2 border-teal-500'
                          : 'bg-gray-50 border-2 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={newLog.notes}
                  onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  rows={3}
                  placeholder="How did you feel? Any observations?"
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newLog.log_date}
                  onChange={(e) => setNewLog({ ...newLog, log_date: e.target.value })}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                />
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
                  Log Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

