const { Character, Pokemon, User } = require('../models');
const { Op } = require('sequelize');

const characterController = {
  // Criar novo personagem
  async create(req, res) {
    try {
      const { name, age, class: characterClass, origin, gender, starterPokemonId, starterPokemonName, starterIsShiny } = req.body;
      const userId = req.user.id;

      // Verificar se o usuário já tem personagens
      const existingCharacters = await Character.findAll({ where: { userId } });
      
      // Se não é VIP e já tem personagem, não pode criar outro
      if (existingCharacters.length > 0 && !req.user.isActiveVip()) {
        return res.status(403).json({
          error: 'Apenas usuários VIP podem ter múltiplos personagens'
        });
      }

      // Validar dados obrigatórios
      if (!name || !age || !characterClass || !origin || !gender || !starterPokemonId || !starterPokemonName) {
        return res.status(400).json({
          error: 'Todos os campos obrigatórios devem ser preenchidos'
        });
      }

      const character = await Character.create({
        userId,
        name,
        age,
        class: characterClass,
        origin,
        gender,
        starterPokemonId,
        starterPokemonName,
        starterIsShiny: starterIsShiny || false
      });

      // Criar o Pokémon inicial
      await Pokemon.create({
        characterId: character.id,
        pokemonId: starterPokemonId,
        name: starterPokemonName,
        level: 5,
        isShiny: starterIsShiny || false,
        teamPosition: 1,
        currentHp: 25,
        hp: 25
      });

      res.status(201).json({
        message: 'Personagem criado com sucesso',
        character
      });
    } catch (error) {
      console.error('Erro ao criar personagem:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  },

  // Listar personagens do usuário
  async list(req, res) {
    try {
      const userId = req.user.id;

      const characters = await Character.findAll({
        where: { userId, isActive: true },
        include: [
          {
            model: Pokemon,
            as: 'pokemon',
            where: { teamPosition: { [Op.not]: null } },
            required: false
          }
        ],
        order: [['createdAt', 'ASC']]
      });

      res.json({
        characters
      });
    } catch (error) {
      console.error('Erro ao listar personagens:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  },

  // Obter detalhes de um personagem
  async getById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const character = await Character.findOne({
        where: { id, userId },
        include: [
          {
            model: Pokemon,
            as: 'pokemon',
            order: [['teamPosition', 'ASC']]
          }
        ]
      });

      if (!character) {
        return res.status(404).json({
          error: 'Personagem não encontrado'
        });
      }

      res.json({
        character
      });
    } catch (error) {
      console.error('Erro ao obter personagem:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  },

  // Atualizar personagem
  async update(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { name, avatar } = req.body;

      const character = await Character.findOne({
        where: { id, userId }
      });

      if (!character) {
        return res.status(404).json({
          error: 'Personagem não encontrado'
        });
      }

      await character.update({
        name: name || character.name,
        avatar: avatar || character.avatar
      });

      res.json({
        message: 'Personagem atualizado com sucesso',
        character
      });
    } catch (error) {
      console.error('Erro ao atualizar personagem:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  },

  // Adicionar experiência ao personagem
  async addExperience(req, res) {
    try {
      const { id } = req.params;
      const { experience } = req.body;
      const userId = req.user.id;

      const character = await Character.findOne({
        where: { id, userId }
      });

      if (!character) {
        return res.status(404).json({
          error: 'Personagem não encontrado'
        });
      }

      await character.addExperience(experience);

      res.json({
        message: 'Experiência adicionada com sucesso',
        character
      });
    } catch (error) {
      console.error('Erro ao adicionar experiência:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  },

  // Adicionar moedas ao personagem
  async addCoins(req, res) {
    try {
      const { id } = req.params;
      const { coins } = req.body;
      const userId = req.user.id;

      const character = await Character.findOne({
        where: { id, userId }
      });

      if (!character) {
        return res.status(404).json({
          error: 'Personagem não encontrado'
        });
      }

      character.coins += coins;
      await character.save();

      res.json({
        message: 'Moedas adicionadas com sucesso',
        character
      });
    } catch (error) {
      console.error('Erro ao adicionar moedas:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }
};

module.exports = characterController;

