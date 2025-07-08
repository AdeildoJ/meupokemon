const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');

const authController = {
  // Login de usuário
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Validação básica
      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email e senha são obrigatórios' 
        });
      }
      
      // Buscar usuário pelo email
      const user = await User.findOne({ 
        where: { email: email.toLowerCase() } 
      });
      
      if (!user) {
        return res.status(401).json({ 
          error: 'Email ou senha incorretos' 
        });
      }
      
      // Verificar se o usuário está ativo
      if (!user.isActive) {
        return res.status(401).json({ 
          error: 'Conta desativada. Entre em contato com o suporte.' 
        });
      }
      
      // Verificar senha
      const passwordMatch = await user.checkPassword(password);
      
      if (!passwordMatch) {
        return res.status(401).json({ 
          error: 'Email ou senha incorretos' 
        });
      }
      
      // Atualizar último login
      await user.updateLastLogin();
      
      // Gerar token JWT
      const token = jwt.sign(
        { 
          id: user.id,
          email: user.email 
        }, 
        process.env.JWT_SECRET, 
        {
          expiresIn: process.env.JWT_EXPIRATION
        }
      );
      
      return res.json({
        message: 'Login realizado com sucesso',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          isAdmin: user.isAdmin,
          isVip: user.isActiveVip(),
          lastLoginAt: user.lastLoginAt
        },
        token
      });
    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({ 
        error: 'Erro interno do servidor' 
      });
    }
  },

  // Registro de novo usuário
  async register(req, res) {
    try {
      const { name, email, password, confirmPassword } = req.body;
      
      // Validações básicas
      if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ 
          error: 'Todos os campos são obrigatórios' 
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ 
          error: 'As senhas não coincidem' 
        });
      }

      if (password.length < 6) {
        return res.status(400).json({ 
          error: 'A senha deve ter pelo menos 6 caracteres' 
        });
      }

      // Verificar se o email já existe
      const existingUser = await User.findOne({ 
        where: { email: email.toLowerCase() } 
      });
      
      if (existingUser) {
        return res.status(409).json({ 
          error: 'Este email já está em uso' 
        });
      }
      
      // Criar novo usuário
      const user = await User.create({
        name: name.trim(),
        email: email.toLowerCase(),
        password
      });
      
      // Gerar token JWT
      const token = jwt.sign(
        { 
          id: user.id,
          email: user.email 
        }, 
        process.env.JWT_SECRET, 
        {
          expiresIn: process.env.JWT_EXPIRATION
        }
      );
      
      return res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          isAdmin: user.isAdmin,
          isVip: user.isActiveVip()
        },
        token
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      return res.status(500).json({ 
        error: 'Erro interno do servidor' 
      });
    }
  },

  // Solicitar recuperação de senha
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ 
          error: 'Email é obrigatório' 
        });
      }
      
      const user = await User.findOne({ 
        where: { email: email.toLowerCase() } 
      });
      
      if (!user) {
        // Por segurança, sempre retorna sucesso mesmo se o email não existir
        return res.json({
          message: 'Se o email existir, você receberá instruções para redefinir sua senha'
        });
      }
      
      // Gerar token de reset
      const resetToken = user.generateResetToken();
      await user.save();
      
      // TODO: Implementar envio de email
      // Por enquanto, retorna o token (apenas para desenvolvimento)
      return res.json({
        message: 'Token de recuperação gerado',
        resetToken // Remover em produção
      });
    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      return res.status(500).json({ 
        error: 'Erro interno do servidor' 
      });
    }
  },

  // Redefinir senha
  async resetPassword(req, res) {
    try {
      const { token, password, confirmPassword } = req.body;
      
      if (!token || !password || !confirmPassword) {
        return res.status(400).json({ 
          error: 'Todos os campos são obrigatórios' 
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ 
          error: 'As senhas não coincidem' 
        });
      }

      if (password.length < 6) {
        return res.status(400).json({ 
          error: 'A senha deve ter pelo menos 6 caracteres' 
        });
      }
      
      const user = await User.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: {
            [require('sequelize').Op.gt]: new Date()
          }
        }
      });
      
      if (!user) {
        return res.status(400).json({ 
          error: 'Token inválido ou expirado' 
        });
      }
      
      // Atualizar senha e limpar token
      user.password = password;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
      
      return res.json({
        message: 'Senha redefinida com sucesso'
      });
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      return res.status(500).json({ 
        error: 'Erro interno do servidor' 
      });
    }
  },

  // Verificar token
  async verifyToken(req, res) {
    try {
      const user = req.user; // Vem do middleware de autenticação
      
      return res.json({
        valid: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          isAdmin: user.isAdmin,
          isVip: user.isActiveVip(),
          lastLoginAt: user.lastLoginAt
        }
      });
    } catch (error) {
      console.error('Erro na verificação do token:', error);
      return res.status(500).json({ 
        error: 'Erro interno do servidor' 
      });
    }
  },

  // Atualizar perfil
  async updateProfile(req, res) {
    try {
      const { name, avatar } = req.body;
      const user = req.user;
      
      if (name) {
        user.name = name.trim();
      }
      
      if (avatar) {
        user.avatar = avatar;
      }
      
      await user.save();
      
      return res.json({
        message: 'Perfil atualizado com sucesso',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          isAdmin: user.isAdmin,
          isVip: user.isActiveVip()
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return res.status(500).json({ 
        error: 'Erro interno do servidor' 
      });
    }
  }
};

module.exports = authController;
