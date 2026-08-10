import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole, DepartmentKey } from '../types/erp';
import { storageService } from '../services/storageService';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (userId: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  hasPermission: (
    department: DepartmentKey, 
    action: 'view' | 'create' | 'edit' | 'delete' | 'approve'
  ) => boolean;
  usersList: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => storageService.getCurrentUser());
  const [usersList, setUsersList] = useState<User[]>(() => storageService.getUsers());

  useEffect(() => {
    const handleStorageChange = () => {
      setUsersList(storageService.getUsers());
      setCurrentUser(storageService.getCurrentUser());
    };

    window.addEventListener('hzhy-erp-storage-update', handleStorageChange);
    return () => window.removeEventListener('hzhy-erp-storage-update', handleStorageChange);
  }, []);

  const login = (userId: string): boolean => {
    const user = usersList.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      storageService.setCurrentUser(user);
      storageService.addAuditLog({
        userName: user.name,
        userRole: user.role,
        department: user.department,
        action: 'User session started',
        ipAddress: '192.168.1.100',
        status: 'Success'
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
      storageService.addAuditLog({
        userName: currentUser.name,
        userRole: currentUser.role,
        department: currentUser.department,
        action: 'User session terminated',
        ipAddress: '192.168.1.100',
        status: 'Success'
      });
    }
    setCurrentUser(null);
    storageService.setCurrentUser(null);
  };

  const switchRole = (role: UserRole) => {
    const targetUser = usersList.find(u => u.role === role);
    if (targetUser) {
      login(targetUser.id);
    }
  };

  const hasPermission = (
    department: DepartmentKey, 
    action: 'view' | 'create' | 'edit' | 'delete' | 'approve'
  ): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'Super Admin') return true;

    const deptPerms = currentUser.permissions[department];
    if (!deptPerms) return false;

    return !!deptPerms[action];
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated: !!currentUser,
      login,
      logout,
      switchRole,
      hasPermission,
      usersList
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
