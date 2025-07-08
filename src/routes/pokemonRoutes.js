const express = require('express');
const pokemonController = require('../controllers/pokemonController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Rotas para listas de encontro
router.get('/lists', pokemonController.listEncounterLists);
router.get('/lists/:listId', pokemonController.getEncounterListDetails);

// Rotas para Pokémon em listas
router.post('/lists/:listId/pokemon', pokemonController.addPokemonToList);
router.put('/pokemon/:pokemonId', pokemonController.updatePokemon);
router.delete('/pokemon/:pokemonId', pokemonController.removePokemon);

// Rotas para gerenciamento de quantidade e chances
router.put('/pokemon/:pokemonId/restock', pokemonController.restockPokemon);
router.put('/lists/:listId/normalize-chances', pokemonController.normalizeChances);

module.exports = router;
