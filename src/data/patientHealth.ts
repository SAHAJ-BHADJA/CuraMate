export type DiabetesType =
  | 'Type 1 Diabetes'
  | 'Type 2 Diabetes'
  | 'Prediabetes'
  | 'No diabetes detected';

export type PatientLabReport = {
  reportId: string;
  patientName: string;
  patientId: string;
  dateOfBirth: string;
  sex: 'Male' | 'Female';
  address: string;
  phoneNumber: string;
  testDate: string;
  reportDate: string;
  physicianName: string;
  hemoglobinLevel: number;
  bloodGlucoseLevel: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heightCm: number;
  weightKg: number;
  currentMedications: string[];
  diagnosisSummary: string;
  medicalHistoryNotes: string;
};

export type RecommendedDoctor = {
  id: string;
  doctorName: string;
  qualification: string;
  specialization: string;
  clinicAddress: string;
  contactNumber: string;
  conditions: Array<'bp' | 'diabetes' | 'general'>;
};

export const mockBpLabReports: PatientLabReport[] = [
  {
    reportId: 'LAB-BP-1001',
    patientName: 'Rahul Mehta',
    patientId: 'P-1001',
    dateOfBirth: '1972-04-16',
    sex: 'Male',
    address: '14 Maple Avenue, Queens, New York, NY 11375',
    phoneNumber: '+1-212-555-1144',
    testDate: '2026-02-26',
    reportDate: '2026-02-27',
    physicianName: 'Dr. Alicia Morgan',
    hemoglobinLevel: 13.4,
    bloodGlucoseLevel: 118,
    bloodPressure: {
      systolic: 148,
      diastolic: 94,
    },
    heightCm: 171,
    weightKg: 82,
    currentMedications: ['Amlodipine 5mg (Morning)', 'Losartan 50mg (After dinner)', 'Hydrochlorothiazide 12.5mg (Morning)'],
    diagnosisSummary: 'Stage 2 Hypertension with increased cardiovascular risk. Fasting glucose in prediabetes range.',
    medicalHistoryNotes:
      'Known hypertension for 6 years. Reports occasional dizziness after high-sodium meals. Family history of Type 2 diabetes. Continue BP monitoring twice daily.',
  },
  {
    reportId: 'LAB-BP-1002',
    patientName: 'Priya Shah',
    patientId: 'P-1002',
    dateOfBirth: '1968-09-03',
    sex: 'Female',
    address: '88 River Street, Jersey City, NJ 07310',
    phoneNumber: '+1-201-555-2089',
    testDate: '2026-03-01',
    reportDate: '2026-03-02',
    physicianName: 'Dr. Kevin Thompson',
    hemoglobinLevel: 12.8,
    bloodGlucoseLevel: 156,
    bloodPressure: {
      systolic: 142,
      diastolic: 90,
    },
    heightCm: 162,
    weightKg: 78,
    currentMedications: ['Telmisartan 40mg (Morning)', 'Amlodipine 5mg (Night)', 'Metformin 500mg (After breakfast)'],
    diagnosisSummary: 'Stage 2 Hypertension with Type 2 Diabetes risk profile and mild metabolic syndrome indicators.',
    medicalHistoryNotes:
      'Hypertension with elevated fasting glucose. Mild fatigue and increased thirst reported. Recommend low sodium and controlled carbohydrate diet with regular walking.',
  },
  {
    reportId: 'LAB-BP-1003',
    patientName: 'Arjun Patel',
    patientId: 'P-1003',
    dateOfBirth: '2002-11-29',
    sex: 'Male',
    address: '522 Pine Lane, Austin, TX 78701',
    phoneNumber: '+1-512-555-6631',
    testDate: '2026-02-20',
    reportDate: '2026-02-21',
    physicianName: 'Dr. Emily Carter',
    hemoglobinLevel: 14.1,
    bloodGlucoseLevel: 262,
    bloodPressure: {
      systolic: 128,
      diastolic: 82,
    },
    heightCm: 175,
    weightKg: 69,
    currentMedications: ['Insulin glargine 10U (Night)', 'Lisinopril 10mg (Morning)'],
    diagnosisSummary: 'Likely Type 1 Diabetes with uncontrolled hyperglycemia and borderline elevated blood pressure.',
    medicalHistoryNotes:
      'Persistently high fasting glucose with recent weight loss. Further endocrine evaluation advised. Blood pressure mildly elevated; continue home monitoring.',
  },
];

export const demoPatientCredentials = [
  { email: 'sahajspam1@gmail.com', password: '123456' },
  { email: 'sahajspam2@gmail.com', password: '123456' },
  { email: 'sahajspam3@gmail.com', password: '123456' },
];

export const recommendedDoctorsCatalog: RecommendedDoctor[] = [
  {
    id: 'DOC-101',
    doctorName: 'Dr. John Smith',
    specialization: 'Cardiologist',
    qualification: 'MD, FACC',
    clinicAddress: 'ABC Heart Clinic, New York, NY',
    contactNumber: '+1-212-555-7890',
    conditions: ['bp'],
  },
  {
    id: 'DOC-102',
    doctorName: 'Dr. Maria Gonzalez',
    specialization: 'Endocrinologist',
    qualification: 'MD, FACE',
    clinicAddress: 'Metro Diabetes Center, Jersey City, NJ',
    contactNumber: '+1-201-555-3344',
    conditions: ['diabetes'],
  },
  {
    id: 'DOC-103',
    doctorName: 'Dr. Kevin Brown',
    specialization: 'Internal Medicine',
    qualification: 'MBBS, MD (Internal Medicine)',
    clinicAddress: 'WellLife Multispecialty Clinic, Brooklyn, NY',
    contactNumber: '+1-718-555-9988',
    conditions: ['bp', 'diabetes', 'general'],
  },
  {
    id: 'DOC-104',
    doctorName: 'Dr. Sarah Lee',
    specialization: 'Preventive Medicine',
    qualification: 'MD, MPH',
    clinicAddress: 'Healthy Aging Clinic, Newark, NJ',
    contactNumber: '+1-973-555-4400',
    conditions: ['general'],
  },
];

export const bpMedicationReminderTemplates = [
  {
    id: 'BP-REM-1',
    title: 'Daily BP Medicine',
    description: 'Take your BP medicine every day before lunch at 12:00 PM',
    scheduledClock: '12:00',
    frequency: 'daily' as const,
    reminderType: 'medicine' as const,
  },
  {
    id: 'BP-REM-2',
    title: 'Amlodipine 5mg',
    description: 'Take Amlodipine 5mg every morning at 8:00 AM',
    scheduledClock: '08:00',
    frequency: 'daily' as const,
    reminderType: 'medicine' as const,
  },
  {
    id: 'BP-REM-3',
    title: 'Losartan 50mg',
    description: 'Take Losartan 50mg after dinner at 7:30 PM',
    scheduledClock: '19:30',
    frequency: 'daily' as const,
    reminderType: 'medicine' as const,
  },
  {
    id: 'BP-REM-3B',
    title: 'Hydrochlorothiazide 12.5mg',
    description: 'Take Hydrochlorothiazide 12.5mg every morning at 8:30 AM',
    scheduledClock: '08:30',
    frequency: 'daily' as const,
    reminderType: 'medicine' as const,
  },
  {
    id: 'BP-REM-4',
    title: 'Blood Pressure Check',
    description: 'Check your blood pressure twice daily and log the values',
    scheduledClock: '09:00',
    frequency: 'daily' as const,
    reminderType: 'exercise' as const,
  },
];

export function identifyDiabetesType(report: PatientLabReport): DiabetesType {
  const age = calculateAge(report.dateOfBirth);
  const glucose = report.bloodGlucoseLevel;

  if (glucose >= 250 && age <= 35) {
    return 'Type 1 Diabetes';
  }

  if (glucose >= 126) {
    return 'Type 2 Diabetes';
  }

  if (glucose >= 100) {
    return 'Prediabetes';
  }

  return 'No diabetes detected';
}

export function calculateBmi(report: PatientLabReport): number {
  const heightM = report.heightCm / 100;
  return report.weightKg / (heightM * heightM);
}

export function getPatientWellnessRecommendations(report: PatientLabReport) {
  const diabetesType = identifyDiabetesType(report);
  const hasHypertension = report.bloodPressure.systolic >= 130 || report.bloodPressure.diastolic >= 80;

  const dietTips = [
    'Reduce sodium intake to help blood pressure control',
    'Eat more leafy vegetables and high-fiber foods',
    'Avoid processed foods and packaged snacks',
  ];

  if (diabetesType !== 'No diabetes detected') {
    dietTips.push('Limit sugar consumption and refined carbohydrates');
  }

  const exerciseSuggestions = [
    '30 minutes walking daily',
    'Light cardio 4-5 times per week',
    'Add flexibility and breathing exercises 10 minutes daily',
  ];

  if (hasHypertension) {
    exerciseSuggestions.push('Track BP before and after moderate exercise sessions');
  }

  const lifestyleAdvice = [
    'Sleep 7-8 hours and maintain a consistent schedule',
    'Practice stress management (deep breathing, meditation)',
    'Stay hydrated and avoid smoking/alcohol excess',
  ];

  return { dietTips, exerciseSuggestions, lifestyleAdvice };
}

export function getRecommendedDoctors(report: PatientLabReport): RecommendedDoctor[] {
  const diabetesType = identifyDiabetesType(report);
  const required: Array<'bp' | 'diabetes' | 'general'> = ['general'];

  if (report.bloodPressure.systolic >= 130 || report.bloodPressure.diastolic >= 80) {
    required.push('bp');
  }

  if (diabetesType !== 'No diabetes detected') {
    required.push('diabetes');
  }

  return recommendedDoctorsCatalog.filter((doctor) =>
    doctor.conditions.some((condition) => required.includes(condition))
  );
}

export function toIsoAtClock(baseDate: Date, clock: string): string {
  const [hour, minute] = clock.split(':').map(Number);
  const date = new Date(baseDate);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export function getMockLabReportsForUser(email?: string, fullName?: string): PatientLabReport[] {
  const normalizedEmail = normalizeDemoEmail(email || '');

  if (normalizedEmail === 'sahajspam1@gmail.com') {
    return createPatientSeries({
      patientName: fullName || 'Sahaj Bhadja',
      patientId: 'P-SAH-1001',
      dateOfBirth: '2001-03-18',
      sex: 'Male',
      address: 'Ahmedabad, Gujarat, India',
      phoneNumber: '+91-98765-43210',
      physicianName: 'Dr. Sarah Johnson',
      currentMedications: ['Amlodipine 5mg (08:00 AM)', 'Losartan 50mg (07:30 PM)', 'Hydrochlorothiazide 12.5mg (08:30 AM)'],
    });
  }

  return createPatientSeries({
    patientName: fullName || 'CuraMate Patient',
    patientId: 'P-GEN-1001',
    dateOfBirth: '1985-01-10',
    sex: 'Male',
    address: 'Patient Address',
    phoneNumber: '+1-000-000-0000',
    physicianName: 'Dr. Sarah Johnson',
    currentMedications: ['Amlodipine 5mg (08:00 AM)', 'Losartan 50mg (07:30 PM)'],
  });
}

function normalizeDemoEmail(email: string): string {
  const normalized = email.trim().toLowerCase();
  if (normalized.endsWith('@gamil.com')) {
    return normalized.replace('@gamil.com', '@gmail.com');
  }
  return normalized;
}

function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age -= 1;
  }

  return age;
}

function createPatientSeries(input: {
  patientName: string;
  patientId: string;
  dateOfBirth: string;
  sex: 'Male' | 'Female';
  address: string;
  phoneNumber: string;
  physicianName: string;
  currentMedications: string[];
}): PatientLabReport[] {
  return [
    {
      reportId: `${input.patientId}-LAB-01`,
      patientName: input.patientName,
      patientId: input.patientId,
      dateOfBirth: input.dateOfBirth,
      sex: input.sex,
      address: input.address,
      phoneNumber: input.phoneNumber,
      testDate: '2026-01-30',
      reportDate: '2026-01-31',
      physicianName: input.physicianName,
      hemoglobinLevel: 13.1,
      bloodGlucoseLevel: 95,
      bloodPressure: { systolic: 146, diastolic: 92 },
      heightCm: 173,
      weightKg: 79,
      currentMedications: input.currentMedications,
      diagnosisSummary: 'Hypertension with controlled glucose. Continue antihypertensive plan and monthly follow-up.',
      medicalHistoryNotes:
        'BP elevated on home logs. No acute symptoms. Continue low sodium diet, hydration, and adherence to medicine schedule.',
    },
    {
      reportId: `${input.patientId}-LAB-02`,
      patientName: input.patientName,
      patientId: input.patientId,
      dateOfBirth: input.dateOfBirth,
      sex: input.sex,
      address: input.address,
      phoneNumber: input.phoneNumber,
      testDate: '2026-02-19',
      reportDate: '2026-02-20',
      physicianName: input.physicianName,
      hemoglobinLevel: 13.0,
      bloodGlucoseLevel: 109,
      bloodPressure: { systolic: 150, diastolic: 94 },
      heightCm: 173,
      weightKg: 79,
      currentMedications: input.currentMedications,
      diagnosisSummary: 'Stage 2 Hypertension with Prediabetes trend. Intensify lifestyle modification and monitor fasting glucose.',
      medicalHistoryNotes:
        'Morning BP and evening BP remain above target. Advised stricter salt control and 30-minute daily brisk walk.',
    },
    {
      reportId: `${input.patientId}-LAB-03`,
      patientName: input.patientName,
      patientId: input.patientId,
      dateOfBirth: input.dateOfBirth,
      sex: input.sex,
      address: input.address,
      phoneNumber: input.phoneNumber,
      testDate: '2026-03-03',
      reportDate: '2026-03-04',
      physicianName: input.physicianName,
      hemoglobinLevel: 12.9,
      bloodGlucoseLevel: 121,
      bloodPressure: { systolic: 144, diastolic: 90 },
      heightCm: 173,
      weightKg: 78,
      currentMedications: input.currentMedications,
      diagnosisSummary: 'Persistent Hypertension with Prediabetes. Continue current medication and begin structured weight reduction plan.',
      medicalHistoryNotes:
        'BP improved slightly versus last visit but still high. Recommend continued medication adherence and follow-up in 4 weeks.',
    },
  ];
}

