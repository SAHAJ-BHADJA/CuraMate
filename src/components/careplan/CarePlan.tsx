import { useEffect, useState } from 'react';
import { Heart, Target, Apple, Activity, Pill, Sparkles, Plus, X } from 'lucide-react';
import { supabase, CarePlan as CarePlanType } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function CarePlan() {
  const { user } = useAuth();
  const [carePlans, setCarePlans] = useState<CarePlanType[]>([]);
  const [activePlan, setActivePlan] = useState<CarePlanType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [newPlan, setNewPlan] = useState({
    plan_title: '',
    health_goals: '',
    medical_conditions: '',
  });

  useEffect(() => {
    loadCarePlans();
  }, [user]);

  const loadCarePlans = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('care_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCarePlans(data);
      const active = data.find((p) => p.is_active);
      setActivePlan(active || null);
    }
    setLoading(false);
  };

  const generateAIPlan = async () => {
    if (!user) return;

    setGenerating(true);

    const goals = newPlan.health_goals.split(',').map((g) => g.trim()).filter((g) => g);

    const sampleRecommendations = {
      exercise: 'Engage in 30 minutes of moderate walking 5 days per week. Start with shorter sessions and gradually increase duration.',
      diet: 'Focus on a Mediterranean-style diet rich in fruits, vegetables, whole grains, and lean proteins. Limit sodium intake.',
      medication: 'Take all prescribed medications as directed. Set reminders for consistent timing.',
      monitoring: 'Monitor blood pressure daily and log readings. Watch for any concerning symptoms.',
      lifestyle: 'Maintain regular sleep schedule of 7-8 hours. Practice stress-reduction techniques like deep breathing.',
    };

    const { error } = await supabase.from('care_plans').insert({
      user_id: user.id,
      plan_title: newPlan.plan_title,
      health_goals: goals,
      recommendations: sampleRecommendations,
      diet_plan: 'Follow a balanced diet with emphasis on whole foods. Limit processed foods, excess salt, and sugar. Include colorful vegetables, lean proteins, and healthy fats. Stay well-hydrated throughout the day.',
      exercise_plan: 'Begin with gentle activities like walking or chair exercises. Gradually increase intensity as tolerated. Include flexibility and balance exercises. Always warm up and cool down properly.',
      medication_schedule: 'Take medications at the same time each day. Use a pill organizer for convenience. Keep a medication log. Report any side effects to your healthcare provider immediately.',
      is_active: true,
    });

    if (!error) {
      await supabase
        .from('care_plans')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .neq('is_active', false);

      setShowCreateModal(false);
      setNewPlan({
        plan_title: '',
        health_goals: '',
        medical_conditions: '',
      });
      loadCarePlans();
    }

    setGenerating(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Care Plan</h1>
          <p className="text-xl text-gray-600">Personalized health recommendations</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-teal-600 text-white px-6 py-4 rounded-lg text-lg font-semibold hover:bg-teal-700 transition-colors shadow-lg flex items-center gap-2"
        >
          <Plus className="w-6 h-6" />
          Create New Plan
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : !activePlan ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Sparkles className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Active Care Plan</h3>
          <p className="text-lg text-gray-600 mb-6">
            Create a personalized care plan to get health recommendations
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-teal-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-teal-700 transition-colors shadow-lg inline-flex items-center gap-2"
          >
            <Plus className="w-6 h-6" />
            Create Care Plan
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-xl p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-10 h-10" />
              <h2 className="text-3xl font-bold">{activePlan.plan_title}</h2>
            </div>
            <p className="text-lg opacity-90">
              Generated on {new Date(activePlan.generated_date).toLocaleDateString()}
            </p>
          </div>

          {activePlan.health_goals && activePlan.health_goals.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <Target className="w-7 h-7 text-teal-600" />
                Health Goals
              </h3>
              <ul className="space-y-3">
                {activePlan.health_goals.map((goal, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-lg">
                    <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700">{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activePlan.diet_plan && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <Apple className="w-7 h-7 text-green-600" />
                  Diet Plan
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">{activePlan.diet_plan}</p>
              </div>
            )}

            {activePlan.exercise_plan && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <Activity className="w-7 h-7 text-blue-600" />
                  Exercise Plan
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">{activePlan.exercise_plan}</p>
              </div>
            )}

            {activePlan.medication_schedule && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <Pill className="w-7 h-7 text-red-600" />
                  Medication Schedule
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {activePlan.medication_schedule}
                </p>
              </div>
            )}

            {activePlan.recommendations && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <Heart className="w-7 h-7 text-pink-600" />
                  Recommendations
                </h3>
                <div className="space-y-3">
                  {Object.entries(activePlan.recommendations).map(([key, value]) => (
                    <div key={key}>
                      <h4 className="font-semibold text-teal-600 capitalize mb-1">{key}</h4>
                      <p className="text-gray-700">{value as string}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-800">Create Care Plan</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-4 flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700">
                  Our system will generate a personalized care plan based on your health goals and medical conditions.
                </p>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Plan Title</label>
                <input
                  type="text"
                  value={newPlan.plan_title}
                  onChange={(e) => setNewPlan({ ...newPlan, plan_title: e.target.value })}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="e.g., Heart Health Management Plan"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Health Goals (comma-separated)
                </label>
                <textarea
                  value={newPlan.health_goals}
                  onChange={(e) => setNewPlan({ ...newPlan, health_goals: e.target.value })}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  rows={3}
                  placeholder="e.g., Lower blood pressure, Improve mobility, Better sleep"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Medical Conditions (comma-separated)
                </label>
                <textarea
                  value={newPlan.medical_conditions}
                  onChange={(e) =>
                    setNewPlan({ ...newPlan, medical_conditions: e.target.value })
                  }
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  rows={3}
                  placeholder="e.g., Hypertension, Diabetes, Arthritis"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={generateAIPlan}
                  disabled={generating || !newPlan.plan_title || !newPlan.health_goals}
                  className="flex-1 px-6 py-4 bg-teal-600 text-white rounded-lg text-lg font-semibold hover:bg-teal-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {generating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Plan
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
