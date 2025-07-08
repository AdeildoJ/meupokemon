import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import CreateCharacterScreen from '../screens/CreateCharacterScreen';
import CharacterListScreen from '../screens/CharacterListScreen';
import CharacterDetailScreen from '../screens/CharacterDetailScreen';
import CharacterSheetScreen from '../screens/CharacterSheetScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PokemonListScreen from '../screens/PokemonListScreen';
import PokemonDetailScreen from '../screens/PokemonDetailScreen';
import ClassScreen from '../screens/ClassScreen';
import { MainStackParamList } from './types';

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="CreateCharacter" 
        component={CreateCharacterScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="CharacterSheetScreen" 
        component={CharacterSheetScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="CharacterList" 
        component={CharacterListScreen} 
        options={{ title: 'Meus Personagens' }} 
      />
      <Stack.Screen 
        name="CharacterDetail" 
        component={CharacterDetailScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Class" 
        component={ClassScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="PokemonList" 
        component={PokemonListScreen} 
        options={{ title: 'Lista Pokémon' }} 
      />
      <Stack.Screen 
        name="PokemonDetail" 
        component={PokemonDetailScreen} 
        options={{ title: 'Detalhes do Pokémon' }} 
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;


