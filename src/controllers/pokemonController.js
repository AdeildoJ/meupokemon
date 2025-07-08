const { EncounterList, EncounterPokemon } = require('../models');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

module.exports = {
  // Listar todas as listas de encontro
  async listEncounterLists(req, res) {
    try {
      const lists = await EncounterList.findAll({
        where: { isActive: true },
        attributes: ['id', 'name', 'type', 'subtype', 'maxLevel', 'description']
      });
      
      return res.json(lists);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao listar listas de encontro' });
    }
  },
  
  // Obter detalhes de uma lista de encontro específica
  async getEncounterListDetails(req, res) {
    try {
      const { listId } = req.params;
      
      const list = await EncounterList.findByPk(listId, {
        include: [{
          model: EncounterPokemon,
          as: 'pokemon',
          where: { isActive: true },
          required: false
        }]
      });
      
      if (!list) {
        return res.status(404).json({ error: 'Lista de encontro não encontrada' });
      }
      
      return res.json(list);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao obter detalhes da lista' });
    }
  },
  
  // Adicionar um Pokémon a uma lista de encontro
  async addPokemonToList(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const { listId } = req.params;
      const pokemonData = req.body;

      // Verificar se a lista existe
      const list = await EncounterList.findByPk(listId);
      
      if (!list) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Lista de encontro não encontrada' });
      }

      // Validar nível máximo
      if (pokemonData.level > list.maxLevel) {
        await transaction.rollback();
        return res.status(400).json({ 
          error: `O nível do Pokémon não pode exceder o máximo da lista (${list.maxLevel})` 
        });
      }

      // Validar chance de aparecimento
      if (pokemonData.appearanceChance < 0.01 || pokemonData.appearanceChance > 100) {
        await transaction.rollback();
        return res.status(400).json({ 
          error: 'A chance de aparecimento deve estar entre 0.01% e 100%' 
        });
      }

      // Validar quantidade máxima
      if (pokemonData.maxQuantity !== null && pokemonData.maxQuantity !== undefined && pokemonData.maxQuantity < 0) {
        await transaction.rollback();
        return res.status(400).json({ 
          error: 'A quantidade máxima não pode ser negativa' 
        });
      }

      // Verificar a soma das chances (opcional, pode ser apenas um aviso)
      const existingPokemon = await EncounterPokemon.findAll({
        where: { 
          encounterListId: listId,
          isActive: true
        }
      });
      
      let sumChances = existingPokemon.reduce((sum, pokemon) => sum + Number(pokemon.appearanceChance), 0);
      sumChances += Number(pokemonData.appearanceChance);
      
      // Criar o Pokémon na lista
      const pokemon = await EncounterPokemon.create({
        ...pokemonData,
        encounterListId: listId
      }, { transaction });

      await transaction.commit();

      // Retornar o Pokémon criado junto com informações sobre a soma das chances
      return res.status(201).json({
        pokemon,
        sumChances,
        warning: sumChances < 99 || sumChances > 101 
          ? `A soma das chances é ${sumChances.toFixed(2)}%, o ideal é 100%` 
          : null
      });
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      return res.status(500).json({ error: 'Erro ao adicionar Pokémon à lista' });
    }
  },

  // Atualizar um Pokémon em uma lista
  async updatePokemon(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const { pokemonId } = req.params;
      const updateData = req.body;

      // Verificar se o Pokémon existe
      const pokemon = await EncounterPokemon.findByPk(pokemonId, {
        include: [{ model: EncounterList, as: 'list' }]
      });

      if (!pokemon) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Pokémon não encontrado' });
      }

      // Validar nível máximo
      if (updateData.level && updateData.level > pokemon.list.maxLevel) {
        await transaction.rollback();
        return res.status(400).json({ 
          error: `O nível do Pokémon não pode exceder o máximo da lista (${pokemon.list.maxLevel})` 
        });
      }

      // Validar chance de aparecimento
      if (updateData.appearanceChance && (updateData.appearanceChance < 0.01 || updateData.appearanceChance > 100)) {
        await transaction.rollback();
        return res.status(400).json({ 
          error: 'A chance de aparecimento deve estar entre 0.01% e 100%' 
        });
      }

      // Validar quantidade máxima
      if (updateData.maxQuantity !== undefined && updateData.maxQuantity !== null && updateData.maxQuantity < 0) {
        await transaction.rollback();
        return res.status(400).json({ 
          error: 'A quantidade máxima não pode ser negativa' 
        });
      }

      // Verificar a soma das chances (opcional, pode ser apenas um aviso)
      const existingPokemon = await EncounterPokemon.findAll({
        where: { 
          encounterListId: pokemon.encounterListId,
          isActive: true,
          id: { [Op.ne]: pokemonId }
        }
      });
      
      let sumChances = existingPokemon.reduce((sum, p) => sum + Number(p.appearanceChance), 0);
      sumChances += Number(updateData.appearanceChance || pokemon.appearanceChance);

      // Atualizar o Pokémon
      await pokemon.update(updateData, { transaction });

      await transaction.commit();

      // Retornar o Pokémon atualizado junto com informações sobre a soma das chances
      return res.json({
        pokemon,
        sumChances,
        warning: sumChances < 99 || sumChances > 101 
          ? `A soma das chances é ${sumChances.toFixed(2)}%, o ideal é 100%` 
          : null
      });
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar Pokémon' });
    }
  },

  // Remover um Pokémon de uma lista
  async removePokemon(req, res) {
    try {
      const { pokemonId } = req.params;

      // Verificar se o Pokémon existe
      const pokemon = await EncounterPokemon.findByPk(pokemonId);

      if (!pokemon) {
        return res.status(404).json({ error: 'Pokémon não encontrado' });
      }

      // Marcar como inativo em vez de excluir fisicamente
      await pokemon.update({ isActive: false });

      return res.json({ message: 'Pokémon removido com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao remover Pokémon' });
    }
  },

  // Reabastecer um Pokémon
  async restockPokemon(req, res) {
    try {
      const { pokemonId } = req.params;
      const { quantity } = req.body;

      // Verificar se o Pokémon existe
      const pokemon = await EncounterPokemon.findByPk(pokemonId);

      if (!pokemon) {
        return res.status(404).json({ error: 'Pokémon não encontrado' });
      }

      // Verificar se o Pokémon tem quantidade limitada
      if (pokemon.maxQuantity === null) {
        return res.status(400).json({ error: 'Este Pokémon tem quantidade ilimitada' });
      }

      // Validar quantidade
      if (quantity < 0) {
        return res.status(400).json({ error: 'A quantidade não pode ser negativa' });
      }

      if (quantity > pokemon.maxQuantity) {
        return res.status(400).json({ 
          error: `A quantidade não pode exceder o máximo (${pokemon.maxQuantity})` 
        });
      }

      // Atualizar a quantidade atual
      await pokemon.update({ currentQuantity: quantity });

      return res.json({ 
        message: 'Pokémon reabastecido com sucesso',
        pokemon
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao reabastecer Pokémon' });
    }
  },

  // Normalizar as chances de uma lista para somar 100%
  async normalizeChances(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const { listId } = req.params;

      // Verificar se a lista existe
      const list = await EncounterList.findByPk(listId);
      
      if (!list) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Lista de encontro não encontrada' });
      }

      // Buscar todos os Pokémon ativos na lista
      const pokemon = await EncounterPokemon.findAll({
        where: { 
          encounterListId: listId,
          isActive: true
        }
      });

      if (pokemon.length === 0) {
        await transaction.rollback();
        return res.status(400).json({ error: 'Não há Pokémon na lista para normalizar' });
      }

      // Calcular a soma atual das chances
      const sumChances = pokemon.reduce((sum, p) => sum + Number(p.appearanceChance), 0);
      
      if (sumChances === 0) {
        await transaction.rollback();
        return res.status(400).json({ error: 'A soma das chances é zero, não é possível normalizar' });
      }

      // Normalizar as chances para somar 100%
      for (const p of pokemon) {
        const normalizedChance = (Number(p.appearanceChance) / sumChances) * 100;
        await p.update({ appearanceChance: normalizedChance.toFixed(2) }, { transaction });
      }

      await transaction.commit();

      return res.json({ 
        message: 'Chances normalizadas com sucesso',
        pokemon
      });
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      return res.status(500).json({ error: 'Erro ao normalizar chances' });
    }
  }
};
