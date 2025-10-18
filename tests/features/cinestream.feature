# language: pt
Funcionalidade: Gestão de Mídias e Interações do Usuário no CineStream

  Cenário: Visualização do Catálogo e Detalhes
    Dado que o usuário acessa a página do Catálogo Principal
    Então o catálogo deve exibir 4 títulos
    E deve mostrar o título "Dune: Part One"
    Quando o usuário clica no título "Dune: Part One"
    Então ele deve ser redirecionado para a página de detalhes do título "Dune: Part One"
    E a nota de avaliação exibida deve ser "7.9"
    E a seção de avaliações deve indicar que "Nenhuma avaliação ainda. Seja o primeiro!"

  Cenário: Adicionar e Remover Favorito
    Dado que o usuário está na página de detalhes do título "The Witcher" (id 2)
    E o estado do botão de favorito deve ser "Remover Favorito"
    Quando o usuário clica no botão "Remover Favorito"
    Então o estado do botão de favorito deve mudar para "Adicionar à Minha Lista"
    E a mensagem "Removido dos Favoritos!" deve ser exibida
    Quando o usuário clica no botão "Adicionar à Minha Lista"
    Então o estado do botão de favorito deve mudar para "Remover Favorito"
    E a mensagem "Adicionado aos Favoritos!" deve ser exibida

  Cenário: Adicionar uma Nova Avaliação
    Dado que o usuário está na página de detalhes do título "Blade Runner 2049" (id 1)
    E deve existir 2 avaliações cadastradas
    Quando o usuário preenche o campo "Seu Nome" com "Raimundo"
    E preenche o campo "Nota (1-10)" com "7"
    E preenche o campo "Comentário" com "Filme relativamente bom, muito superestimado!"
    E clica no botão "Enviar Avaliação"
    Então a mensagem "Avaliação enviada com sucesso!" deve ser exibida
    E a lista de avaliações deve exibir "Raimundo"
    E a lista de avaliações deve ter 3 itens