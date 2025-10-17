const express = require('express');
const routes = require('./src/routes/api');
const cors = require('cors');

const app = express();
    
app.use(cors()); 

app.use(express.json()); 

app.use('/api', routes); 

app.use((req, res, next) => {
    res.status(404).json({
        error: 'Recurso da API não encontrado.',
        path: req.originalUrl
    });
});
    
const PORT = process.env.PORT || 3001;

// Apenas inicia o servidor se não estiver em ambiente de teste
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`API do CineStream rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;