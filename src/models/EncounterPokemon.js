const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const EncounterList = require('./EncounterList');

const EncounterPokemon = sequelize.define('EncounterPokemon', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  encounterListId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: EncounterList,
      key: 'id'
    }
  },
  pokemonSpecies: {
    type: DataTypes.STRING,
    allowNull: false
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  // Campo para chance percentual personalizada
  appearanceChance: {
    type: DataTypes.DECIMAL(5, 2), // Permite valores de 0.01 a 100.00
    allowNull: false,
    defaultValue: 5.00, // 5% como padrão
    validate: {
      min: 0.01,
      max: 100.00
    }
  },
  // Campos para controle de quantidade
  maxQuantity: {
    type: DataTypes.INTEGER,
    allowNull: true, // NULL significa ilimitado
    validate: {
      min: 0 // 0 significa indisponível
    }
  },
  currentQuantity: {
    type: DataTypes.INTEGER,
    allowNull: true, // NULL significa ilimitado
    validate: {
      min: 0
    }
  },
  // Campos para atributos do Pokémon
  ivHp: {
    type: DataTypes.INTEGER,
    validate: { min: 0, max: 31 }
  },
  ivAttack: {
    type: DataTypes.INTEGER,
    validate: { min: 0, max: 31 }
  },
  ivDefense: {
    type: DataTypes.INTEGER,
    validate: { min: 0, max: 31 }
  },
  ivSpAttack: {
    type: DataTypes.INTEGER,
    validate: { min: 0, max: 31 }
  },
  ivSpDefense: {
    type: DataTypes.INTEGER,
    validate: { min: 0, max: 31 }
  },
  ivSpeed: {
    type: DataTypes.INTEGER,
    validate: { min: 0, max: 31 }
  },
  nature: {
    type: DataTypes.STRING
  },
  ability: {
    type: DataTypes.STRING
  },
  move1: {
    type: DataTypes.STRING,
    allowNull: false
  },
  move2: {
    type: DataTypes.STRING
  },
  move3: {
    type: DataTypes.STRING
  },
  move4: {
    type: DataTypes.STRING
  },
  heldItem: {
    type: DataTypes.STRING
  },
  isLegendary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'encounter_pokemon',
  hooks: {
    // Hook para garantir que currentQuantity seja igual a maxQuantity na criação
    beforeCreate: (pokemon) => {
      if (pokemon.maxQuantity !== null && pokemon.maxQuantity !== undefined) {
        pokemon.currentQuantity = pokemon.maxQuantity;
      } else {
        pokemon.currentQuantity = null; // Ilimitado
      }
    },
    // Hook para atualizar currentQuantity quando maxQuantity mudar
    beforeUpdate: (pokemon) => {
      // Se maxQuantity foi alterado para um valor maior que currentQuantity
      if (pokemon.changed('maxQuantity') && 
          pokemon.maxQuantity !== null && 
          (pokemon.currentQuantity === null || pokemon.maxQuantity > pokemon.currentQuantity)) {
        pokemon.currentQuantity = pokemon.maxQuantity;
      }
      
      // Se maxQuantity foi alterado para null (ilimitado)
      if (pokemon.changed('maxQuantity') && pokemon.maxQuantity === null) {
        pokemon.currentQuantity = null;
      }
    }
  }
});

// Definir relacionamento
EncounterList.hasMany(EncounterPokemon, { 
  foreignKey: 'encounterListId',
  as: 'pokemon'
});
EncounterPokemon.belongsTo(EncounterList, { 
  foreignKey: 'encounterListId',
  as: 'list'
});

module.exports = EncounterPokemon;
