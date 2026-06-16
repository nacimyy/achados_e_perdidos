# Achados e Perdidos PUCPR

Site de achados e perdidos do campus, feito **só com HTML, CSS e JavaScript**.
Não tem servidor, nem Node, nem banco de dados. Os itens ficam guardados no
próprio navegador (no `localStorage`).

## Como abrir

Basta abrir o arquivo **`index.html`** no navegador (dois cliques).

> Dica: se estiver usando o VS Code, a extensão "Live Server" também funciona.

## Acesso do funcionário

Clique em "Área do funcionário" e entre com:

- E-mail: `funcionario@pucpr.br`
- Senha: `pucpr`

Como funcionário você pode cadastrar, editar, registrar resgate, marcar como
expirado e registrar doação.

## Arquivos do projeto

| Arquivo | O que é |
| --- | --- |
| `index.html` | Página inicial (catálogo com busca e filtros) |
| `item.html` | Página de detalhe de um item |
| `login.html` | Tela de login do funcionário |
| `cadastrar.html` | Formulário de cadastrar/editar item |
| `app.js` | Todo o JavaScript: os dados e as funções que montam as páginas |
| `styles.css` | Todo o visual (cores, layout, responsividade) |
| `images/` | Imagens e fotos dos itens |

## Como os dados funcionam

- Na primeira vez que o site abre, uma lista de itens de exemplo é salva no
  navegador (`localStorage`).
- Cadastrar, editar e as demais ações alteram essa lista e salvam de novo.
- Para **zerar tudo**, limpe os dados do site no navegador (ou abra o Console e
  rode `localStorage.clear()`) — os itens de exemplo voltam.
