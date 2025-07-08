#!/bin/bash

echo "🚀 Configurando PokedexApp..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    print_error "Node.js não encontrado. Por favor, instale Node.js 18+ primeiro."
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js versão 18+ é necessária. Versão atual: $(node -v)"
    exit 1
fi

print_success "Node.js $(node -v) encontrado"

# Instalar dependências do backend
print_status "Instalando dependências do backend..."
if npm install; then
    print_success "Dependências do backend instaladas"
else
    print_error "Falha ao instalar dependências do backend"
    exit 1
fi

# Configurar arquivo .env se não existir
if [ ! -f .env ]; then
    print_status "Criando arquivo .env..."
    cp .env.example .env
    print_warning "Configure as variáveis de ambiente no arquivo .env antes de continuar"
else
    print_success "Arquivo .env já existe"
fi

# Instalar dependências do mobile
print_status "Instalando dependências do mobile..."
cd mobile
if npm install; then
    print_success "Dependências do mobile instaladas"
else
    print_error "Falha ao instalar dependências do mobile"
    exit 1
fi

# Voltar para o diretório raiz
cd ..

print_success "Setup concluído!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure o banco PostgreSQL"
echo "2. Edite o arquivo .env com suas configurações"
echo "3. Execute 'npm start' para iniciar o backend"
echo "4. Execute 'cd mobile && npm run android' para o app Android"
echo "5. Execute 'cd mobile && npm run ios' para o app iOS (apenas macOS)"
echo ""
echo "📚 Consulte o README.md para mais informações"

