import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Alert } from 'react-native';
import { authService, apiUtils, User } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<boolean>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string, confirmPassword: string) => Promise<boolean>;
  updateProfile: (name?: string, avatar?: string) => Promise<boolean>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar status de autenticação ao inicializar
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const token = await apiUtils.getToken();
      
      if (token) {
        // Verificar se o token ainda é válido
        const response = await authService.verifyToken();
        if (response.valid && response.user) {
          setUser(response.user);
          setIsAuthenticated(true);
          await apiUtils.saveUser(response.user);
        } else {
          // Token inválido, limpar dados
          await apiUtils.clearStorage();
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        // Sem token, verificar se há dados de usuário salvos
        const savedUser = await apiUtils.getUser();
        if (savedUser) {
          // Dados inconsistentes, limpar tudo
          await apiUtils.clearStorage();
        }
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Erro ao verificar status de autenticação:', error);
      // Em caso de erro, limpar dados e desautenticar
      await apiUtils.clearStorage();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const response = await authService.login(email, password);
      
      if (response.token && response.user) {
        // Salvar token e dados do usuário
        await apiUtils.saveToken(response.token);
        await apiUtils.saveUser(response.user);
        
        setUser(response.user);
        setIsAuthenticated(true);
        
        return true;
      } else {
        Alert.alert('Erro', 'Resposta inválida do servidor');
        return false;
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      let errorMessage = 'Erro ao fazer login. Tente novamente.';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Erro no Login', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    confirmPassword: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      
      const response = await authService.register(name, email, password, confirmPassword);
      
      if (response.token && response.user) {
        // Salvar token e dados do usuário
        await apiUtils.saveToken(response.token);
        await apiUtils.saveUser(response.user);
        
        setUser(response.user);
        setIsAuthenticated(true);
        
        Alert.alert('Sucesso', 'Conta criada com sucesso!');
        return true;
      } else {
        Alert.alert('Erro', 'Resposta inválida do servidor');
        return false;
      }
    } catch (error: any) {
      console.error('Erro no registro:', error);
      
      let errorMessage = 'Erro ao criar conta. Tente novamente.';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Erro no Registro', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Limpar dados locais
      await apiUtils.clearStorage();
      
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const response = await authService.forgotPassword(email);
      
      Alert.alert(
        'Recuperação de Senha', 
        response.message || 'Se o email existir, você receberá instruções para redefinir sua senha.'
      );
      
      return true;
    } catch (error: any) {
      console.error('Erro na recuperação de senha:', error);
      
      let errorMessage = 'Erro ao solicitar recuperação de senha.';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      Alert.alert('Erro', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (
    token: string, 
    password: string, 
    confirmPassword: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      
      const response = await authService.resetPassword(token, password, confirmPassword);
      
      Alert.alert('Sucesso', response.message || 'Senha redefinida com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Erro ao redefinir senha:', error);
      
      let errorMessage = 'Erro ao redefinir senha.';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      Alert.alert('Erro', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (name?: string, avatar?: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const response = await authService.updateProfile(name, avatar);
      
      if (response.user) {
        setUser(response.user);
        await apiUtils.saveUser(response.user);
        
        Alert.alert('Sucesso', response.message || 'Perfil atualizado com sucesso!');
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      
      let errorMessage = 'Erro ao atualizar perfil.';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      Alert.alert('Erro', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    checkAuthStatus,
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
