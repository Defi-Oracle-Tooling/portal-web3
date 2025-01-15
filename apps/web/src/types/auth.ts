export type Role = 'owner' | 'admin' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  scope: string[];
} 