const express = require('express');
const mediaController = require('../controllers/mediaController');
const router = express.Router();
    
router.use(express.json()); 

router.get('/media', mediaController.listAll);
router.get('/media/:id', mediaController.getDetails);
router.post('/media/:id/favorite', mediaController.handleFavoriteToggle);
router.get('/favorites', mediaController.listFavorites);

router.post('/media/:id/review', mediaController.addReviewToMedia); 

module.exports = router;