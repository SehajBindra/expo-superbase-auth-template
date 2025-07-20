import { createContext, useContext, useEffect, useState } from "react";

import { Session } from "@supabase/supabase-js";
import { supabase } from "~/lib/supabase";

export type UserProfile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url?: string | null;
  updated_at?: string;
};

const AuthContext = createContext<{
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
}>({
  session: null,
  profile: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSessionAndProfile = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session fetch error:", error);
        setLoading(false);
        return;
      }

      const currentSession = data?.session ?? null;
      setSession(currentSession);

      if (currentSession?.user?.id) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentSession.user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
        } else {
          setProfile(profileData);
        }
      }

      setLoading(false);
    };

    getSessionAndProfile();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, sess) => {
        setSession(sess);

        if (sess?.user?.id) {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", sess.user.id)
            .single();

          if (profileError) {
            console.error("Profile fetch error (auth change):", profileError);
          } else {
            setProfile(profileData);
          }
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
