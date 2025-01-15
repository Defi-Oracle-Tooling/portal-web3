export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST'
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface User {
  id: string;
  email: string;
  role: Role;
  permissions: Permission[];
} 