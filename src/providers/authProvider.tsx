'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { getUser } from "@/actions/auth";
import { User } from "@/domain/auth/authService";
import { SessionProvider, useSession } from "next-auth/react";
import { Session } from "next-auth";

// Contexto para fornecer o usuário autenticado
const AuthUserContext = createContext<{ 
  user: User | null, 
  session: Session | null,
  status: "authenticated" | "loading" | "unauthenticated",
  loading: boolean
}>({
  user: null,
  session: null,
  status: "loading",
  loading: false,
});

// Hook para acessar o usuário autenticado
export const useAuthUser = () => {
  const context = useContext(AuthUserContext);
  if (context === undefined) {
    throw new Error("useAuthUser must be used within an AuthProvider");
  }
  return context;
};

/**
 * Combines SessionProvider and authentication logic
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider refetchOnWindowFocus={false} refetchInterval={0}>
      <AuthHandler>{children}</AuthHandler>
    </SessionProvider>
  );
};

/**
 * Component that manages the state of the authenticated user
 */
const AuthHandler = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    const refetchUser = async () => {
      setLoading(true);

      if (status === "authenticated" && session?.user?.id) {
        try {
          const fetchedUser = await getUser(session.user.id);
          setUser(fetchedUser);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    refetchUser();
  }, [status, session]);

  return (
    <AuthUserContext.Provider value={{ user, session, status, loading }}>
      {children}
    </AuthUserContext.Provider>
  );
};
