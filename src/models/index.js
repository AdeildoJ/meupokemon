const User = require('./User');
const Character = require('./Character');
const Pokemon = require('./Pokemon');
const EncounterList = require('./EncounterList');
const EncounterPokemon = require('./EncounterPokemon');

// Definir associações
User.hasMany(Character, {
  foreignKey: 'userId',
  as: 'characters'
});

Character.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Character.hasMany(Pokemon, {
  foreignKey: 'characterId',
  as: 'pokemon'
});

Pokemon.belongsTo(Character, {
  foreignKey: 'characterId',
  as: 'character'
});

// Associações para EncounterList e EncounterPokemon
EncounterList.hasMany(EncounterPokemon, {
  foreignKey: 'encounterListId',
  as: 'encounterpokemon'
});

EncounterPokemon.belongsTo(EncounterList, {
  foreignKey: 'encounterListId',
  as: 'encounterList'
});

module.exports = {
  User,
  Character,
  Pokemon,
  EncounterList,
  EncounterPokemon
};
