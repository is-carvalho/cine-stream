const mediaService = require('../src/api/mediaService'); 

describe('Testes Unitários da Lógica de Negócios', () => {
    
    // Antes de cada teste, reseta o estado dos dados mockados
    beforeEach(() => {
        mediaService.__reset(); 
    });

    // Testes de Leitura

    describe('GET Operations', () => {
        test('deve retornar todos os 4 itens de mídia no catálogo', async () => {
            const media = await mediaService.getAllMedia();
            expect(media).toHaveLength(4);
        });

        test('getMediaById: deve incluir reviews associadas à mídia (ID 1)', async () => {
            const result = await mediaService.getMediaById(1); // Blade Runner
            expect(result.data.reviews).toHaveLength(2); 
        });

        test('getMediaById: deve lançar 404 se a mídia não for encontrada', async () => {
            await expect(mediaService.getMediaById(999)).rejects.toMatchObject({
                message: 'Mídia com ID 999 não encontrada.',
                status: 404
            });
        });
    });

    // Testes de Favoritos
    
    describe('Favorite Toggle (toggleFavorite e getFavorites)', () => {
        
        test('toggleFavorite: deve marcar quando o state é string "true"', async () => {
            // Blade Runner (ID 1) começa como false
            const result = await mediaService.toggleFavorite(1, 'true'); 
            expect(result.data.isFavorite).toBe(true);
        });
        
        test('toggleFavorite: deve desmarcar quando o state é booleano false', async () => {
            // The Witcher (ID 2) começa como favorito (true)
            const result = await mediaService.toggleFavorite(2, false); 
            expect(result.data.isFavorite).toBe(false);
            const updatedFavorites = await mediaService.getFavorites();
            expect(updatedFavorites).toHaveLength(0);
        });

        test('toggleFavorite: deve desmarcar quando o state é string "false"', async () => {
            const result = await mediaService.toggleFavorite(2, 'false'); 
            expect(result.data.isFavorite).toBe(false);
        });

        test('toggleFavorite: deve lançar 404 ao tentar favoritar mídia inexistente', async () => {
            await expect(mediaService.toggleFavorite(999, true)).rejects.toMatchObject({
                status: 404
            });
        });
    });

    // Testes de Resenhas
    
    describe('Review Operations', () => {
        
        test('addReview: deve adicionar uma nova resenha e retornar status 201', async () => {
            const reviewData = { user: 'Novo Usuário', rating: 10, comment: 'Ótimo filme.' };
            const result = await mediaService.addReview(4, reviewData); // Adiciona a Dune
            
            expect(result.status).toBe(201);
            expect(result.data).toHaveProperty('timestamp');
            expect(result.data.id).toBe(104);
        });
        
       

        // Testes de Erro 404
        
        test('addReview: deve lançar 404 se a mídia não for encontrada para adicionar resenha', async () => {
            const inexistenteId = 999; 
            const reviewData = { user: 'Test', rating: 10, comment: 'Valid comment' };
            
            await expect(mediaService.addReview(inexistenteId, reviewData)).rejects.toMatchObject({
                message: `Mídia com ID ${inexistenteId} não encontrada para adicionar resenha.`,
                status: 404
            });
        });

        // Testes de Erro 400

        const expectedError = {
            message: 'Usuário, nota e comentário são obrigatórios para a resenha.',
            status: 400
        };

        test('addReview: deve lançar 400 se faltar o campo "rating" (cobertura de branch)', async () => {
            const incompleteData = { user: 'Test', comment: 'Teste', rating: null }; 
            await expect(mediaService.addReview(1, incompleteData)).rejects.toMatchObject(expectedError);
        });

        test('addReview: deve lançar 400 se faltar o campo "user" (cobertura de branch)', async () => {
            const incompleteData = { user: null, rating: 10, comment: 'Teste' }; 
            await expect(mediaService.addReview(1, incompleteData)).rejects.toMatchObject(expectedError);
        });

        test('addReview: deve lançar 400 se faltar o campo "comment" (cobertura de branch)', async () => {
            const incompleteData = { user: 'Test', rating: 10, comment: null }; 
            await expect(mediaService.addReview(1, incompleteData)).rejects.toMatchObject(expectedError);
        });
    });
});