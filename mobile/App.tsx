import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuthContext } from './src/context/AuthContext';
import RootNavigator from './src/navigation/MainNavigator';
import LoginScreen from './src/screens/LoginScreen';
import AuthNavigator from './src/navigation/AuthNavigator'; 
import React, { useState, useEffect } from 'react';


const AppContent = () => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <RootNavigator />  : <AuthNavigator />}
    </NavigationContainer>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
