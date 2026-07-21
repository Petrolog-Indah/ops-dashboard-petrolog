import { useCallback, useEffect, useState, type ReactNode } from "react";
import { getProfileApi, loginApi } from "../entities/api/auth";
import { AuthContext, type User } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(() => !!localStorage.getItem('auth_token'));

  useEffect(() => {
    let isMounted = true;
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      getProfileApi(storedToken)
        .then((profile) => {
          if (isMounted) {
            setUser(profile);
            setToken(storedToken);
          }
        })
        .catch(() => {
          if (isMounted) {
            localStorage.removeItem('auth_token');
            setToken(null);
            setUser(null);
          }
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    }
    return () => { isMounted = false; };
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res = await loginApi(username, password);
    localStorage.setItem('auth_token', res.access_token);
    setToken(res.access_token);
    setUser(res.user);
    return res;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token && !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};