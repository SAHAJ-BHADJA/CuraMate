-- Sample Data Script for CuraMate
-- This script adds sample medical records, reminders, wellness logs, and care plans
-- Replace 'YOUR_USER_ID_HERE' with your actual user ID from the profiles table

-- To find your user ID, run this query first:
-- SELECT id, full_name, email FROM auth.users WHERE email = 'your-email@example.com';

-- Then replace YOUR_USER_ID_HERE below with that ID

-- ============================================
-- SAMPLE MEDICAL RECORDS
-- ============================================

INSERT INTO medical_records (user_id, record_type, title, description, doctor_name, hospital_clinic, record_date, medications)
VALUES
  (
    'YOUR_USER_ID_HERE',
    'diagnosis',
    'Annual Physical Examination',
    'Routine health checkup. Overall health is good. Blood pressure slightly elevated at 135/85. Recommended lifestyle modifications.',
    'Dr. Michael Chen',
    'Community Health Clinic',
    CURRENT_DATE - INTERVAL '30 days',
    ARRAY['Multivitamin']
  ),
  (
    'YOUR_USER_ID_HERE',
    'lab_result',
    'Blood Work - Complete Metabolic Panel',
    'Cholesterol: 220 mg/dL (slightly high), Blood glucose: 95 mg/dL (normal), Kidney function: Normal',
    'Dr. Sarah Johnson',
    'City Heart Hospital',
    CURRENT_DATE - INTERVAL '20 days',
    ARRAY[]
  ),
  (
    'YOUR_USER_ID_HERE',
    'prescription',
    'Blood Pressure Medication',
    'Prescribed Lisinopril 10mg for blood pressure management. Take once daily in the morning.',
    'Dr. Michael Chen',
    'Community Health Clinic',
    CURRENT_DATE - INTERVAL '25 days',
    ARRAY['Lisinopril 10mg']
  ),
  (
    'YOUR_USER_ID_HERE',
    'vaccination',
    'Annual Flu Shot',
    'Administered influenza vaccine for the current flu season. No adverse reactions reported.',
    'Dr. Emily Rodriguez',
    'Community Health Clinic',
    CURRENT_DATE - INTERVAL '60 days',
    ARRAY[]
  );

-- ============================================
-- SAMPLE REMINDERS
-- ============================================

INSERT INTO reminders (user_id, reminder_type, title, description, scheduled_time, frequency, is_completed, is_active)
VALUES
  (
    'YOUR_USER_ID_HERE',
    'medicine',
    'Take Blood Pressure Medication',
    'Lisinopril 10mg with breakfast',
    CURRENT_DATE + INTERVAL '8 hours',
    'daily',
    false,
    true
  ),
  (
    'YOUR_USER_ID_HERE',
    'medicine',
    'Evening Multivitamin',
    'Take daily multivitamin with dinner',
    CURRENT_DATE + INTERVAL '19 hours',
    'daily',
    false,
    true
  ),
  (
    'YOUR_USER_ID_HERE',
    'appointment',
    'Follow-up with Cardiologist',
    'Dr. Sarah Johnson - Blood pressure check and review test results',
    CURRENT_DATE + INTERVAL '7 days' + INTERVAL '14 hours',
    'once',
    false,
    true
  ),
  (
    'YOUR_USER_ID_HERE',
    'exercise',
    'Morning Walk',
    '30-minute walk in the park',
    CURRENT_DATE + INTERVAL '9 hours',
    'daily',
    false,
    true
  ),
  (
    'YOUR_USER_ID_HERE',
    'appointment',
    'Dental Cleaning',
    'Regular dental checkup and cleaning',
    CURRENT_DATE + INTERVAL '14 days' + INTERVAL '10 hours',
    'once',
    false,
    true
  );

-- ============================================
-- SAMPLE WELLNESS LOGS
-- ============================================

INSERT INTO wellness_logs (user_id, log_date, log_type, activity, duration_minutes, notes, mood_rating)
VALUES
  (
    'YOUR_USER_ID_HERE',
    CURRENT_DATE - INTERVAL '1 day',
    'exercise',
    'Morning walk in the park',
    30,
    'Beautiful weather today. Felt energized after the walk.',
    5
  ),
  (
    'YOUR_USER_ID_HERE',
    CURRENT_DATE - INTERVAL '1 day',
    'diet',
    'Heart-healthy breakfast',
    15,
    'Oatmeal with berries, banana, and walnuts. Delicious!',
    4
  ),
  (
    'YOUR_USER_ID_HERE',
    CURRENT_DATE - INTERVAL '2 days',
    'yoga',
    'Gentle morning stretches',
    20,
    'Focused on flexibility. Feeling less stiff.',
    4
  ),
  (
    'YOUR_USER_ID_HERE',
    CURRENT_DATE - INTERVAL '2 days',
    'stress',
    'Meditation and deep breathing',
    15,
    'Used guided meditation app. Very relaxing.',
    5
  ),
  (
    'YOUR_USER_ID_HERE',
    CURRENT_DATE,
    'exercise',
    'Afternoon walk',
    25,
    'Shorter walk today but still good.',
    4
  ),
  (
    'YOUR_USER_ID_HERE',
    CURRENT_DATE,
    'diet',
    'Salmon dinner with vegetables',
    30,
    'Grilled salmon with roasted vegetables. Following heart-healthy diet.',
    5
  );

-- ============================================
-- SAMPLE CARE PLAN
-- ============================================

INSERT INTO care_plans (
  user_id,
  plan_title,
  health_goals,
  recommendations,
  diet_plan,
  exercise_plan,
  medication_schedule,
  generated_date,
  is_active
)
VALUES
  (
    'YOUR_USER_ID_HERE',
    'Heart Health and Wellness Plan',
    ARRAY['Lower blood pressure to healthy range', 'Maintain healthy weight', 'Improve cardiovascular fitness', 'Reduce stress levels'],
    '{"exercise": "30 minutes of moderate walking 5 days per week", "diet": "Mediterranean-style diet rich in fruits, vegetables, and whole grains", "medication": "Take blood pressure medication consistently at the same time daily", "monitoring": "Track blood pressure daily and maintain a health journal", "lifestyle": "Practice stress-reduction techniques and ensure 7-8 hours of sleep"}'::jsonb,
    'Heart-Healthy Mediterranean Diet:

• Eat plenty of vegetables: 5-7 servings daily, especially leafy greens
• Include fresh fruits: 3-4 servings daily, focus on berries
• Choose whole grains: Oatmeal, brown rice, whole wheat bread
• Include fish: Salmon or other fatty fish 2-3 times weekly
• Use healthy fats: Olive oil, avocado, nuts
• Limit sodium: Stay under 2000mg daily
• Reduce processed foods and added sugars
• Stay hydrated with water throughout the day
• Moderate portions and eat mindfully
• Include legumes and beans for protein',

    'Cardiovascular Exercise Program:

• Daily walking: 30 minutes, 5 days per week
• Start with warm-up: 5 minutes of slow walking
• Maintain moderate pace: Should be able to talk while walking
• Cool down: 5 minutes of slower walking and stretching
• Swimming or water aerobics: Optional 2 times per week
• Light strength training: 2 times per week with light weights
• Flexibility exercises: Daily gentle stretching
• Monitor your heart rate during exercise
• Stop if experiencing chest pain, dizziness, or shortness of breath
• Gradually increase duration and intensity over time
• Take rest days as needed for recovery',

    'Daily Medication Schedule:

• Morning (8:00 AM): Blood pressure medication with breakfast
  - Lisinopril 10mg
  - Take with full glass of water
  - Monitor blood pressure before taking

• Evening (7:00 PM): Multivitamin with dinner
  - Take with food for better absorption

• Monitoring:
  - Check blood pressure daily at the same time
  - Keep a medication log
  - Report any side effects to your doctor
  - Never skip or double up on doses
  - Set phone alarms as reminders
  - Refill prescriptions before running out',

    CURRENT_DATE,
    true
  );

-- ============================================
-- NOTES
-- ============================================

-- After running this script:
-- 1. You should see 4 medical records in your Medical Records section
-- 2. You should see 5 reminders (2 medicine, 2 appointments, 1 exercise)
-- 3. You should see 6 wellness logs from the past 2 days
-- 4. You should see 1 active care plan with detailed health information

-- To verify the data was added:
-- SELECT COUNT(*) FROM medical_records WHERE user_id = 'YOUR_USER_ID_HERE';
-- SELECT COUNT(*) FROM reminders WHERE user_id = 'YOUR_USER_ID_HERE';
-- SELECT COUNT(*) FROM wellness_logs WHERE user_id = 'YOUR_USER_ID_HERE';
-- SELECT COUNT(*) FROM care_plans WHERE user_id = 'YOUR_USER_ID_HERE';
