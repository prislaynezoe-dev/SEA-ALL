import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (user) => {
    if (!user) {
      setProfile(null);
      return null;
    }
    
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();

        if (error) {
            console.error("Error fetching profile:", error.message);
            setProfile({ role: 'collaborator' });
            return { role: 'collaborator' };
        }
        
        if (!data) {
             const { data: newProfile, error: insertError } = await supabase
                .from('profiles')
                .insert([{ id: user.id, role: 'collaborator' }])
                .select('role')
                .single();
            
            if (insertError) {
                console.error("Error creating profile:", insertError.message);
                setProfile({ role: 'collaborator' });
                return { role: 'collaborator' };
            }
            
            setProfile(newProfile);
            return newProfile;
        }
        
        setProfile(data);
        return data;

    } catch (error) {
        console.error("Error in fetchProfile:", error.message);
        setProfile({ role: 'collaborator' });
        return { role: 'collaborator' };
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const getInitialSession = async () => {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        const currentUser = initialSession?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
            await fetchProfile(currentUser);
        }
        setLoading(false);
    };
    
    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
            await fetchProfile(currentUser);
        } else {
            setProfile(null);
        }
    });

    return () => {
        subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password,
      options: {
        emailRedirectTo: window.location.origin
      }
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Login Falhou",
        description: error.message || "Credenciais inválidas.",
      });
    } else {
      toast({
        title: "Login bem-sucedido!",
        description: "Bem-vindo!",
      });
    }
    return { data, error };
  }, [toast]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Logout Falhou",
        description: error.message,
      });
    } else {
       toast({
        title: "Você saiu!",
      });
    }
    return { error };
  }, [toast]);

  const value = useMemo(() => ({
    user,
    profile,
    session,
    loading,
    signIn,
    signOut,
  }), [user, profile, session, loading, signIn, signOut]);

  return (
      <AuthContext.Provider value={value}>
          {!loading && children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
