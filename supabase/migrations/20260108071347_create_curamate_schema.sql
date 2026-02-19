/*
  # CuraMate Healthcare Application Schema

  ## Overview
  Complete database schema for CuraMate, a healthcare management platform for elderly and chronic patients.

  ## New Tables

  ### 1. profiles
  Extended user profile information linked to auth.users
  - `id` (uuid, FK to auth.users) - User identifier
  - `full_name` (text) - Full name of the user
  - `role` (text) - User role: 'patient' or 'admin'
  - `date_of_birth` (date) - Date of birth
  - `phone` (text) - Contact phone number
  - `address` (text) - Residential address
  - `emergency_contact_name` (text) - Emergency contact name
  - `emergency_contact_phone` (text) - Emergency contact phone
  - `medical_conditions` (text[]) - Array of chronic conditions
  - `allergies` (text[]) - Known allergies
  - `blood_type` (text) - Blood type
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. doctors
  Healthcare provider directory
  - `id` (uuid, PK) - Doctor identifier
  - `full_name` (text) - Doctor's full name
  - `specialization` (text) - Medical specialization
  - `qualification` (text) - Educational qualifications
  - `experience_years` (integer) - Years of experience
  - `hospital_clinic` (text) - Associated hospital/clinic
  - `address` (text) - Practice address
  - `phone` (text) - Contact phone
  - `email` (text) - Contact email
  - `consultation_fee` (numeric) - Consultation fee
  - `availability` (text) - Available hours
  - `rating` (numeric) - Average rating (0-5)
  - `is_active` (boolean) - Active status
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. medical_records
  Patient medical history and records
  - `id` (uuid, PK) - Record identifier
  - `user_id` (uuid, FK) - Patient reference
  - `record_type` (text) - Type: 'diagnosis', 'treatment', 'prescription', 'lab_result', 'vaccination'
  - `title` (text) - Record title
  - `description` (text) - Detailed description
  - `doctor_name` (text) - Attending physician
  - `hospital_clinic` (text) - Healthcare facility
  - `record_date` (date) - Date of record
  - `medications` (text[]) - Prescribed medications
  - `attachments` (text[]) - Document URLs
  - `created_at` (timestamptz) - Record creation timestamp

  ### 4. documents
  Medical document storage references
  - `id` (uuid, PK) - Document identifier
  - `user_id` (uuid, FK) - Document owner
  - `filename` (text) - Original filename
  - `file_path` (text) - Storage path/URL
  - `file_type` (text) - MIME type
  - `file_size` (integer) - File size in bytes
  - `category` (text) - Document category
  - `description` (text) - Document description
  - `uploaded_at` (timestamptz) - Upload timestamp

  ### 5. reminders
  Medication, appointment, and exercise reminders
  - `id` (uuid, PK) - Reminder identifier
  - `user_id` (uuid, FK) - User reference
  - `reminder_type` (text) - Type: 'medicine', 'appointment', 'exercise'
  - `title` (text) - Reminder title
  - `description` (text) - Detailed description
  - `scheduled_time` (timestamptz) - Scheduled reminder time
  - `frequency` (text) - Frequency: 'once', 'daily', 'weekly', 'monthly'
  - `is_completed` (boolean) - Completion status
  - `is_active` (boolean) - Active status
  - `notification_sent` (boolean) - Notification delivery status
  - `created_at` (timestamptz) - Record creation timestamp

  ### 6. wellness_logs
  Daily wellness tracking (diet, yoga, stress management)
  - `id` (uuid, PK) - Log identifier
  - `user_id` (uuid, FK) - User reference
  - `log_date` (date) - Log date
  - `log_type` (text) - Type: 'diet', 'yoga', 'stress', 'exercise'
  - `activity` (text) - Activity description
  - `duration_minutes` (integer) - Activity duration
  - `notes` (text) - Additional notes
  - `mood_rating` (integer) - Mood rating (1-5)
  - `created_at` (timestamptz) - Record creation timestamp

  ### 7. care_plans
  AI-generated personalized care plans
  - `id` (uuid, PK) - Care plan identifier
  - `user_id` (uuid, FK) - Patient reference
  - `plan_title` (text) - Plan title
  - `health_goals` (text[]) - Health objectives
  - `recommendations` (jsonb) - AI-generated recommendations
  - `diet_plan` (text) - Dietary recommendations
  - `exercise_plan` (text) - Exercise recommendations
  - `medication_schedule` (text) - Medication guidance
  - `generated_date` (date) - Plan generation date
  - `is_active` (boolean) - Active status
  - `created_at` (timestamptz) - Record creation timestamp

  ### 8. consultations
  Doctor consultation bookings
  - `id` (uuid, PK) - Consultation identifier
  - `user_id` (uuid, FK) - Patient reference
  - `doctor_id` (uuid, FK) - Doctor reference
  - `consultation_date` (timestamptz) - Scheduled date/time
  - `consultation_type` (text) - Type: 'in-person', 'video', 'phone'
  - `reason` (text) - Consultation reason
  - `status` (text) - Status: 'scheduled', 'completed', 'cancelled'
  - `notes` (text) - Consultation notes
  - `prescription` (text) - Prescribed treatment
  - `created_at` (timestamptz) - Record creation timestamp

  ### 9. emergency_alerts
  Emergency alert system
  - `id` (uuid, PK) - Alert identifier
  - `user_id` (uuid, FK) - User reference
  - `alert_type` (text) - Type: 'emergency', 'fall', 'medication_missed'
  - `message` (text) - Alert message
  - `location` (text) - User location
  - `status` (text) - Status: 'active', 'resolved', 'false_alarm'
  - `responded_by` (uuid) - Admin who responded
  - `response_notes` (text) - Response notes
  - `created_at` (timestamptz) - Alert timestamp
  - `resolved_at` (timestamptz) - Resolution timestamp

  ### 10. feedback
  User feedback and suggestions
  - `id` (uuid, PK) - Feedback identifier
  - `user_id` (uuid, FK) - User reference
  - `category` (text) - Category: 'bug', 'feature', 'general', 'complaint'
  - `subject` (text) - Feedback subject
  - `message` (text) - Detailed message
  - `rating` (integer) - App rating (1-5)
  - `status` (text) - Status: 'new', 'reviewed', 'resolved'
  - `admin_response` (text) - Admin response
  - `created_at` (timestamptz) - Submission timestamp

  ## Security
  - RLS enabled on all tables
  - Patients can only access their own data
  - Admins have full access to manage all data
  - Doctors table is publicly readable for directory
  - Emergency alerts are visible to admins and the creating user
*/

-- Create enum-like constraint check later with check constraints

-- 1. Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'patient' CHECK (role IN ('patient', 'admin')),
  date_of_birth date,
  phone text,
  address text,
  emergency_contact_name text,
  emergency_contact_phone text,
  medical_conditions text[] DEFAULT '{}',
  allergies text[] DEFAULT '{}',
  blood_type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  specialization text NOT NULL,
  qualification text NOT NULL,
  experience_years integer DEFAULT 0,
  hospital_clinic text,
  address text,
  phone text NOT NULL,
  email text,
  consultation_fee numeric DEFAULT 0,
  availability text,
  rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 3. Medical records table
CREATE TABLE IF NOT EXISTS medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  record_type text NOT NULL CHECK (record_type IN ('diagnosis', 'treatment', 'prescription', 'lab_result', 'vaccination')),
  title text NOT NULL,
  description text,
  doctor_name text,
  hospital_clinic text,
  record_date date NOT NULL DEFAULT CURRENT_DATE,
  medications text[] DEFAULT '{}',
  attachments text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- 4. Documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filename text NOT NULL,
  file_path text NOT NULL,
  file_type text,
  file_size integer DEFAULT 0,
  category text DEFAULT 'general',
  description text,
  uploaded_at timestamptz DEFAULT now()
);

-- 5. Reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_type text NOT NULL CHECK (reminder_type IN ('medicine', 'appointment', 'exercise')),
  title text NOT NULL,
  description text,
  scheduled_time timestamptz NOT NULL,
  frequency text DEFAULT 'once' CHECK (frequency IN ('once', 'daily', 'weekly', 'monthly')),
  is_completed boolean DEFAULT false,
  is_active boolean DEFAULT true,
  notification_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 6. Wellness logs table
CREATE TABLE IF NOT EXISTS wellness_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  log_type text NOT NULL CHECK (log_type IN ('diet', 'yoga', 'stress', 'exercise')),
  activity text NOT NULL,
  duration_minutes integer DEFAULT 0,
  notes text,
  mood_rating integer CHECK (mood_rating >= 1 AND mood_rating <= 5),
  created_at timestamptz DEFAULT now()
);

-- 7. Care plans table
CREATE TABLE IF NOT EXISTS care_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_title text NOT NULL,
  health_goals text[] DEFAULT '{}',
  recommendations jsonb DEFAULT '{}',
  diet_plan text,
  exercise_plan text,
  medication_schedule text,
  generated_date date DEFAULT CURRENT_DATE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 8. Consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  consultation_date timestamptz NOT NULL,
  consultation_type text DEFAULT 'in-person' CHECK (consultation_type IN ('in-person', 'video', 'phone')),
  reason text NOT NULL,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes text,
  prescription text,
  created_at timestamptz DEFAULT now()
);

-- 9. Emergency alerts table
CREATE TABLE IF NOT EXISTS emergency_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type text NOT NULL CHECK (alert_type IN ('emergency', 'fall', 'medication_missed', 'health_decline')),
  message text NOT NULL,
  location text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'false_alarm')),
  responded_by uuid REFERENCES auth.users(id),
  response_notes text,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- 10. Feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category text DEFAULT 'general' CHECK (category IN ('bug', 'feature', 'general', 'complaint')),
  subject text NOT NULL,
  message text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  status text DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'resolved')),
  admin_response text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Doctors policies (public read, admin write)
CREATE POLICY "Anyone can view active doctors"
  ON doctors FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can insert doctors"
  ON doctors FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update doctors"
  ON doctors FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete doctors"
  ON doctors FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Medical records policies
CREATE POLICY "Users can view own medical records"
  ON medical_records FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own medical records"
  ON medical_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medical records"
  ON medical_records FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all medical records"
  ON medical_records FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Documents policies
CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON documents FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all documents"
  ON documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Reminders policies
CREATE POLICY "Users can view own reminders"
  ON reminders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reminders"
  ON reminders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders"
  ON reminders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders"
  ON reminders FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Wellness logs policies
CREATE POLICY "Users can view own wellness logs"
  ON wellness_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wellness logs"
  ON wellness_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wellness logs"
  ON wellness_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own wellness logs"
  ON wellness_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Care plans policies
CREATE POLICY "Users can view own care plans"
  ON care_plans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own care plans"
  ON care_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all care plans"
  ON care_plans FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Consultations policies
CREATE POLICY "Users can view own consultations"
  ON consultations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own consultations"
  ON consultations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own consultations"
  ON consultations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all consultations"
  ON consultations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Emergency alerts policies
CREATE POLICY "Users can view own emergency alerts"
  ON emergency_alerts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emergency alerts"
  ON emergency_alerts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all emergency alerts"
  ON emergency_alerts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update emergency alerts"
  ON emergency_alerts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Feedback policies
CREATE POLICY "Users can view own feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert feedback"
  ON feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update feedback"
  ON feedback FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_medical_records_user_id ON medical_records(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_scheduled_time ON reminders(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_wellness_logs_user_id ON wellness_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_wellness_logs_date ON wellness_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_care_plans_user_id ON care_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_doctor_id ON consultations(doctor_id);
CREATE INDEX IF NOT EXISTS idx_emergency_alerts_user_id ON emergency_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_alerts_status ON emergency_alerts(status);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id);