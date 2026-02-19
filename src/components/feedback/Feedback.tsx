import { useState, useEffect } from 'react';
import { MessageSquare, Send, Star } from 'lucide-react';
import { supabase, Feedback as FeedbackType } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function Feedback() {
  const { user } = useAuth();
  const [myFeedback, setMyFeedback] = useState<FeedbackType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [newFeedback, setNewFeedback] = useState({
    category: 'general' as const,
    subject: '',
    message: '',
    rating: 5,
  });

  useEffect(() => {
    loadFeedback();
  }, [user]);

  const loadFeedback = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMyFeedback(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    const { error } = await supabase.from('feedback').insert({
      user_id: user.id,
      category: newFeedback.category,
      subject: newFeedback.subject,
      message: newFeedback.message,
      rating: newFeedback.rating,
      status: 'new',
    });

    if (!error) {
      setNewFeedback({
        category: 'general',
        subject: '',
        message: '',
        rating: 5,
      });
      loadFeedback();
    }
    setSubmitting(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700';
      case 'reviewed':
        return 'bg-yellow-100 text-yellow-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Feedback</h1>
        <p className="text-xl text-gray-600">Share your thoughts and suggestions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Send className="w-7 h-7 text-teal-600" />
            Submit Feedback
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newFeedback.category}
                onChange={(e) =>
                  setNewFeedback({ ...newFeedback, category: e.target.value as any })
                }
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                required
              >
                <option value="general">General Feedback</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="complaint">Complaint</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                value={newFeedback.subject}
                onChange={(e) => setNewFeedback({ ...newFeedback, subject: e.target.value })}
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Brief description"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={newFeedback.message}
                onChange={(e) => setNewFeedback({ ...newFeedback, message: e.target.value })}
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                rows={6}
                placeholder="Tell us more..."
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Rate Your Experience
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setNewFeedback({ ...newFeedback, rating })}
                    className="p-2 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        rating <= newFeedback.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-teal-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-teal-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Feedback
                </>
              )}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <MessageSquare className="w-7 h-7 text-teal-600" />
            Your Feedback History
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : myFeedback.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg text-gray-500">No feedback submitted yet</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {myFeedback.map((feedback) => (
                <div key={feedback.id} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{feedback.subject}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        feedback.status
                      )}`}
                    >
                      {feedback.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{feedback.message}</p>
                  {feedback.rating && (
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < feedback.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  {feedback.admin_response && (
                    <div className="mt-3 p-3 bg-teal-50 border-l-4 border-teal-500 rounded">
                      <p className="text-sm font-semibold text-teal-800 mb-1">Admin Response:</p>
                      <p className="text-sm text-teal-700">{feedback.admin_response}</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">{formatDate(feedback.created_at)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
