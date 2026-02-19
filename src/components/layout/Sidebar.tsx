import {
  Home,
  FileText,
  Calendar,
  Activity,
  Stethoscope,
  AlertTriangle,
  MessageSquare,
  Heart,
  LogOut,
  Shield,
  Users
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type SidebarProps = {
  activeView: string;
  onViewChange: (view: string) => void;
};

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { profile, signOut, isAdmin } = useAuth();

  const patientMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'records', label: 'Medical Records', icon: FileText },
    { id: 'reminders', label: 'Reminders', icon: Calendar },
    { id: 'wellness', label: 'Wellness', icon: Activity },
    { id: 'care-plan', label: 'Care Plan', icon: Heart },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope },
    { id: 'emergency', label: 'Emergency', icon: AlertTriangle },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  ];

  const adminMenuItems = [
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: Shield },
    { id: 'manage-users', label: 'Manage Users', icon: Users },
    { id: 'manage-doctors', label: 'Manage Doctors', icon: Stethoscope },
    { id: 'emergency-alerts', label: 'Emergency Alerts', icon: AlertTriangle },
    { id: 'feedback-review', label: 'Feedback Review', icon: MessageSquare },
  ];

  const menuItems = isAdmin ? adminMenuItems : patientMenuItems;

  return (
    <div className="bg-white border-r border-gray-200 w-80 flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center">
            <Heart className="w-7 h-7 text-teal-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">CuraMate</h1>
            <p className="text-sm text-gray-500">{isAdmin ? 'Admin Panel' : 'Healthcare'}</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-teal-50 rounded-lg">
          <p className="text-lg font-medium text-gray-800">{profile?.full_name}</p>
          <p className="text-sm text-gray-600">{profile?.role}</p>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg transition-colors text-lg font-medium ${
                    isActive
                      ? 'bg-teal-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-4 rounded-lg text-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-6 h-6" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
