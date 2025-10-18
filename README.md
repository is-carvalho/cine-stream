# 🎬 CineStream: Sistema de Gerenciamento de Conteúdo e Avaliações

O **CineStream** é uma aplicação web simples desenvolvida para demonstrar a aplicação de conceitos aprendidos na disciplina de engenharia de software (componente curricular da pós-graduação em Desenvolvimento Fullstack), incluindo arquitetura modular, simulação de comunicação com API (mocking) e uma suíte completa de testes: unitários, de aceitação (E2E) e de integração.

A aplicação simula um catálogo de streaming, permitindo que os usuários visualizem detalhes de mídias, gerenciem uma lista de favoritos e submetam avaliações (reviews).

---

## ⚙️ Tecnologias Utilizadas

Este projeto é dividido em duas partes principais:

| Componente | Tecnologias Principais |
| :--- | :--- |
| **Backend (API)** | Node.js, Express, Jest (Unitários, Integração), `mediaService.js` (Mocking de API) |
| **Frontend (Web)** | HTML, CSS, JavaScript (Vanilla), Jest-Cucumber/Puppeteer (Testes E2E) |

---

## 🚀 Requisitos e Estrutura

Este projeto atende aos seguintes requisitos:

1.  **Desenvolvimento de uma aplicação web** simples com Node.js e três telas de interação (`catalog.html`, `details.html`, `favorites.html`).
2.  **Testes de Cobertura:** Aplicação de testes unitários, de aceitação (E2E) e de integração.
3.  **Mocking de Comunicação Externa:** O `mediaService.js` no backend simula a comunicação com um banco de dados ou API externa.

---

## 💾 Instalação e Configuração

Para configurar e rodar o projeto localmente, siga os passos abaixo.

### 1. Clonar o Repositório

```bash
git clone https://github.com/is-carvalho/cine-stream.git
cd cinestream

```

### 2. Instalar Dependências do Backend

Navegue até a pasta backend e instale as dependências.

```bash
cd backend
npm install

```
### 3. Instalar Dependências do Frontend (E2E)

Volte para a raiz do projeto e instale as dependências para o ambiente de testes de aceitação (E2E).

```bash
cd .. # Volta para a raiz do projeto
npm install # Instala jest-cucumber e puppeteer

```
## ▶️ Execução da Aplicação

O CineStream deve ter o backend e o frontend rodando simultaneamente para o fluxo completo.

### 1. Rodar o Backend (API)

Na pasta backend, inicie o servidor Node.js:

```bash
npm start
```

ℹ️ O backend rodará na porta 3001 (ou a porta configurada no app.js).

### 2. Acessar o Frontend

O frontend é composto por arquivos HTML estáticos. Para simular a hospedagem correta e permitir o E2E, você deve servir a pasta frontend em uma porta.

Se você usa uma extensão como "Live Server" no VS Code, abra a pasta frontend e inicie o servidor. Certifique-se de que o frontend está rodando na porta 5500, pois o teste E2E (cinestream.steps.js) está configurado para acessar: http://localhost:5500/frontend.

## 🧪 Comandos de Teste

Execute os testes para garantir a integridade da aplicação.

### 1. Testes Unitários e de Integração (Backend)

Execute os comandos na pasta backend para rodar todos os testes de serviço (media.test.js) e controlador (mediaController.test.js):

```bash
npm test # para os testes unitários
npm run test:coverage # para os testes de integração e cobertura
```

### 2. Testes de Aceitação (E2E)

Execute este comando na pasta raiz do projeto (onde está o cinestream.steps.js) para rodar os testes de interface:

```bash
npm run test:acceptance
```

IMPORTANTE: Para que os testes E2E rodem corretamente, o backend e o frontend devem estar rodando nas portas configuradas (backend: 3001, frontend: 5500).

## 👤 Autor

**Nome Completo**: Raimundo Meliana de Carvalho Filho