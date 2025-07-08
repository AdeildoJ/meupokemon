const express = require('express');
const characterController = require('../controllers/characterController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Todas as rotas de personagem requerem autenticação
router.use(authMiddleware);

// Rotas de personagens
router.post('/', characterController.create);
router.get('/', characterController.list);
router.get('/:id', characterController.getById);
router.put('/:id', characterController.update);
router.post('/:id/experience', characterController.addExperience);
router.post('/:id/coins', characterController.addCoins);

module.exports = router;

