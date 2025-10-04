import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  Shield,
  Building2,
  Crown,
  UserCheck,
  UserX
} from 'lucide-react';
import { useAuth } from '@/components/auth';
import { User, UserRole } from '@/types/auth';
import { toast } from 'sonner';
import { PermissionGuard } from '@/components/ui/permission-guard';
import { UserCRUD } from './UserCRUD';

interface UserManagementProps {
  className?: string;
}

// Mock users data - em produção viria da API
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@aurovel.com',
    name: 'Administrador Aurovel',
    companyId: 'aurovel',
    role: UserRole.SUPER_ADMIN,
    permissions: [],
    isActive: true,
    lastLogin: '2024-01-15T10:30:00',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '3',
    email: 'admin@techsolutions.com',
    name: 'Admin Tech Solutions',
    companyId: 'tech-solutions',
    role: UserRole.COMPANY_ADMIN,
    permissions: [],
    isActive: true,
    lastLogin: '2024-01-14T15:20:00',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-14'
  },
  {
    id: '4',
    email: 'user@techsolutions.com',
    name: 'Usuário Tech Solutions',
    companyId: 'tech-solutions',
    role: UserRole.USER,
    permissions: [],
    isActive: true,
    lastLogin: '2024-01-13T09:15:00',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-13'
  }
];

export const UserManagement: React.FC<UserManagementProps> = ({ className = "" }) => {
  const { user, company, isSuperAdmin, isCompanyAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: '',
    name: '',
    role: UserRole.USER
  });

  useEffect(() => {
    loadUsers();
  }, [company]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Filtrar usuários baseado na empresa e role
      let filteredUsers = MOCK_USERS;
      
      if (!isSuperAdmin && company) {
        // Company admin só vê usuários da própria empresa
        filteredUsers = MOCK_USERS.filter(u => u.companyId === company.id);
      }
      
      setUsers(filteredUsers);
    } catch (error) {
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async () => {
    try {
      const newUser: User = {
        id: Date.now().toString(),
        email: inviteData.email,
        name: inviteData.name,
        companyId: company?.id || '',
        role: inviteData.role,
        permissions: [],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setUsers(prev => [...prev, newUser]);
      setShowInviteDialog(false);
      setInviteData({ email: '', name: '', role: UserRole.USER });
      
      toast.success('Usuário convidado com sucesso!');
    } catch (error) {
      toast.error('Erro ao convidar usuário');
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, isActive: !u.isActive } : u
    ));
    toast.success('Status do usuário atualizado');
  };

  const handleUpdateRole = (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    ));
    toast.success('Role do usuário atualizado');
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return <Crown className="h-4 w-4 text-purple-600" />;
      case UserRole.COMPANY_ADMIN:
        return <Shield className="h-4 w-4 text-blue-600" />;
      case UserRole.USER:
        return <Users className="h-4 w-4 text-gray-600" />;
      default:
        return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'Super Admin';
      case UserRole.COMPANY_ADMIN:
        return 'Admin da Empresa';
      case UserRole.USER:
        return 'Usuário';
      default:
        return role;
    }
  };

  const canManageUser = (targetUser: User) => {
    if (!user) return false;
    
    // Super admin pode gerenciar qualquer usuário
    if (isSuperAdmin) return true;
    
    // Company admin pode gerenciar usuários da própria empresa (exceto outros admins)
    if (isCompanyAdmin && targetUser.companyId === user.companyId) {
      return targetUser.role === UserRole.USER;
    }
    
    return false;
  };

  if (!isCompanyAdmin && !isSuperAdmin) {
    return null;
  }

  return <UserCRUD className={className} />;
};

export default UserManagement;