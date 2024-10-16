const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController.js');
const auth = require('../middleware/authMiddleware.js');

router.post('/add-place-to-favorite', auth, favoriteController.addPlaceToFavorites);

router.delete('/remove-place-from-favorite/:placeId', auth, favoriteController.removePlaceFromFavorites);

router.get('/get-favorite-places', auth, favoriteController.getFavoritePlaces);

router.post('/add-plan-to-favorite', auth, favoriteController.addPlanToFavorites);

router.delete('/remove-plan-from-favorite/:planId', auth, favoriteController.removePlanFromFavorites);

router.get('/get-favorite-plans', auth, favoriteController.getFavoritePlans);

module.exports = router;
