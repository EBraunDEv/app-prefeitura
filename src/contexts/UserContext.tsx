'use client'
import { createContext, useState, useEffect, ReactNode, useContext } from 'react';

interface User {
  id: string;
  email?: string;
  cpf?: string;
  name: string;
}

interface UserContextData {
  user: User | null;
  loginUser: (userData: User) => void;
}

export const UserContext = createContext<UserContextData | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const loginUser = (userData: User) => {
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, loginUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}