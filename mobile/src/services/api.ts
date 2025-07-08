import axios, { AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração base da API
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' // Desenvolvimento
  : 'https://your-production-api.com/api'; // Produção

// Instância principal da API
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Instância para PokeAPI (dados externos)
const pokeApi = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/',
  timeout: 10000,
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@PokedexApp:token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao obter token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      await AsyncStorage.multiRemove(['@PokedexApp:token', '@PokedexApp:user']);
      // Aqui você pode redirecionar para a tela de login
      // navigation.navigate('Login');
    }
    
    return Promise.reject(error);
  }
);

// Tipos para as respostas da API
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
  isVip: boolean;
  lastLoginAt?: string;
}

export interface Character {
  id: string;
  userId: number;
  name: string;
  age: number;
  class: string;
  origin: string;
  gender: string;
  avatar?: string;
  starterPokemonId: number;
  starterPokemonName: string;
  starterIsShiny: boolean;
  level: number;
  experience: number;
  coins: number;
  isActive: boolean;
  pokemon?: Pokemon[];
}

export interface Pokemon {
  id: string;
  characterId: string;
  pokemonId: number;
  name: string;
  nickname?: string;
  level: number;
  experience: number;
  isShiny: boolean;
  gender?: 'M' | 'F';
  nature?: string;
  ability?: string;
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  currentHp: number;
  status: string;
  teamPosition?: number;
  moves: any[];
  caughtAt: string;
  caughtLocation?: string;
  pokeball: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// Serviços de autenticação
export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  async register(
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/register', {
      name,
      email,
      password,
      confirmPassword,
    });
    return response.data;
  },

  async forgotPassword(email: string): Promise<ApiResponse<any>> {
    const response = await api.post<ApiResponse<any>>('/auth/forgot-password', {
      email,
    });
    return response.data;
  },

  async resetPassword(
    token: string,
    password: string,
    confirmPassword: string
  ): Promise<ApiResponse<any>> {
    const response = await api.post<ApiResponse<any>>('/auth/reset-password', {
      token,
      password,
      confirmPassword,
    });
    return response.data;
  },

  async verifyToken(): Promise<{ valid: boolean; user: User }> {
    const response = await api.get<{ valid: boolean; user: User }>('/auth/verify');
    return response.data;
  },

  async updateProfile(name?: string, avatar?: string): Promise<ApiResponse<User>> {
    const response = await api.put<ApiResponse<User>>('/auth/profile', {
      name,
      avatar,
    });
    return response.data;
  },
};

// Serviços de personagens
export const characterService = {
  async create(characterData: {
    name: string;
    age: number;
    class: string;
    origin: string;
    gender: string;
    starterPokemonId: number;
    starterPokemonName: string;
    starterIsShiny?: boolean;
  }): Promise<ApiResponse<Character>> {
    const response = await api.post<ApiResponse<Character>>('/characters', characterData);
    return response.data;
  },

  async list(): Promise<{ characters: Character[] }> {
    const response = await api.get<{ characters: Character[] }>('/characters');
    return response.data;
  },

  async getById(id: string): Promise<{ character: Character }> {
    const response = await api.get<{ character: Character }>(`/characters/${id}`);
    return response.data;
  },

  async update(id: string, data: { name?: string; avatar?: string }): Promise<ApiResponse<Character>> {
    const response = await api.put<ApiResponse<Character>>(`/characters/${id}`, data);
    return response.data;
  },

  async addExperience(id: string, experience: number): Promise<ApiResponse<Character>> {
    const response = await api.post<ApiResponse<Character>>(`/characters/${id}/experience`, {
      experience,
    });
    return response.data;
  },

  async addCoins(id: string, coins: number): Promise<ApiResponse<Character>> {
    const response = await api.post<ApiResponse<Character>>(`/characters/${id}/coins`, {
      coins,
    });
    return response.data;
  },
};

// Serviços da PokeAPI (dados externos)
export const pokemonDataService = {
  async getPokemon(idOrName: string | number) {
    const response = await pokeApi.get(`/pokemon/${idOrName}`);
    return response.data;
  },

  async getPokemonSpecies(idOrName: string | number) {
    const response = await pokeApi.get(`/pokemon-species/${idOrName}`);
    return response.data;
  },

  async getPokemonList(limit: number = 20, offset: number = 0) {
    const response = await pokeApi.get(`/pokemon?limit=${limit}&offset=${offset}`);
    return response.data;
  },

  async getType(idOrName: string | number) {
    const response = await pokeApi.get(`/type/${idOrName}`);
    return response.data;
  },

  async getMove(idOrName: string | number) {
    const response = await pokeApi.get(`/move/${idOrName}`);
    return response.data;
  },
};

// Utilitários
export const apiUtils = {
  async saveToken(token: string): Promise<void> {
    await AsyncStorage.setItem('@PokedexApp:token', token);
  },

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('@PokedexApp:token');
  },

  async removeToken(): Promise<void> {
    await AsyncStorage.removeItem('@PokedexApp:token');
  },

  async saveUser(user: User): Promise<void> {
    await AsyncStorage.setItem('@PokedexApp:user', JSON.stringify(user));
  },

  async getUser(): Promise<User | null> {
    const userData = await AsyncStorage.getItem('@PokedexApp:user');
    return userData ? JSON.parse(userData) : null;
  },

  async removeUser(): Promise<void> {
    await AsyncStorage.removeItem('@PokedexApp:user');
  },

  async clearStorage(): Promise<void> {
    await AsyncStorage.multiRemove(['@PokedexApp:token', '@PokedexApp:user']);
  },
};

export default api;
