const mediaService = require('../src/api/mediaService'); 
jest.mock('../src/api/mediaService'); 

const mediaController = require('../src/controllers/mediaController'); 

describe('Teste de Integração (Controller/Service)', () => {
    
    let mockReq;
    let mockRes;
    let mockStatus;
    let mockJson;

    beforeEach(() => {
        // Mock dos objetos Request e Response do Express
        mockJson = jest.fn();
        mockStatus = jest.fn(() => ({ json: mockJson })); 
        mockRes = { status: mockStatus, json: mockJson };
        mockReq = { params: {}, body: {} };
        jest.clearAllMocks();
    });
    
    // Testes de Leitura
    
    test('listAll: deve retornar 500 se o Service falhar', async () => {
        mediaService.getAllMedia.mockRejectedValue(new Error('DB connection failed'));

        await mediaController.listAll(mockReq, mockRes);

        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({ error: 'Falha ao buscar catálogo.' });
    });

    // Testes de Reviews => POST /media/:id/review

    test('addReviewToMedia: deve chamar addReview e retornar 201 no sucesso', async () => {
        const mockReview = { id: 200, user: 'UserTest', rating: 10 };
        mediaService.addReview.mockResolvedValue({ data: mockReview, status: 201 });
        
        mockReq.params.id = '1';
        mockReq.body = { user: 'User', rating: 10, comment: 'Test' };

        await mediaController.addReviewToMedia(mockReq, mockRes);

        // Verifica a conversão de string para número do id no Controller
        expect(mediaService.addReview).toHaveBeenCalledWith(
            1, 
            expect.objectContaining({ user: 'User' })
        );
        expect(mockStatus).toHaveBeenCalledWith(201);
        expect(mockJson).toHaveBeenCalledWith(mockReview);
    });

    test('addReviewToMedia: deve retornar 400 se Service rejeitar por validação', async () => {
        const mockError = { 
            message: 'Usuário, nota e comentário são obrigatórios para a resenha.', 
            status: 400 
        };
        mediaService.addReview.mockRejectedValue(mockError);
        
        mockReq.params.id = '1';
        mockReq.body = { user: 'User' }; // Faltando dados

        await mediaController.addReviewToMedia(mockReq, mockRes);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({ error: mockError.message });
    });
    
    // Testes de Favoritos => POST /media/:id/favorite
    
    test('handleFavoriteToggle: deve retornar 404 se Service rejeitar por ID de mídia inexistente', async () => {
        const mockError = { message: 'Mídia não existe.', status: 404 };
        mediaService.toggleFavorite.mockRejectedValue(mockError);
        
        mockReq.params.id = '999';
        mockReq.body = { state: true };

        await mediaController.handleFavoriteToggle(mockReq, mockRes);

        expect(mockStatus).toHaveBeenCalledWith(404);
        expect(mockJson).toHaveBeenCalledWith({ error: mockError.message });
    });
});