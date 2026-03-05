import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';
import { demoPatientCredentials } from '../data/patientHealth';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const storedDemoEmail = localStorage.getItem('curamate_demo_email');
    if (storedDemoEmail && isDemoEmail(storedDemoEmail)) {
      activateDemoSession(storedDemoEmail);
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (isDemoMode) return;
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, [isDemoMode]);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) return { error };

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: fullName,
            role: 'patient',
          });

        if (profileError) return { error: profileError };
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const activateDemoSession = (email: string) => {
    const normalizedEmail = normalizeDemoEmail(email);
    const demoUser = buildDemoUser(normalizedEmail);
    const inferredName = normalizedEmail.split('@')[0];

    setIsDemoMode(true);
    setSession(null);
    setUser(demoUser);
    setProfile({
      id: demoUser.id,
      full_name: inferredName,
      role: 'patient',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    localStorage.setItem('curamate_demo_email', normalizedEmail);
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data.session) {
        setIsDemoMode(false);
        localStorage.removeItem('curamate_demo_email');
        setSession(data.session);
        setUser(data.session.user);
        await loadProfile(data.session.user.id);
        return { error: null };
      }

      if (error && isDemoCredential(email, password)) {
        activateDemoSession(email);
        setLoading(false);
        return { error: null };
      }

      return { error };
    } catch (error) {
      if (isDemoCredential(email, password)) {
        activateDemoSession(email);
        setLoading(false);
        return { error: null };
      }
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsDemoMode(false);
    localStorage.removeItem('curamate_demo_email');
    setProfile(null);
    setSession(null);
    setUser(null);
  };

  const isAdmin = profile?.role === 'admin';

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function isDemoCredential(email: string, password: string): boolean {
  const normalizedEmail = normalizeDemoEmail(email);
  return demoPatientCredentials.some(
    (credential) =>
      credential.email.toLowerCase() === normalizedEmail &&
      credential.password === password
  );
}

function isDemoEmail(email: string): boolean {
  const normalizedEmail = normalizeDemoEmail(email);
  return demoPatientCredentials.some(
    (credential) => credential.email.toLowerCase() === normalizedEmail
  );
}

function getDemoUserId(email: string): string {
  const normalizedEmail = normalizeDemoEmail(email);
  if (normalizedEmail === 'sahajspam1@gmail.com') return '11111111-1111-1111-1111-111111111111';
  if (normalizedEmail === 'sahajspam2@gmail.com') return '22222222-2222-2222-2222-222222222222';
  if (normalizedEmail === 'sahajspam3@gmail.com') return '33333333-3333-3333-3333-333333333333';
  return '99999999-9999-9999-9999-999999999999';
}

function buildDemoUser(email: string): User {
  const normalizedEmail = normalizeDemoEmail(email);
  const nowIso = new Date().toISOString();

  return {
    id: getDemoUserId(normalizedEmail),
    aud: 'authenticated',
    role: 'authenticated',
    email: normalizedEmail,
    email_confirmed_at: nowIso,
    phone: '',
    confirmed_at: nowIso,
    last_sign_in_at: nowIso,
    app_metadata: {},
    user_metadata: {},
    identities: [],
    created_at: nowIso,
    updated_at: nowIso,
    is_anonymous: false,
  };
}

function normalizeDemoEmail(email: string): string {
  const normalized = email.trim().toLowerCase();
  if (normalized.endsWith('@gamil.com')) {
    return normalized.replace('@gamil.com', '@gmail.com');
  }
  return normalized;
}
