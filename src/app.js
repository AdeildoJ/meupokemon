const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { sequelize, testConnection } = require("./config/database");

// Importar os modelos
const { User, Character, Pokemon, EncounterList, EncounterPokemon } = require("./models");

// Importar as rotas
const authRoutes = require("./routes/authRoutes");
const characterRoutes = require("./routes/characterRoutes");
const pokemonRoutes = require("./routes/pokemonRoutes");

// Inicializar o app Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:19006'], // Permitir React Native Metro
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, "../public")));

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/characters", characterRoutes);
app.use("/api/admin", pokemonRoutes);

// Rota de teste
app.get("/api", (req, res) => {
  res.json({
    message: "API da PokedexApp está funcionando!",
    version: "2.0.0",
    timestamp: new Date().toISOString()
  });
});

// Rota para verificar saúde da API
app.get("/api/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      database: "disconnected",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Rota para a página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path,
    method: req.method
  });
});

// Função para inicializar o banco de dados
async function initializeDatabase() {
  try {
    await testConnection();
    
    // Sincronizar modelos (criar tabelas se não existirem)
    await sequelize.sync({ force: true });
    console.log('Banco de dados sincronizado com sucesso.');
    
    // Criar usuário admin padrão se não existir
    const adminUser = await User.findOne({ where: { email: 'admin@pokedex.com' } });
    if (!adminUser) {
      await User.create({
        name: 'Administrador',
        email: 'admin@pokedex.com',
        password: 'admin123',
        isAdmin: true,
        isVip: true
      });
      console.log('Usuário administrador criado: admin@pokedex.com / admin123');
    }
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    process.exit(1);
  }
}

// Iniciar o servidor
async function startServer() {
  try {
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📱 API disponível em: http://localhost:${PORT}/api`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📖 Documentação: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Tratamento de sinais para encerramento gracioso
process.on('SIGTERM', async () => {
  console.log('Recebido SIGTERM, encerrando servidor...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Recebido SIGINT, encerrando servidor...');
  await sequelize.close();
  process.exit(0);
});

// Iniciar aplicação
startServer();