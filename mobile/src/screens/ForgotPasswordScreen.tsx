import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: Nova Senha com Token
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { forgotPassword, resetPassword } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendCode = async () => {
    try {
      // Validação básica
      if (!email.trim()) {
        setError('Por favor, informe seu e-mail');
        return;
      }

      if (!validateEmail(email.trim())) {
        setError('Por favor, informe um e-mail válido');
        return;
      }

      setIsLoading(true);
      setError('');
      
      // Usar a API real integrada
      const success = await forgotPassword(email.trim());
      
      if (success) {
        // Avançar para o próximo passo
        setStep(2);
        Alert.alert(
          'Código Enviado',
          'Verifique seu e-mail para obter o código de recuperação.'
        );
      } else {
        setError('Erro ao enviar código. Tente novamente.');
      }
      
    } catch (error) {
      console.error('Erro ao enviar código:', error);
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      // Validações
      if (!token.trim()) {
        setError('Por favor, informe o código de recuperação');
        return;
      }

      if (!newPassword) {
        setError('Por favor, informe a nova senha');
        return;
      }

      if (newPassword.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres');
        return;
      }

      if (!confirmPassword) {
        setError('Por favor, confirme a nova senha');
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('As senhas não coincidem');
        return;
      }

      setIsLoading(true);
      setError('');

      // Usar a API real integrada
      const success = await resetPassword(token.trim(), newPassword, confirmPassword);

      if (success) {
        Alert.alert(
          'Sucesso',
          'Senha redefinida com sucesso! Faça login com sua nova senha.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
      } else {
        setError('Erro ao redefinir senha. Verifique o código.');
      }

    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Recuperar Senha</Text>
      <Text style={styles.subtitle}>
        Informe seu e-mail para receber o código de recuperação
      </Text>
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
      </View>
      
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleSendCode}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.primaryButtonText}>Enviar Código</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.textButton}
        onPress={() => navigation.navigate('Login')}
        disabled={isLoading}
      >
        <Text style={styles.textButtonText}>Voltar ao Login</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Nova Senha</Text>
      <Text style={styles.subtitle}>
        Digite o código recebido por e-mail e sua nova senha
      </Text>
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Código de Recuperação</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o código recebido"
          value={token}
          onChangeText={setToken}
          editable={!isLoading}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nova Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Mínimo 6 caracteres"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          editable={!isLoading}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirme a Nova Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Repita a nova senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!isLoading}
        />
      </View>
      
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleResetPassword}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.primaryButtonText}>Redefinir Senha</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.textButton}
        onPress={() => setStep(1)}
        disabled={isLoading}
      >
        <Text style={styles.textButtonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {step === 1 ? renderStep1() : renderStep2()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  primaryButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textButton: {
    alignItems: 'center',
    padding: 12,
  },
  textButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;

