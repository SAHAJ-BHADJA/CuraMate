import { useEffect, useState } from 'react';
import { FileText, Plus, Search, Filter, X } from 'lucide-react';
import { supabase, MedicalRecord } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function MedicalRecords() {
  const { user } = useAuth();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newRecord, setNewRecord] = useState({
    record_type: 'diagnosis' as const,
    title: '',
    description: '',
    doctor_name: '',
    hospital_clinic: '',
    record_date: new Date().toISOString().split('T')[0],
    medications: '',
  });

  useEffect(() => {
    loadRecords();
  }, [user]);

  useEffect(() => {
    filterRecords();
  }, [records, searchTerm, filterType]);

  const loadRecords = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('medical_records')
      .select('*')
      .eq('user_id', user.id)
      .order('record_date', { ascending: false });

    if (!error && data) {
      setRecords(data);
    }
    setLoading(false);
  };

  const filterRecords = () => {
    let filtered = records;

    if (filterType !== 'all') {
      filtered = filtered.filter((r) => r.record_type === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRecords(filtered);
  };

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const medications = newRecord.medications
      .split(',')
      .map((m) => m.trim())
      .filter((m) => m);

    const { error } = await supabase.from('medical_records').insert({
      user_id: user.id,
      record_type: newRecord.record_type,
      title: newRecord.title,
      description: newRecord.description,
      doctor_name: newRecord.doctor_name,
      hospital_clinic: newRecord.hospital_clinic,
      record_date: newRecord.record_date,
      medications,
    });

    if (!error) {
      setShowAddModal(false);
      setNewRecord({
        record_type: 'diagnosis',
        title: '',
        description: '',
        doctor_name: '',
        hospital_clinic: '',
        record_date: new Date().toISOString().split('T')[0],
        medications: '',
      });
      loadRecords();
    }
  };

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case 'diagnosis':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'treatment':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'prescription':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'lab_result':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'vaccination':
        return 'bg-purple-100 text-purple-700 border-purple-300';
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

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Medical Records</h1>
          <p className="text-xl text-gray-600">Manage your health history</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 text-white px-6 py-4 rounded-lg text-lg font-semibold hover:bg-teal-700 transition-colors shadow-lg flex items-center gap-2"
        >
          <Plus className="w-6 h-6" />
          Add Record
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none"
            >
              <option value="all">All Types</option>
              <option value="diagnosis">Diagnosis</option>
              <option value="treatment">Treatment</option>
              <option value="prescription">Prescription</option>
              <option value="lab_result">Lab Result</option>
              <option value="vaccination">Vaccination</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">No records found</h3>
          <p className="text-lg text-gray-600">
            {searchTerm || filterType !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Add your first medical record to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getRecordTypeColor(
                        record.record_type
                      )}`}
                    >
                      {record.record_type.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-gray-500 text-lg">{formatDate(record.record_date)}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{record.title}</h3>
                  {record.description && (
                    <p className="text-lg text-gray-600 mb-4">{record.description}</p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {record.doctor_name && (
                      <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">Doctor</p>
                        <p className="text-lg text-gray-800">Dr. {record.doctor_name}</p>
                      </div>
                    )}
                    {record.hospital_clinic && (
                      <div>
                        <p className="text-sm font-semibold text-gray-500 mb-1">Hospital/Clinic</p>
                        <p className="text-lg text-gray-800">{record.hospital_clinic}</p>
                      </div>
                    )}
                  </div>
                  {record.medications && record.medications.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-500 mb-2">Medications</p>
                      <div className="flex flex-wrap gap-2">
                        {record.medications.map((med, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200"
                          >
                            {med}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-800">Add Medical Record</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <form onSubmit={handleAddRecord} className="p-6 space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Record Type</label>
                <select
                  value={newRecord.record_type}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, record_type: e.target.value as any })
                  }
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                >
                  <option value="diagnosis">Diagnosis</option>
                  <option value="treatment">Treatment</option>
                  <option value="prescription">Prescription</option>
                  <option value="lab_result">Lab Result</option>
                  <option value="vaccination">Vaccination</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newRecord.title}
                  onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="e.g., Annual Checkup"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newRecord.description}
                  onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  rows={4}
                  placeholder="Details about this record..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    value={newRecord.doctor_name}
                    onChange={(e) => setNewRecord({ ...newRecord, doctor_name: e.target.value })}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Dr. Smith"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Hospital/Clinic
                  </label>
                  <input
                    type="text"
                    value={newRecord.hospital_clinic}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, hospital_clinic: e.target.value })
                    }
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="City Hospital"
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Record Date</label>
                <input
                  type="date"
                  value={newRecord.record_date}
                  onChange={(e) => setNewRecord({ ...newRecord, record_date: e.target.value })}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Medications (comma-separated)
                </label>
                <input
                  type="text"
                  value={newRecord.medications}
                  onChange={(e) => setNewRecord({ ...newRecord, medications: e.target.value })}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Medicine A, Medicine B"
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
                  Add Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
