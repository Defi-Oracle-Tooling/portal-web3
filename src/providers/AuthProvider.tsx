import { createContext, useContext, useState, type ReactNode } from 'react';
import { User, Role } from '../types/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permissionId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string) => {
    // Mock login - replace with actual implementation
    const mockUser: User = {
      id: '1',
      email,
      role: Role.USER,
      permissions: []
    };
    setUser(mockUser);
  };

  const logout = async () => {
    setUser(null);
  };

  const hasPermission = (permissionId: string) => {
    return user?.permissions.some(p => p.id === permissionId) ?? false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}; 