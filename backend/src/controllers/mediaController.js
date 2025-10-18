const mediaService = require('../api/mediaService');

exports.listAll = async (req, res) => {
    try {
        const media = await mediaService.getAllMedia();
        res.status(200).json(media);
    } catch (error) {
        res.status(500).json({ error: 'Falha ao buscar catálogo.' });
    }
};

exports.getDetails = async (req, res) => {
    try {
        const result = await mediaService.getMediaById(req.params.id);
        res.status(200).json(result.data);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};

exports.listFavorites = async (req, res) => {
    try {
        const favorites = await mediaService.getFavorites();
        res.status(200).json(favorites);
    } catch (error) {
        res.status(500).json({ error: 'Falha ao buscar favoritos.' });
    }
};

exports.handleFavoriteToggle = async (req, res) => {
    const { state } = req.body; 
    try {
        const result = await mediaService.toggleFavorite(req.params.id, state);
        res.status(result.status).json(result.data);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};

exports.addReviewToMedia = async (req, res) => {
    const { user, rating, comment } = req.body;
    const mediaId = parseInt(req.params.id);
    try {
        const result = await mediaService.addReview(mediaId, { user, rating, comment });
        res.status(result.status).json(result.data);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};