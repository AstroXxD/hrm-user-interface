import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'employee' | 'manager';
  department: string;
  position: string;
  avatar?: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database
const mockUsers: User[] = [
  {
    id: 'admin-001',
    email: 'admin@hrm.com',
    firstName: 'John',
    lastName: 'Admin',
    role: 'admin',
    department: 'Administration',
    position: 'System Administrator',
    avatar: '',
    permissions: ['all']
  },
  {
    id: 'emp-001',
    email: 'employee@hrm.com',
    firstName: 'Jane',
    lastName: 'Employee',
    role: 'employee',
    department: 'Human Resources',
    position: 'HR Specialist',
    avatar: '',
    permissions: ['view_own_profile', 'view_own_leave', 'apply_leave']
  },
  {
    id: 'emp-002',
    email: 'manager@hrm.com',
    firstName: 'Mike',
    lastName: 'Manager',
    role: 'manager',
    department: 'Operations',
    position: 'Operations Manager',
    avatar: '',
    permissions: ['all']
  }
];

// Mock password database (in real app, these would be hashed)
const mockPasswords: Record<string, string> = {
  'admin@hrm.com': 'admin123',
  'employee@hrm.com': 'employee123',
  'manager@hrm.com': 'manager123'
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session on app load
    const storedUser = localStorage.getItem('hrm_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('hrm_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists and password is correct
      const user = mockUsers.find(u => u.email === email);
      const correctPassword = mockPasswords[email];
      
      if (!user || password !== correctPassword) {
        setIsLoading(false);
        return { success: false, message: 'Invalid email or password' };
      }
      
      // Store user in localStorage
      localStorage.setItem('hrm_user', JSON.stringify(user));
      setUser(user);
      setIsLoading(false);
      
      return { success: true, message: 'Login successful' };
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('hrm_user');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
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
