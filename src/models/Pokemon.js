const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Pokemon = sequelize.define('Pokemon', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  characterId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'characters',
      key: 'id'
    }
  },
  pokemonId: {
    type: DataTypes.INTEGER,
    allowNull: false // ID do Pokémon na PokéAPI
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nickname: {
    type: DataTypes.STRING,
    allowNull: true
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
    validate: {
      min: 1,
      max: 100
    }
  },
  experience: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  isShiny: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isIn: [['M', 'F', null]]
    }
  },
  nature: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ability: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Estatísticas base
  hp: {
    type: DataTypes.INTEGER,
    defaultValue: 20
  },
  attack: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  defense: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  specialAttack: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  specialDefense: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  speed: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  // Status
  currentHp: {
    type: DataTypes.INTEGER,
    defaultValue: 20
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'healthy',
    validate: {
      isIn: [['healthy', 'poisoned', 'burned', 'paralyzed', 'sleeping', 'frozen', 'fainted']]
    }
  },
  // Posição na equipe (1-6, null se não estiver na equipe ativa)
  teamPosition: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 6
    }
  },
  // Movimentos (JSON array)
  moves: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  // Data de captura
  caughtAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  // Local de captura
  caughtLocation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Pokébola usada
  pokeball: {
    type: DataTypes.STRING,
    defaultValue: 'pokeball'
  }
}, {
  tableName: 'pokemon',
  indexes: [
    {
      fields: ['character_id']
    },
    {
      fields: ['pokemon_id']
    },
    {
      fields: ['team_position']
    }
  ]
});

// Método para calcular HP máximo baseado no nível
Pokemon.prototype.getMaxHp = function() {
  return Math.floor(((2 * this.hp + 31) * this.level) / 100) + this.level + 10;
};

// Método para curar completamente
Pokemon.prototype.heal = function() {
  this.currentHp = this.getMaxHp();
  this.status = 'healthy';
  return this.save();
};

// Método para verificar se está desmaiado
Pokemon.prototype.isFainted = function() {
  return this.currentHp <= 0 || this.status === 'fainted';
};

// Método para adicionar à equipe
Pokemon.prototype.addToTeam = function(position) {
  if (position >= 1 && position <= 6) {
    this.teamPosition = position;
    return this.save();
  }
  return false;
};

// Método para remover da equipe
Pokemon.prototype.removeFromTeam = function() {
  this.teamPosition = null;
  return this.save();
};

module.exports = Pokemon;

