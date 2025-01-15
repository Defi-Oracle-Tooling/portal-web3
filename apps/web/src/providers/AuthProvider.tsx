import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Role, Permission } from '../types/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permissionId: string) => boolean;
  hasRole: (role: Role) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // TODO: Implement actual authentication
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email,
      role: 'admin',
      permissions: [
        {
          id: 'manage_users',
          name: 'Manage Users',
          description: 'Can manage system users',
          scope: ['read', 'write']
        }
      ]
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (permissionId: string): boolean => {
    return user?.permissions.some(p => p.id === permissionId) ?? false;
  };

  const hasRole = (role: Role): boolean => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 