import { Navbar } from '../components/Navbar';
import { Bell, Heart, Stethoscope, CheckCircle, Users, Zap } from 'lucide-react';

export function Home() {
  const scrollToFeatures = () => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section id="home" className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Your Digital Health Companion
              </h1>
              <p className="text-xl md:text-2xl font-light mb-8 leading-relaxed">
                Manage your medicines, track wellness, and stay connected with your doctors — all in one place.
              </p>
              <button
                onClick={scrollToFeatures}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition shadow-lg"
              >
                Get Started
              </button>
            </div>
            <div className="hidden md:block">
              <div className="bg-blue-400 rounded-2xl p-8 shadow-2xl">
                <div className="bg-white rounded-xl p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-6 h-6 text-blue-500" />
                    <div className="h-2 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Heart className="w-6 h-6 text-red-500" />
                    <div className="h-2 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Stethoscope className="w-6 h-6 text-green-500" />
                    <div className="h-2 bg-gray-200 rounded w-28"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4">
            Our Features
          </h2>
          <p className="text-center text-gray-600 text-lg mb-16">
            Everything you need for better health management
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-1 transition">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                <Bell className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Health Reminders
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Never miss your medicine or appointment with smart alerts delivered right to your phone.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-1 transition">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Wellness & Yoga
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Follow personalized wellness and yoga routines designed for your health and mobility.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-1 transition">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                <Stethoscope className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Doctor Consultation
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Instant access to verified doctors and online consultations from the comfort of your home.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-blue-500 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Create Your Account
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Sign up with your email and set up your CuraMate profile in just a few minutes.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-500 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Add Your Health Details
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Share your medications, preferences, and health goals with us securely.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-500 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Get Personalized Care
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Receive reminders, wellness tips, and connect with doctors tailored to your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16">
            What Our Users Say
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
              </div>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed italic">
                "CuraMate helps me take my medicines on time and stay active. It's so easy to use, and the reminders keep me on track!"
              </p>
              <p className="font-bold text-gray-800">- Elderly User</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
              </div>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed italic">
                "Having instant access to doctors through CuraMate gives me peace of mind. I feel more in control of my health journey."
              </p>
              <p className="font-bold text-gray-800">- Satisfied Patient</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-500 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl mb-8 font-light">
            Join thousands of users managing their wellness with CuraMate
          </p>
          <button className="bg-white text-blue-500 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition shadow-lg">
            Get Started Today
          </button>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="w-6 h-6 text-blue-400" />
                <span className="text-xl font-bold text-white">CuraMate</span>
              </div>
              <p className="text-gray-400 text-lg">
                Your trusted digital health companion.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-lg">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#home" className="hover:text-blue-400 transition">Home</a></li>
                <li><a href="#features" className="hover:text-blue-400 transition">Features</a></li>
                <li><a href="#about" className="hover:text-blue-400 transition">About</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-lg">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Terms of Use</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <p className="text-center text-gray-400 text-lg">
              © 2025 CuraMate | Designed by Siddhi H. Gosai, Prayosha J. Solanki, Bhavi P. Trambadia | Dr. Subhash University
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
