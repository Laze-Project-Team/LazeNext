import type { User } from 'firebase/auth';
import type { FC } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { createContext } from 'react';
import { useContext } from 'react';

import { auth } from '@/features/firebase';

type AuthContextType = {
  user: User | null | undefined;
};

const AuthContext = createContext<AuthContextType>({ user: null });

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthProvider: FC = ({ children }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  const value = {
    user,
  };

  useEffect(() => {
    const unsubscribeToken = auth.onIdTokenChanged((user) => {
      setUser(user);
    });
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => {
      unsubscribeToken();
      unsubscribeAuth();
    };
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
