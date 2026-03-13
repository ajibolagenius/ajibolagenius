import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AdminAuthContext = createContext(null);

const TOKEN_KEY = 'admin_token';

export function AdminAuthProvider({ children }) {
  const [token, setTokenState] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(false);

  const setToken = useCallback((t) => {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
    setTokenState(t);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
  }, [setToken]);

  const isAuthenticated = !!token;

  const value = { token, setToken, logout, isAuthenticated, loading, setLoading };
  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
