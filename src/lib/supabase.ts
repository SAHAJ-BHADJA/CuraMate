import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string;
  role: 'patient' | 'admin';
  date_of_birth?: string;
  phone?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_conditions?: string[];
  allergies?: string[];
  blood_type?: string;
  created_at: string;
  updated_at: string;
};

export type Doctor = {
  id: string;
  full_name: string;
  specialization: string;
  qualification: string;
  experience_years: number;
  hospital_clinic?: string;
  address?: string;
  phone: string;
  email?: string;
  consultation_fee: number;
  availability?: string;
  rating: number;
  is_active: boolean;
  created_at: string;
};

export type MedicalRecord = {
  id: string;
  user_id: string;
  record_type: 'diagnosis' | 'treatment' | 'prescription' | 'lab_result' | 'vaccination';
  title: string;
  description?: string;
  doctor_name?: string;
  hospital_clinic?: string;
  record_date: string;
  medications?: string[];
  attachments?: string[];
  created_at: string;
};

export type Reminder = {
  id: string;
  user_id: string;
  reminder_type: 'medicine' | 'appointment' | 'exercise';
  title: string;
  description?: string;
  scheduled_time: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  is_completed: boolean;
  is_active: boolean;
  notification_sent: boolean;
  created_at: string;
};

export type WellnessLog = {
  id: string;
  user_id: string;
  log_date: string;
  log_type: 'diet' | 'yoga' | 'stress' | 'exercise';
  activity: string;
  duration_minutes: number;
  notes?: string;
  mood_rating?: number;
  created_at: string;
};

export type CarePlan = {
  id: string;
  user_id: string;
  plan_title: string;
  health_goals?: string[];
  recommendations?: Record<string, any>;
  diet_plan?: string;
  exercise_plan?: string;
  medication_schedule?: string;
  generated_date: string;
  is_active: boolean;
  created_at: string;
};

export type Consultation = {
  id: string;
  user_id: string;
  doctor_id: string;
  consultation_date: string;
  consultation_type: 'in-person' | 'video' | 'phone';
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  prescription?: string;
  created_at: string;
};

export type EmergencyAlert = {
  id: string;
  user_id: string;
  alert_type: 'emergency' | 'fall' | 'medication_missed' | 'health_decline';
  message: string;
  location?: string;
  status: 'active' | 'resolved' | 'false_alarm';
  responded_by?: string;
  response_notes?: string;
  created_at: string;
  resolved_at?: string;
};

export type Feedback = {
  id: string;
  user_id: string;
  category: 'bug' | 'feature' | 'general' | 'complaint';
  subject: string;
  message: string;
  rating?: number;
  status: 'new' | 'reviewed' | 'resolved';
  admin_response?: string;
  created_at: string;
};
