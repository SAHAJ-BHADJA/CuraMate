import { useState } from 'react';
import { AlertTriangle, Phone, MapPin, Heart, Activity, Pill, TrendingDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function Emergency() {
  const { user, profile } = useAuth();
  const [alertSent, setAlertSent] = useState(false);
  const [selectedType, setSelectedType] = useState<
    'emergency' | 'fall' | 'medication_missed' | 'health_decline'
  >('emergency');
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState('');
  const [sending, setSending] = useState(false);

  const sendAlert = async (type: typeof selectedType) => {
    if (!user) return;

    setSending(true);
    const { error } = await supabase.from('emergency_alerts').insert({
      user_id: user.id,
      alert_type: type,
      message: message || getDefaultMessage(type),
      location,
      status: 'active',
    });

    if (!error) {
      setAlertSent(true);
      setTimeout(() => setAlertSent(false), 5000);
    }
    setSending(false);
  };

  const getDefaultMessage = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'EMERGENCY! Immediate assistance required.';
      case 'fall':
        return 'Fall detected. Need assistance.';
      case 'medication_missed':
        return 'Missed medication reminder. Need help.';
      case 'health_decline':
        return 'Experiencing health decline. Request check-in.';
      default:
        return 'Emergency alert';
    }
  };

  const alertTypes = [
    {
      type: 'emergency' as const,
      label: 'Emergency',
      icon: AlertTriangle,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      description: 'Immediate medical emergency',
    },
    {
      type: 'fall' as const,
      label: 'Fall Alert',
      icon: Activity,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      description: 'I have fallen and need help',
    },
    {
      type: 'medication_missed' as const,
      label: 'Medication Help',
      icon: Pill,
      color: 'bg-yellow-500',
      hoverColor: 'hover:bg-yellow-600',
      description: 'Need help with medication',
    },
    {
      type: 'health_decline' as const,
      label: 'Health Check',
      icon: TrendingDown,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      description: 'Not feeling well, need check-in',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Emergency Alerts</h1>
        <p className="text-xl text-gray-600">Quick access to emergency assistance</p>
      </div>

      {alertSent && (
        <div className="bg-green-100 border-2 border-green-500 rounded-xl p-6 mb-8 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-green-800">Alert Sent Successfully!</h3>
              <p className="text-lg text-green-700">Emergency services have been notified.</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Emergency Contacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Phone className="w-8 h-8 text-red-600" />
              <h3 className="text-xl font-bold text-gray-800">Emergency Services</h3>
            </div>
            <a
              href="tel:911"
              className="text-3xl font-bold text-red-600 hover:text-red-700 block"
            >
              911
            </a>
          </div>

          {profile?.emergency_contact_name && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Heart className="w-8 h-8 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Emergency Contact</h3>
              </div>
              <p className="text-lg font-semibold text-gray-800 mb-2">
                {profile.emergency_contact_name}
              </p>
              {profile.emergency_contact_phone && (
                <a
                  href={`tel:${profile.emergency_contact_phone}`}
                  className="text-xl font-bold text-blue-600 hover:text-blue-700"
                >
                  {profile.emergency_contact_phone}
                </a>
              )}
            </div>
          )}

          <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-8 h-8 text-teal-600" />
              <h3 className="text-xl font-bold text-gray-800">Your Location</h3>
            </div>
            <p className="text-lg text-gray-700">{profile?.address || 'Not set'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Alert</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {alertTypes.map((alertType) => {
            const Icon = alertType.icon;
            return (
              <button
                key={alertType.type}
                onClick={() => setSelectedType(alertType.type)}
                className={`p-8 rounded-xl border-4 transition-all ${
                  selectedType === alertType.type
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className={`w-16 h-16 ${alertType.color} rounded-full flex items-center justify-center mb-4`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{alertType.label}</h3>
                <p className="text-lg text-gray-600">{alertType.description}</p>
              </button>
            );
          })}
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Additional Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              rows={3}
              placeholder={getDefaultMessage(selectedType)}
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Current Location (Optional)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Enter your current location"
            />
          </div>

          <button
            onClick={() => sendAlert(selectedType)}
            disabled={sending}
            className={`w-full py-6 rounded-xl text-2xl font-bold text-white shadow-xl transition-colors ${
              alertTypes.find((a) => a.type === selectedType)?.color
            } ${
              alertTypes.find((a) => a.type === selectedType)?.hoverColor
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {sending ? 'Sending Alert...' : `Send ${alertTypes.find((a) => a.type === selectedType)?.label}`}
          </button>
        </div>

        <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-bold text-yellow-800 mb-2">Important</h4>
              <p className="text-gray-700">
                For life-threatening emergencies, always call 911 directly. This alert system
                notifies your caregivers and administrators, but should not replace emergency
                services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
