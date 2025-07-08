const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EncounterList = sequelize.define('EncounterList', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['pokeball', 'fishing_rod']]
    }
  },
  subtype: {
    type: DataTypes.STRING,
    allowNull: false
  },
  maxLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 100
    }
  },
  description: {
    type: DataTypes.TEXT
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'encounter_lists'
});

module.exports = EncounterList;
