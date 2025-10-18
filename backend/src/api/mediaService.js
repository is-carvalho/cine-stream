let mediaDB = [
    { id: 1, title: 'Blade Runner 2049', type: 'Movie', year: 2017, rating: 8.0, isFavorite: false },
    { id: 2, title: 'The Witcher', type: 'Series', year: 2019, rating: 8.2, isFavorite: true },
    { id: 3, title: 'Stranger Things', type: 'Series', year: 2016, rating: 8.7, isFavorite: false },
    { id: 4, title: 'Dune: Part One', type: 'Movie', year: 2021, rating: 7.9, isFavorite: false },
];

let reviewsDB = [
    { id: 101, mediaId: 1, user: 'João', rating: 9, comment: 'Visualmente deslumbrante e com ótima profundidade.', timestamp:1760918400000 },
    { id: 102, mediaId: 1, user: 'Maria', rating: 8, comment: 'Sequência digna, mas um pouco longa.', timestamp: 1757784216 },
    { id: 103, mediaId: 2, user: 'Carlos', rating: 7, comment: 'Bom, mas a primeira temporada é melhor.', timestamp: 1754179200 }
];

async function getAllMedia() {
    return mediaDB;
}

async function getMediaById(id) {
    const mediaId = parseInt(id);
    const item = mediaDB.find(m => m.id === mediaId);
    
    if (!item) {
        const error = new Error(`Mídia com ID ${id} não encontrada.`);
        error.status = 404;
        throw error;
    }
    const itemReviews = reviewsDB.filter(r => r.mediaId === mediaId);
    return { data: { ...item, reviews: itemReviews } }; 
}

async function getFavorites() {
    return mediaDB.filter(m => m.isFavorite);
}

async function toggleFavorite(id, state) {
    const mediaId = parseInt(id);
    const item = mediaDB.find(m => m.id === mediaId);

    if (!item) {
        const error = new Error(`Mídia com ID ${id} não encontrada para favoritar.`);
        error.status = 404;
        throw error;
    }

    item.isFavorite = (state === true || state === 'true');
    
    return { data: item, status: 200 };
}
async function addReview(mediaId, reviewData) {
    const media = mediaDB.find(m => m.id === mediaId);
    if (!media) {
        const error = new Error(`Mídia com ID ${mediaId} não encontrada para adicionar resenha.`);
        error.status = 404;
        throw error;
    }

    if (!reviewData.user || !reviewData.rating || !reviewData.comment) {
        const error = new Error('Usuário, nota e comentário são obrigatórios para a resenha.');
        error.status = 400;
        throw error;
    }

    const newReview = {
        id: reviewsDB.length > 0 ? Math.max(...reviewsDB.map(r => r.id)) + 1 : 1,
        mediaId: mediaId,
        user: reviewData.user,
        rating: parseInt(reviewData.rating),
        comment: reviewData.comment,
        timestamp: Date.now()
    };

    reviewsDB.push(newReview);
    return { data: newReview, status: 201 };
}


module.exports = {
  getAllMedia,
  getMediaById,
  getFavorites,
  toggleFavorite,
  addReview,
  __reset: () => {
    mediaDB = [
        { id: 1, title: 'Blade Runner 2049', type: 'Movie', year: 2017, rating: 8.0, isFavorite: false },
        { id: 2, title: 'The Witcher', type: 'Series', year: 2019, rating: 8.2, isFavorite: true },
        { id: 3, title: 'Stranger Things', type: 'Series', year: 2016, rating: 8.7, isFavorite: false },
        { id: 4, title: 'Dune: Part One', type: 'Movie', year: 2021, rating: 7.9, isFavorite: false },
    ];
    reviewsDB = [
        { id: 101, mediaId: 1, user: 'João', rating: 9, comment: 'Visualmente deslumbrante e com ótima profundidade.', timestamp:1760918400000 },
        { id: 102, mediaId: 1, user: 'Maria', rating: 8, comment: 'Sequência digna, mas um pouco longa.', timestamp: 1757784216 },
        { id: 103, mediaId: 2, user: 'Carlos', rating: 7, comment: 'Bom, mas a primeira temporada é melhor.', timestamp: 1754179200 }
    ];
  }
};