const mediaService = require('../src/api/mediaService'); 
jest.mock('../src/api/mediaService'); 

const mediaController = require('../src/controllers/mediaController'); 

describe('Teste de Integração (Controller/Service)', () => {

    let mockReq;
    let mockRes;
    let mockStatus;
    let mockJson;

    beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn(() => ({ json: mockJson })); 
    mockRes = { status: mockStatus, json: mockJson };
    mockReq = { params: {}, body: {} };
    jest.clearAllMocks();
    });


    test('listAll: deve retornar 200 e o catálogo no sucesso', async () => {
        const mockMedia = [{ id: 1, title: 'Test' }];
        mediaService.getAllMedia.mockResolvedValue(mockMedia);

        await mediaController.listAll(mockReq, mockRes);

        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(mockMedia); 
    });

    test('getDetails: deve retornar 200 e os detalhes da mídia no sucesso', async () => {
        const mockDetails = { id: 1, title: 'Detail Test', reviews: [] };
        mediaService.getMediaById.mockResolvedValue({ data: mockDetails }); // Retorna o objeto esperado

        mockReq.params.id = '1';
        await mediaController.getDetails(mockReq, mockRes);

        expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(mockDetails); 
    });

    test('listFavorites: deve retornar 200 e a lista de favoritos no sucesso', async () => {
        const mockFavorites = [{ id: 2, title: 'Favorite' }];
        mediaService.getFavorites.mockResolvedValue(mockFavorites);

        await mediaController.listFavorites(mockReq, mockRes);

        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(mockFavorites); 
    });

    test('handleFavoriteToggle: deve retornar o status (200) e os dados atualizados no sucesso', async () => {
        const mockResult = { id: 1, isFavorite: true };
        mediaService.toggleFavorite.mockResolvedValue({ data: mockResult, status: 200 });

        mockReq.params.id = '1';
        mockReq.body = { state: true };
        await mediaController.handleFavoriteToggle(mockReq, mockRes);

        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(mockResult); 
    });
    
    // Testes de Erro 500

    test('listAll: deve retornar 500 se o Service falhar (erro inesperado)', async () => {
        mediaService.getAllMedia.mockRejectedValue(new Error('DB connection failed'));

        await mediaController.listAll(mockReq, mockRes);

        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({ error: 'Falha ao buscar catálogo.' });
    });

    test('getDetails: deve retornar 500 se o Service falhar inesperadamente', async () => {
        mediaService.getMediaById.mockRejectedValue(new Error('Internal Service Failure'));
        mockReq.params.id = '1';
        
        await mediaController.getDetails(mockReq, mockRes);

        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({ error: 'Internal Service Failure' });
    });

    test('listFavorites: deve retornar 500 se o Service falhar', async () => {
        mediaService.getFavorites.mockRejectedValue(new Error('DB read error'));
        
        await mediaController.listFavorites(mockReq, mockRes);

        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({ error: 'Falha ao buscar favoritos.' });
    });
    
    test('handleFavoriteToggle: deve retornar 500 se o Service falhar inesperadamente', async () => {
        mediaService.toggleFavorite.mockRejectedValue(new Error('Update failed'));
        mockReq.params.id = '1';
        mockReq.body = { state: true };
        
        await mediaController.handleFavoriteToggle(mockReq, mockRes);

        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({ error: 'Update failed' });
    });

    test('addReviewToMedia: deve retornar 500 se o Service falhar inesperadamente', async () => {
        mediaService.addReview.mockRejectedValue(new Error('DB write error'));
        mockReq.params.id = '1';
        mockReq.body = { user: 'Valid', rating: 10, comment: 'Data' };

        await mediaController.addReviewToMedia(mockReq, mockRes);

        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({ error: 'DB write error' });
    });

    test('addReviewToMedia: deve retornar 400 se Service rejeitar por validação', async () => {
        const mockError = { message: 'Usuário, nota e comentário são obrigatórios para a resenha.', status: 400 };
        mediaService.addReview.mockRejectedValue(mockError);
        
        mockReq.params.id = '1';
        mockReq.body = { user: 'User' }; // Faltando dados

        await mediaController.addReviewToMedia(mockReq, mockRes);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({ error: mockError.message });
    });

    test('addReviewToMedia: deve chamar addReview e retornar 201 no sucesso', async () => {
        const mockReview = { id: 200, user: 'UserTest', rating: 10 };
        mediaService.addReview.mockResolvedValue({ data: mockReview, status: 201 });
        
        mockReq.params.id = '1';
        mockReq.body = { user: 'User', rating: 10, comment: 'Test' };

        await mediaController.addReviewToMedia(mockReq, mockRes);

        expect(mediaService.addReview).toHaveBeenCalledWith(1, expect.objectContaining({ user: 'User' }));
        expect(mockStatus).toHaveBeenCalledWith(201);
        expect(mockJson).toHaveBeenCalledWith(mockReview);
    });
});