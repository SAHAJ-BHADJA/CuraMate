import { useEffect, useState } from 'react';
import { Stethoscope, Search, Star, Phone, Mail, MapPin, Calendar, X, CheckCircle } from 'lucide-react';
import { supabase, Doctor } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function DoctorDirectory() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [booking, setBooking] = useState({
    consultation_date: '',
    consultation_type: 'in-person' as const,
    reason: '',
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [doctors, searchTerm, specializationFilter]);

  const loadDoctors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('is_active', true)
      .order('rating', { ascending: false });

    if (!error && data) {
      setDoctors(data);
    }
    setLoading(false);
  };

  const filterDoctors = () => {
    let filtered = doctors;

    if (specializationFilter !== 'all') {
      filtered = filtered.filter((d) =>
        d.specialization.toLowerCase().includes(specializationFilter.toLowerCase())
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (d) =>
          d.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.hospital_clinic?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDoctors(filtered);
  };

  const handleBookConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedDoctor) return;

    const { error } = await supabase.from('consultations').insert({
      user_id: user.id,
      doctor_id: selectedDoctor.id,
      consultation_date: booking.consultation_date,
      consultation_type: booking.consultation_type,
      reason: booking.reason,
      status: 'scheduled',
    });

    if (!error) {
      setShowBookingModal(false);
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setSelectedDoctor(null);
      }, 3000);
      setBooking({
        consultation_date: '',
        consultation_type: 'in-person',
        reason: '',
      });
    }
  };

  const specializations = [...new Set(doctors.map((d) => d.specialization))];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Doctor Directory</h1>
        <p className="text-xl text-gray-600">Find and consult with healthcare professionals</p>
      </div>

      {bookingSuccess && (
        <div className="mb-6 bg-green-100 border-2 border-green-500 rounded-xl p-6 animate-pulse">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-10 h-10 text-green-600" />
            <div>
              <h3 className="text-2xl font-bold text-green-800">Appointment Booked!</h3>
              <p className="text-lg text-green-700">
                Your consultation with {selectedDoctor?.full_name} has been scheduled successfully.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <select
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
            className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="all">All Specializations</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Stethoscope className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">No doctors found</h3>
          <p className="text-lg text-gray-600">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 flex-shrink-0">
                  <Stethoscope className="w-10 h-10" />
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">{doctor.full_name}</h3>
                  <p className="text-lg text-teal-600 font-semibold mb-3">{doctor.specialization}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(doctor.rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 font-semibold">{doctor.rating.toFixed(1)}</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">
                        {doctor.hospital_clinic || 'Private Practice'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">{doctor.phone}</span>
                    </div>
                    {doctor.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm">{doctor.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Consultation Fee</p>
                      <p className="text-xl font-bold text-gray-800">${doctor.consultation_fee}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedDoctor(doctor);
                        setShowBookingModal(true);
                      }}
                      className="bg-teal-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center gap-2"
                    >
                      <Calendar className="w-5 h-5" />
                      Book Consultation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showBookingModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Book Consultation</h2>
                <p className="text-lg text-gray-600 mt-1">with {selectedDoctor.full_name}</p>
              </div>
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  setSelectedDoctor(null);
                }}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <form onSubmit={handleBookConsultation} className="p-6 space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Consultation Type
                </label>
                <select
                  value={booking.consultation_type}
                  onChange={(e) =>
                    setBooking({ ...booking, consultation_type: e.target.value as any })
                  }
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                >
                  <option value="in-person">In-Person</option>
                  <option value="video">Video Call</option>
                  <option value="phone">Phone Call</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Date and Time
                </label>
                <input
                  type="datetime-local"
                  value={booking.consultation_date}
                  onChange={(e) => setBooking({ ...booking, consultation_date: e.target.value })}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Reason for Consultation
                </label>
                <textarea
                  value={booking.reason}
                  onChange={(e) => setBooking({ ...booking, reason: e.target.value })}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  rows={4}
                  placeholder="Please describe your symptoms or health concerns..."
                  required
                />
              </div>

              <div className="bg-teal-50 rounded-lg p-4 border-2 border-teal-200">
                <p className="text-gray-700">
                  <span className="font-semibold">Consultation Fee:</span> $
                  {selectedDoctor.consultation_fee}
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowBookingModal(false);
                    setSelectedDoctor(null);
                  }}
                  className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-teal-600 text-white rounded-lg text-lg font-semibold hover:bg-teal-700 transition-colors shadow-lg"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
