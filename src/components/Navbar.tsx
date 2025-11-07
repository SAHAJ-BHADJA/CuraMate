import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <Heart className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-blue-600">CuraMate</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-lg text-gray-700 hover:text-blue-500 transition"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-lg text-gray-700 hover:text-blue-500 transition"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-lg text-gray-700 hover:text-blue-500 transition"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="text-lg text-gray-700 hover:text-blue-500 transition"
            >
              Contact
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-lg text-gray-700 hover:text-red-500 transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-red-500 transition"
            >
              <LogOut className="w-6 h-6" />
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 hover:text-blue-500 transition"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <button
              onClick={() => scrollToSection('home')}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 rounded"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 rounded"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 rounded"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 rounded"
            >
              Contact
            </button>
          </div>
        )}

        {user && (
          <div className="pb-3 text-sm text-gray-600">
            Welcome, <span className="font-semibold">{user.name}</span>
          </div>
        )}
      </div>
    </nav>
  );
}
