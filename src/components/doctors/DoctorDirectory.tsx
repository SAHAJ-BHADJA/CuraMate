import { useMemo, useState } from 'react';
import { Stethoscope, Search, Phone, MapPin, BadgeCheck } from 'lucide-react';
import { getRecommendedDoctors, mockBpLabReports } from '../../data/patientHealth';

export default function DoctorDirectory() {
  const [searchTerm, setSearchTerm] = useState('');

  const selectedPatientReport = mockBpLabReports[0];
  const recommendedDoctors = useMemo(
    () => getRecommendedDoctors(selectedPatientReport),
    [selectedPatientReport]
  );

  const filteredDoctors = recommendedDoctors.filter((doctor) => {
    const query = searchTerm.toLowerCase();
    return (
      doctor.doctorName.toLowerCase().includes(query) ||
      doctor.specialization.toLowerCase().includes(query) ||
      doctor.qualification.toLowerCase().includes(query) ||
      doctor.clinicAddress.toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Recommended Doctors</h1>
        <p className="text-xl text-gray-600">
          Suggested specialists based on patient condition and lab results
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <p className="text-sm text-gray-500 mb-3">Recommended for patient condition</p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
            Blood Pressure Monitoring
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
            Metabolic Risk Follow-up
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
          <input
            type="text"
            placeholder="Search recommended doctors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
      </div>

      {filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Stethoscope className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">No recommended doctors found</h3>
          <p className="text-lg text-gray-600">Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 flex-shrink-0">
                  <Stethoscope className="w-8 h-8" />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-gray-800">{doctor.doctorName}</h3>
                    <BadgeCheck className="w-5 h-5 text-teal-600" />
                  </div>
                  <p className="text-lg text-teal-700 font-semibold">{doctor.specialization}</p>
                  <p className="text-gray-700">{doctor.qualification}</p>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5 flex-shrink-0" />
                    <span>{doctor.clinicAddress}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <Phone className="w-5 h-5 flex-shrink-0" />
                    <span>{doctor.contactNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

