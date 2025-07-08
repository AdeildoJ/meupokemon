# PokedexApp - Projeto Pokémon Completo

Um aplicativo completo de Pokédex com sistema de personagens, autenticação e funcionalidades de jogo.

## 🚀 Funcionalidades

### ✅ Implementadas
- **Sistema de Autenticação Completo**
  - Login com email e senha
  - Registro de novos usuários
  - Recuperação de senha
  - Autenticação JWT segura

- **Gerenciamento de Personagens**
  - Criação de personagens com Pokémon inicial
  - Lista de personagens por usuário
  - Ficha detalhada do personagem
  - Sistema VIP (múltiplos personagens)

- **Interface Moderna**
  - Design responsivo e intuitivo
  - Navegação fluida entre telas
  - Feedback visual para ações do usuário
  - Menu sanduíche com opções de jogo

### 🔄 Em Desenvolvimento
- Sistema de captura de Pokémon
- Sistema de batalhas
- PokéMart (loja de itens)
- Sistema de amigos
- Funcionalidades VIP avançadas

## 🏗️ Arquitetura

### Backend (Node.js + Express)
```
src/
├── controllers/     # Controladores da API
├── models/         # Modelos do banco de dados
├── routes/         # Rotas da API
├── middlewares/    # Middlewares de autenticação
├── config/         # Configurações do banco
└── app.js         # Aplicação principal
```

### Frontend (React Native)
```
mobile/src/
├── screens/        # Telas do aplicativo
├── navigation/     # Configuração de navegação
├── context/        # Contextos (Auth, etc.)
├── services/       # Serviços de API
└── components/     # Componentes reutilizáveis
```

## 🛠️ Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados
- **Sequelize** - ORM
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas

### Frontend
- **React Native** - Framework mobile
- **TypeScript** - Tipagem estática
- **React Navigation** - Navegação
- **Axios** - Cliente HTTP
- **AsyncStorage** - Armazenamento local

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- PostgreSQL
- React Native CLI
- Android Studio (para Android)
- Xcode (para iOS)

### Backend
```bash
# Instalar dependências
npm install

# Configurar banco de dados
# 1. Criar banco PostgreSQL
# 2. Copiar .env.example para .env
# 3. Configurar variáveis de ambiente

# Executar migrações
npm run migrate

# Iniciar servidor
npm start
```

### Mobile
```bash
# Navegar para pasta mobile
cd mobile

# Instalar dependências
npm install

# Para iOS (apenas macOS)
cd ios && pod install && cd ..

# Executar no Android
npm run android

# Executar no iOS
npm run ios
```

## ⚙️ Configuração

### Variáveis de Ambiente (.env)
```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pokedex_app
DB_USER=seu_usuario
DB_PASSWORD=sua_senha

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=7d
```

## 🎮 Como Usar

1. **Registro/Login**
   - Crie uma conta ou faça login
   - Recupere sua senha se necessário

2. **Criar Personagem**
   - Escolha nome, idade, classe e região
   - Selecione seu Pokémon inicial
   - Opção de Pokémon Shiny disponível

3. **Jogar**
   - Acesse a ficha do seu personagem
   - Use o menu sanduíche para acessar funcionalidades
   - Gerencie seu time de Pokémon

## 🔐 Segurança

- Senhas criptografadas com bcrypt
- JWT com secret seguro
- Validação de entrada em todas as rotas
- Middleware de autenticação
- Variáveis sensíveis em .env

## 🚀 Deploy

### Backend
- Configure variáveis de ambiente de produção
- Use um banco PostgreSQL em produção
- Configure CORS adequadamente
- Use HTTPS em produção

### Mobile
- Configure signing para Android/iOS
- Gere builds de produção
- Publique nas lojas de aplicativos

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🐛 Problemas Conhecidos

- Algumas funcionalidades ainda em desenvolvimento
- Testes unitários pendentes
- Documentação da API em progresso

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para a comunidade Pokémon**

