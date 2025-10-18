const { defineFeature, loadFeature } = require("jest-cucumber");
const path = require("path");
const puppeteer = require("puppeteer");

const BASE_URL = 'http://127.0.0.1:5500/frontend'; 
const mediaService = require('../../backend/src/api/mediaService'); 

const feature = loadFeature(path.join(__dirname, "../features/cinestream.feature"));


// Função auxiliar para esperar o carregamento da lista de mídias
async function waitForMediaLoad(page, listSelector) {
    await page.waitForSelector(listSelector + ' li', { visible: true });
    // Espera que a mensagem de 'Carregando' suma
    await page.waitForFunction((selector) => {
        const firstItem = document.querySelector(selector + ' li');
        return !firstItem || !firstItem.textContent.includes('Carregando');
    }, { polling: 'mutation' }, listSelector);
}

defineFeature(feature, (test) => {
    let browser, page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: false, 
            slowMo: 50,
        });
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        // Reseta o estado do mediaService antes de cada cenário
        mediaService.__reset(); 
        page = await browser.newPage();
    });

    afterEach(async () => {
        await page.close();
    });

    const givenUserOnCatalog = (given) => {
        given("que o usuário acessa a página do Catálogo Principal", async () => {
            await page.goto(`${BASE_URL}/catalog.html`);
            await waitForMediaLoad(page, '#media-list');
            const title = await page.title();
            expect(title).toBe("CineStream");
        });
    };

    const whenUserClicksTitle = (when) => {
        when(/^o usuário clica no título "(.*)"$/, async (title) => {

            console.log("aqui foi")
            await page.click(`a[data-title="${title}"]`);
            // await page.waitForNavigation({ waitUntil: 'networkidle0' });
        });
    };

    const thenRedirectedToDetails = (then) => {
        then(/^ele deve ser redirecionado para a página de detalhes do título "(.*)"$/, async (title) => {
            await page.waitForSelector('#media-title', { visible: true });
            const pageTitle = await page.$eval('#media-title', el => el.textContent);
            expect(pageTitle).toBe(title);
        });
    };

    const givenUserOnDetailsPage = (given) => {
        given(/^que o usuário está na página de detalhes do título "(.*)" \(id (\d+)\)$/, async (title, id) => {
            await page.goto(`${BASE_URL}/details.html?id=${id}`);
            await page.waitForSelector('#media-title', { visible: true });
            const pageTitle = await page.$eval('#media-title', el => el.textContent);
            expect(pageTitle).toBe(title);
        });
    };

    const andButtonStateIs = (and) => {
        and(/^o estado do botão de favorito deve ser "(.*)"$/, async (expectedText) => {
            await page.waitForSelector('#favorite-button', { visible: true });
            const buttonText = await page.$eval('#favorite-button', el => el.textContent.trim());
            expect(buttonText).toBe(expectedText);
        });
    };

    const whenUserClicksButton = (when) => {
        when(/^o usuário clica no botão "(.*)"$/, async (buttonText) => {
            const currentButtonText = await page.$eval('#favorite-button', el => el.textContent.trim());
            expect(currentButtonText).toBe(buttonText);
            await page.click('#favorite-button');
        });
    };

    const thenButtonStateChanges = (then) => {
        then(/^o estado do botão de favorito deve mudar para "(.*)"$/, async (expectedText) => {
            await page.waitForFunction((text) => {
                return document.querySelector('#favorite-button').textContent.trim() === text;
            }, {}, expectedText);
            const newButtonText = await page.$eval('#favorite-button', el => el.textContent.trim());
            expect(newButtonText).toBe(expectedText);
        });
    };

    const andMessageIsDisplayed = (and) => {
        and(/^a mensagem "(.*)" deve ser exibida$/, async (expectedMessage) => {
            await page.waitForSelector('#message-box', { visible: true });
            const message = await page.$eval('#message-box', el => el.textContent.trim());
            expect(message).toBe(expectedMessage);
        });
    };

    // Cenário: Visualização do Catálogo e Detalhes
    test("Visualização do Catálogo e Detalhes", ({ given, then, when, and }) => {
        givenUserOnCatalog(given);

        then(/^o catálogo deve exibir (\d+) títulos$/, async (expectedCount) => {
            const mediaCount = await page.$$eval('#media-list li', elements => elements.length);
            expect(mediaCount).toBe(Number(expectedCount));
        });

        and(/^deve mostrar o título "(.*)"$/, async (title) => {
            console.log("teste 1")

            const titleElement = await page.$(`a[data-title="${title}"]`);
            console.log(titleElement)
            expect(titleElement).not.toBeNull();
            
        });

        whenUserClicksTitle(when);

        thenRedirectedToDetails(then);

        and(/^a nota de avaliação exibida deve ser "(.*)"$/, async (expectedRating) => {
            const ratingText = await page.$eval('#media-details', el => el.textContent);
            expect(ratingText).toContain(`Rating: ${expectedRating}`);
        });

        and(/^a seção de avaliações deve indicar que "(.*)"$/, async (expectedMessage) => {
            const reviewListText = await page.$eval('#reviews-list', el => el.textContent.trim());
            expect(reviewListText).toBe(expectedMessage);
        });
    }, 150000);

    // Cenário: Adicionar e Remover Favorito
    test("Adicionar e Remover Favorito", ({ given, when, then, and }) => {

        givenUserOnDetailsPage(given);

        andButtonStateIs(and);

        whenUserClicksButton(when);

        thenButtonStateChanges(then);

        andMessageIsDisplayed(and);

        whenUserClicksButton(when);

        thenButtonStateChanges(then);

        andMessageIsDisplayed(and);

    },150000);

    // Cenário: Adicionar uma Nova Avaliação
    test("Adicionar uma Nova Avaliação", ({ given, when, then, and }) => {
                
        givenUserOnDetailsPage(given);

        and(/^deve existir (\d+) avaliações cadastradas$/, async (expectedCount) => {
            // Espera carregar a lista de reviews
            await page.waitForSelector('#reviews-list', { visible: true });
            
            // Filtra o parágrafo de mensagem de "Nenhuma avaliação" para contar apenas reviews
            const reviewsCount = await page.$$eval('#reviews-list > .review-item', elements => elements.length);
            expect(reviewsCount).toBe(parseInt(expectedCount));
        });

        when(/^o usuário preenche o campo "Seu Nome" com "(.*)"$/, async (value) => {
            await page.type('#review-user', value);
        });

        and(/^preenche o campo "Nota \(1-10\)" com "(.*)"$/, async (value) => {
            // Limpa o campo antes de digitar, pois 'type' pode concatenar se o campo não estiver vazio
            await page.focus('#review-rating');
            await page.keyboard.down('Control');
            await page.keyboard.press('A');
            await page.keyboard.up('Control');
            await page.keyboard.press('Delete');
            await page.type('#review-rating', value);
        });

        and(/^preenche o campo "Comentário" com "(.*)"$/, async (value) => {
            await page.type('#review-comment', value);
        });

        and(/^clica no botão "Enviar Avaliação"$/, async () => {
            await page.click('#submit-review-btn');
        });

        then(/^a mensagem "(.*)" deve ser exibida$/, async (expectedMessage) => {
            await page.waitForFunction((expected) => {
                const element = document.querySelector('#review-message');
                return element && element.textContent.trim() === expected;
            }, { timeout: 80000 }, expectedMessage); 

            const message = await page.$eval('#review-message', el => el.textContent.trim());
            expect(message).toBe(expectedMessage);
        });

        and(/^a lista de avaliações deve exibir "(.*)"$/, async (expectedUser) => {
            await page.waitForFunction((user) => {
                const reviews = document.querySelectorAll('#reviews-list .review-item');
                return Array.from(reviews).some(r => r.textContent.includes(user));
            }, {}, expectedUser);
        });

        and(/^a lista de avaliações deve ter (\d+) itens$/, async (expectedCount) => {
            const reviewsCount = await page.$$eval('#reviews-list > .review-item', elements => elements.length);
            expect(reviewsCount).toBe(parseInt(expectedCount));
        });
    },60000);
});