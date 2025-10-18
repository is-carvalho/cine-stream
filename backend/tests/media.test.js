const mediaService = require('../src/api/mediaService'); 

describe('Testes Unitários da Lógica de Negócios', () => {
    
    beforeEach(() => {
        mediaService.__reset(); 
    });

    test('deve retornar todos os 4 itens de mídia no catálogo', async () => {
        const media = await mediaService.getAllMedia();
        expect(media).toHaveLength(4);
    });

    test('getMediaById: deve lançar 404 se a mídia não for encontrada', async () => {
        await expect(mediaService.getMediaById(12345)).rejects.toMatchObject({
            message: 'Mídia com ID 12345 não encontrada.',
            status: 404
        });
    });

    test('toggleFavorite: deve desmarcar um item que já é favorito', async () => {
        // The Witcher (ID 2) começa como favorito (true)
        const result = await mediaService.toggleFavorite(2, false); 
        expect(result.data.isFavorite).toBe(false);
        const updatedFavorites = await mediaService.getFavorites();
        expect(updatedFavorites).toHaveLength(0); // Não deve haver mais favoritos
    });
    
    test('toggleFavorite: deve lançar 404 ao tentar favoritar mídia inexistente', async () => {
        await expect(mediaService.toggleFavorite(12345, true)).rejects.toMatchObject({
            status: 404
        });
    });

    // Reviews

    test('getMediaById: deve incluir reviews associadas à mídia (ID 1)', async () => {
        const result = await mediaService.getMediaById(1); // Blade Runner
        expect(result.data.reviews).toHaveLength(2); 
    });

    test('addReview: deve adicionar uma nova resenha e verificar o timestamp', async () => {
        const reviewData = { user: 'Novo Usuário', rating: 10, comment: 'Ótimo filme.' };
        const result = await mediaService.addReview(4, reviewData); // Adiciona a Dune
        
        expect(result.status).toBe(201);
        expect(result.data).toHaveProperty('timestamp');
        // Verifica se o ID foi incrementado (deve ser 104)
        expect(result.data.id).toBe(104);
    });

    test('addReview: deve lançar 400 se faltar o campo "rating"', async () => {
        const incompleteData = { user: 'Test', comment: 'Teste', rating: null }; 
        
        await expect(mediaService.addReview(1, incompleteData)).rejects.toMatchObject({
            message: 'Usuário, nota e comentário são obrigatórios para a resenha.',
            status: 400
        });
    });
});