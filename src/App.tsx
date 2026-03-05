import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import Sidebar from './components/layout/Sidebar';
import PatientDashboard from './components/dashboard/PatientDashboard';
import MedicalRecords from './components/records/MedicalRecords';
import Reminders from './components/reminders/Reminders';
import Wellness from './components/wellness/Wellness';
import CarePlan from './components/careplan/CarePlan';
import DoctorDirectory from './components/doctors/DoctorDirectory';
import Emergency from './components/emergency/Emergency';
import Feedback from './components/feedback/Feedback';
import AdminDashboard from './components/admin/AdminDashboard';

function AuthScreen() {
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');

  if (view === 'forgot') {
    return <ForgotPassword onBack={() => setView('login')} />;
  }

  return view === 'login' ? (
    <Login
      onToggleView={() => setView('register')}
      onForgotPassword={() => setView('forgot')}
    />
  ) : (
    <Register onToggleView={() => setView('login')} />
  );
}

function MainApp() {
  const { loading, user, isAdmin } = useAuth();
  const [activeView, setActiveView] = useState(isAdmin ? 'admin-dashboard' : 'dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-2xl font-semibold text-gray-700">Loading CuraMate...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <PatientDashboard onNavigate={(view) => setActiveView(view)} />;
      case 'records':
        return <MedicalRecords />;
      case 'reminders':
        return <Reminders />;
      case 'wellness':
        return <Wellness />;
      case 'care-plan':
        return <CarePlan />;
      case 'doctors':
        return <DoctorDirectory />;
      case 'emergency':
        return <Emergency />;
      case 'feedback':
        return <Feedback />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'manage-users':
        return (
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Manage Users</h1>
            <p className="text-xl text-gray-600">User management interface coming soon</p>
          </div>
        );
      case 'manage-doctors':
        return (
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Manage Doctors</h1>
            <p className="text-xl text-gray-600">Doctor management interface coming soon</p>
          </div>
        );
      case 'emergency-alerts':
        return (
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Emergency Alerts</h1>
            <p className="text-xl text-gray-600">Emergency alert management coming soon</p>
          </div>
        );
      case 'feedback-review':
        return (
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Feedback Review</h1>
            <p className="text-xl text-gray-600">Feedback review interface coming soon</p>
          </div>
        );
      default:
        return isAdmin ? <AdminDashboard /> : <PatientDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
