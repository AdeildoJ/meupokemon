// Configuração do Axios
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
} );

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Funções de API
const apiService = {
  // Autenticação
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Listas de Encontro
  getLists: async () => {
    const response = await api.get('/admin/lists');
    return response.data;
  },

  getListDetails: async (listId) => {
    const response = await api.get(`/admin/lists/${listId}`);
    return response.data;
  },

  // Pokémon
  addPokemon: async (listId, pokemonData) => {
    const response = await api.post(`/admin/lists/${listId}/pokemon`, pokemonData);
    return response.data;
  },

  updatePokemon: async (pokemonId, pokemonData) => {
    const response = await api.put(`/admin/pokemon/${pokemonId}`, pokemonData);
    return response.data;
  },

  removePokemon: async (pokemonId) => {
    const response = await api.delete(`/admin/pokemon/${pokemonId}`);
    return response.data;
  },

  restockPokemon: async (pokemonId, quantity) => {
    const response = await api.put(`/admin/pokemon/${pokemonId}/restock`, { quantity });
    return response.data;
  },

  normalizeChances: async (listId) => {
    const response = await api.put(`/admin/lists/${listId}/normalize-chances`);
    return response.data;
  }
};
