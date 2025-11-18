"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  getCookie,
  deleteCookie
} from "cookies-next";
import { User } from "@/models/user";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { client } from "@/graphql/apollo-client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const accessTokenCookie = getCookie("accessToken");

    if (!accessTokenCookie) {
      setUser(null);
      setLoading(false);

      router.replace("/login");

      return;
    }

    if (typeof accessTokenCookie === "string") {
      const decodedUser = getUserFromToken(accessTokenCookie);

      if (!decodedUser) {
        setUser(null);
        setLoading(false);

        return;
      }

      setUser((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(decodedUser)) {
          return decodedUser;
        }
        return prev;
      });

      setLoading(false);
    }

  }, []);


  const logout = async (): Promise<void> => {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");

    await client.clearStore()

    setUser(null);

    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("O hook useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
