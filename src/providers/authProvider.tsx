'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { getUserByEmail } from "@/actions/auth";
import { User } from "@/domain/auth/authService";
import { SessionProvider, UpdateSession, useSession } from "next-auth/react";
import { Session } from "next-auth";

// Contexto para fornecer o usuário autenticado
const AuthUserContext = createContext<{ 
  user: User | null, 
  session: Session | null,
  status: "authenticated" | "loading" | "unauthenticated",
  loading: boolean,
  update?: UpdateSession
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
    <SessionProvider>
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
  const { data: session, status, update } = useSession();

  useEffect(() => {
    const refetchUser = async () => {
      setLoading(true);

      if (status === "authenticated" && session?.user) {
        try {
          const fetchedUser = await getUserByEmail(session.user.email!);
          console.log(fetchedUser)
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
  }, [status, session, update]);

  return (
    <AuthUserContext.Provider value={{ user, session, status, loading, update }}>
      {children}
    </AuthUserContext.Provider>
  );
};
