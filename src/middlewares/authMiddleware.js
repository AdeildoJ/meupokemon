const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    // Verificar se o token está presente no header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        error: 'Token de acesso requerido' 
      });
    }
    
    // Formato do header: "Bearer TOKEN"
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2) {
      return res.status(401).json({ 
        error: 'Formato de token inválido' 
      });
    }
    
    const [scheme, token] = parts;
    
    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ 
        error: 'Tipo de token inválido' 
      });
    }
    
    // Verificar se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar o usuário no banco de dados
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Usuário não encontrado' 
      });
    }
    
    // Verificar se o usuário está ativo
    if (!user.isActive) {
      return res.status(401).json({ 
        error: 'Conta desativada' 
      });
    }
    
    // Adicionar o usuário completo ao request
    req.user = user;
    req.userId = user.id;
    
    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Token inválido' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expirado' 
      });
    }
    
    console.error('Erro no middleware de autenticação:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
};

// Middleware para verificar se é admin
const adminMiddleware = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ 
      error: 'Acesso restrito a administradores' 
    });
  }
  return next();
};

// Middleware para verificar se é VIP
const vipMiddleware = (req, res, next) => {
  if (!req.user || !req.user.isActiveVip()) {
    return res.status(403).json({ 
      error: 'Acesso restrito a usuários VIP' 
    });
  }
  return next();
};

module.exports = authMiddleware;
module.exports.adminMiddleware = adminMiddleware;
module.exports.vipMiddleware = vipMiddleware;
