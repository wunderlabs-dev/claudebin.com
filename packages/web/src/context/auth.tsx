"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import type { User } from "@supabase/supabase-js";

type AuthContextValue = {
  user: User | null;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  signOut: async () => {},
});

type AuthProviderProps = {
  initialUser: User | null;
  children: React.ReactNode;
};

const AuthProvider = ({ initialUser, children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(initialUser);

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  return <AuthContext.Provider value={{ user, signOut }}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
