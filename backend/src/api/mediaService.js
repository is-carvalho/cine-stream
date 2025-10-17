let mediaDB = [
    { id: 1, title: 'Blade Runner 2049', type: 'Movie', year: 2017, rating: 8.0, isFavorite: false },
    { id: 2, title: 'The Witcher', type: 'Series', year: 2019, rating: 8.2, isFavorite: true },
    { id: 3, title: 'Stranger Things', type: 'Series', year: 2016, rating: 8.7, isFavorite: false },
    { id: 4, title: 'Dune: Part One', type: 'Movie', year: 2021, rating: 7.9, isFavorite: false },
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
    return { data: item }; 
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

module.exports = {
  getAllMedia,
  getMediaById,
  getFavorites,
  toggleFavorite,
  __reset: () => {
    mediaDB = [
        { id: 1, title: 'Blade Runner 2049', type: 'Movie', year: 2017, rating: 8.0, isFavorite: false },
        { id: 2, title: 'The Witcher', type: 'Series', year: 2019, rating: 8.2, isFavorite: true },
        { id: 3, title: 'Stranger Things', type: 'Series', year: 2016, rating: 8.7, isFavorite: false },
        { id: 4, title: 'Dune: Part One', type: 'Movie', year: 2021, rating: 7.9, isFavorite: false },
    ];
  }
};