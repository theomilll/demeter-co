import { createContext, useContext, useState, useEffect } from 'react';

// Estado de login mantido por Hooks (substitui o auth.js/localStorage-flag da AV1).
const AuthContext = createContext(null);

const STORAGE_KEY = 'demetrius_user';

export function AuthProvider({ children }) {
  // inicializa a partir do localStorage (sobrevive a refresh), mas o controle é por estado.
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login = (dados) => setUser(dados);     // { login, nome }
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isLogged: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
