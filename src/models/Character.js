const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Character = sequelize.define('Character', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 30]
    }
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 10,
      max: 99
    }
  },
  class: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Treinador', 'Criador', 'Coordenador', 'Pesquisador', 'Ranger']]
    }
  },
  origin: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50]
    }
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Masculino', 'Feminino', 'Outro']]
    }
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  starterPokemonId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  starterPokemonName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  starterIsShiny: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
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
  coins: {
    type: DataTypes.INTEGER,
    defaultValue: 1000,
    validate: {
      min: 0
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'characters',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['name']
    }
  ]
});

// Método para calcular experiência necessária para próximo nível
Character.prototype.getExpForNextLevel = function() {
  return Math.floor(100 * Math.pow(this.level, 1.5));
};

// Método para verificar se pode subir de nível
Character.prototype.canLevelUp = function() {
  return this.experience >= this.getExpForNextLevel();
};

// Método para subir de nível
Character.prototype.levelUp = function() {
  if (this.canLevelUp() && this.level < 100) {
    this.level += 1;
    this.experience -= this.getExpForNextLevel();
    return this.save();
  }
  return false;
};

// Método para adicionar experiência
Character.prototype.addExperience = function(exp) {
  this.experience += exp;
  while (this.canLevelUp() && this.level < 100) {
    this.levelUp();
  }
  return this.save();
};

module.exports = Character;

