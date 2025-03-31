
import { createContext, useEffect, useState, useContext, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from '@/components/ui/sonner';
import { Profile, UserRole } from "@/types/supabase";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  userRole: UserRole | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      setProfile(data);
      setUserRole(data.role as UserRole);
      return data;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchUserProfile(user.id);
    }
  };

  useEffect(() => {
    setLoading(true);
    
    // Check for active session first
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id).then(() => {
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user || null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Wrap in setTimeout to prevent potential deadlock in Supabase client
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setUserRole(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.fullName || '',
            avatar_url: '',
            role: 'user'
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        },
      });

      if (error) throw error;
      toast.success("Registration successful! Please check your email for verification.");
      
    } catch (error: any) {
      console.error('Error signing up:', error.message);
      toast.error(error.message || 'An error occurred during sign up');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // The user will be set by the auth state change listener
      toast.success("Login successful!");
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Error signing in:', error.message);
      toast.error(error.message || 'Invalid login credentials');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // The user will be cleared by the auth state change listener
      toast.success("Logged out successfully");
      navigate('/');
      
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      toast.error(error.message || 'Error signing out');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      
      if (error) throw error;
      toast.success('Password reset email sent');
      
    } catch (error: any) {
      console.error('Error resetting password:', error.message);
      toast.error(error.message || 'Error sending password reset email');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      toast.success('Password updated successfully');
      
    } catch (error: any) {
      console.error('Error updating password:', error.message);
      toast.error(error.message || 'Error updating password');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    profile,
    userRole,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
