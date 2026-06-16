# Como o projeto funciona (guia de estudo)

Este guia explica o site inteiro para você conseguir defender qualquer parte no
teste de autoria. Leia junto com os arquivos abertos ao lado.

---

## 1. A ideia geral

O site é feito **só com HTML, CSS e JavaScript** — não tem servidor, nem Node, nem
banco de dados. Você abre o `index.html` no navegador e pronto.

A divisão é simples:

- **HTML** (`index.html`, `item.html`, `login.html`, `cadastrar.html`) → a "casca" de
  cada página.
- **CSS** (`styles.css`) → todo o visual (cores, espaçamentos, responsividade).
- **JavaScript** (`app.js`) → os dados e as funções que **montam** cada página e
  **guardam** as informações.

Cada página HTML é bem curtinha: ela só carrega o `app.js` e chama **uma função**.
Exemplo do `index.html`:

```html
<div id="cabecalho"></div>
<main>
  <div id="aviso"></div>
  <div id="conteudo"></div>
</main>
<script src="app.js"></script>
<script>montarCatalogo();</script>
```

Os três `<div>` começam vazios. O JavaScript preenche eles com `innerHTML`.

---

## 2. Onde os dados ficam guardados (localStorage)

Como não há banco de dados, os itens são guardados no **localStorage** — uma
"gavetinha" do navegador onde dá para salvar texto que continua lá mesmo depois de
fechar a aba.

No `app.js`:

```js
function carregarItens() {
  const salvos = localStorage.getItem("itens");   // tenta ler o que está salvo
  if (salvos) return JSON.parse(salvos);          // achou? transforma texto em lista
  localStorage.setItem("itens", JSON.stringify(ITENS_INICIAIS)); // 1ª vez: salva exemplos
  return ITENS_INICIAIS;
}

function salvarItens(itens) {
  localStorage.setItem("itens", JSON.stringify(itens)); // grava a lista de volta
}
```

Pontos importantes para explicar:

- O localStorage só guarda **texto**. Por isso usamos `JSON.stringify` (lista → texto)
  para salvar e `JSON.parse` (texto → lista) para ler.
- `ITENS_INICIAIS` é uma lista de objetos JavaScript definida no topo do `app.js`.
  Cada objeto é um item, com `id`, `nome`, `categoria`, `fotos`, etc.

---

## 3. O cabeçalho e os avisos (aparecem em todas as páginas)

Para não repetir o mesmo cabeçalho em cada arquivo HTML, ele é montado por JavaScript:

```js
function prepararPagina() {
  document.getElementById("cabecalho").innerHTML = montarCabecalho();
  const aviso = document.getElementById("aviso");
  if (aviso) aviso.innerHTML = montarAviso();
}
```

- `montarCabecalho()` devolve um HTML diferente conforme o funcionário está logado
  (mostra "Cadastrar item" e "Sair") ou não (mostra "Área do funcionário").
- `montarAviso()` mostra a faixa verde/vermelha de mensagem. Ele lê a mensagem da URL
  (ex.: `index.html?msg=Item%20cadastrado`).

---

## 4. Página inicial — o catálogo (`montarCatalogo`)

Quando o `index.html` abre, ele chama `montarCatalogo()`. O que essa função faz, em ordem:

1. Chama `prepararPagina()` (monta cabeçalho e aviso).
2. Descobre se é funcionário com `estaLogado()`.
3. Lê os filtros que vieram na URL (busca, categoria, local, ordem...).
4. Chama `filtrarItens(filtros)` para pegar só os itens que passam na busca/filtros.
5. Monta um texto HTML grande (hero + filtros + lista de cards) e joga no
   `<div id="conteudo">`.

O coração disso é a função de filtro, que é **JavaScript puro com `filter` e `sort`**:

```js
function filtrarItens(filtros) {
  let itens = carregarItens();

  if (filtros.q.trim()) {                    // se há busca por texto
    const termo = filtros.q.trim().toLowerCase();
    itens = itens.filter((item) =>
      item.nome.toLowerCase().includes(termo) ||
      item.descricao.toLowerCase().includes(termo) || ...);
  }
  if (filtros.categoria !== "all")
    itens = itens.filter((item) => item.categoria === filtros.categoria);
  ...
  if (filtros.ordem === "name")
    itens.sort((a, b) => a.nome.localeCompare(b.nome)); // ordena por nome
  return itens;
}
```

**Detalhe importante:** o visitante (não logado) só enxerga itens disponíveis. Isso é
forçado aqui, dentro de `montarCatalogo`:

```js
status: logado ? (pegarParam("status") || "all") : "available",
```

### Como o formulário de busca funciona sem servidor

O formulário de filtros é um `<form method="get" action="index.html">`. Quando você
clica em "Buscar", o navegador **recarrega o `index.html` com os dados na URL**, por
exemplo `index.html?q=kindle&categoria=Eletrônicos`. Aí o `montarCatalogo` lê esses
valores com `pegarParam(...)` e mostra o resultado. Simples e sem JavaScript de envio.

---

## 5. Página de detalhe (`montarDetalhe`)

O link de cada card é `item.html?id=3`. Na página de detalhe:

```js
const item = acharItem(pegarParam("id")); // pega o id da URL e procura o item
if (!item) { /* mostra a página de erro 404 */ }
```

Depois monta as três partes:

- `galeria(item)` → as fotos. A troca de foto é feita **só com CSS** (usando
  `<input type="radio">` e `<label>`), por isso funciona sem JavaScript.
- o texto do item (categoria, nome, data, local, descrição).
- `acoesAdmin(item)` → os botões que **só aparecem para o funcionário** (resgatar,
  expirar, doar) e `comprovante(item)` → o quadro que aparece quando o item já foi
  resgatado ou doado.

### As ações do funcionário

Cada botão é um formulário com `onsubmit`. Exemplo do resgate:

```js
function registrarResgate(evento, id) {
  evento.preventDefault();              // impede o formulário de recarregar sozinho
  const form = evento.target;
  const itens = carregarItens();
  const item = itens.find((i) => i.id === id);
  item.status = "claimed";              // muda a situação do item
  item.resgateNome = form.nome.value.trim();
  item.resgateDocumento = form.documento.value.trim();
  item.resgateData = new Date().toISOString();
  salvarItens(itens);                   // grava no navegador
  location.href = "item.html?id=" + id + "&msg=Retirada registrada com sucesso.";
}
```

`expirarItem` e `registrarDoacao` seguem exatamente a mesma ideia.

---

## 6. Login (`login.html` + `entrar`)

O login é uma simples comparação. No `app.js`:

```js
function entrar(email, senha) {
  if (email === USUARIO.email && senha === SENHA) {
    localStorage.setItem("logado", "sim"); // marca que entrou
    return true;
  }
  return false;
}
function estaLogado() {
  return localStorage.getItem("logado") === "sim";
}
```

A `login.html` chama `entrar(...)` quando você envia o formulário. Se der certo, vai
para o catálogo; se errar, mostra o aviso vermelho.

> ⚠️ Isso **não é segurança de verdade** — a senha está no código e qualquer um pode
> mudar o localStorage. É só para separar a "visão do visitante" da "visão do
> funcionário" no trabalho. Bom saber disso, porque o avaliador pode perguntar.

---

## 7. Cadastrar e editar item (`montarFormulario` + `salvarFormulario`)

A mesma página (`cadastrar.html`) serve para os dois casos:

- Sem `?id=` na URL → cadastro novo.
- Com `?id=5` → edição (o formulário já vem preenchido com os dados do item).

Ao enviar, `salvarFormulario` roda. As partes principais:

```js
// 1) Lê as fotos escolhidas e transforma em texto (data URL) para poder salvar:
function lerFoto(arquivo) {
  return new Promise((resolve) => {
    const leitor = new FileReader();
    leitor.onload = () => resolve(leitor.result);
    leitor.readAsDataURL(arquivo);
  });
}

// 2) Se for edição, atualiza o item; se for novo, cria com um id novo:
const novoId = itens.length ? Math.max(...itens.map((i) => i.id)) + 1 : 1;
```

O `FileReader` é o jeito de, sem servidor, pegar a foto que a pessoa escolheu e
guardar dentro do localStorage como texto.

---

## 8. O ciclo, em uma frase

```
Você clica/envia  →  uma função do app.js roda  →  ela mexe na lista de itens
(localStorage)    →  monta o HTML novo (innerHTML)  →  a tela atualiza.
```

---

## 9. Perguntas que o avaliador pode fazer (com respostas curtas)

**"Onde os dados ficam? Por que não usou banco?"**
No `localStorage` do navegador. Como o trabalho é só front-end (HTML/CSS/JS), não há
servidor para hospedar um banco; o localStorage resolve guardando os itens como texto.

**"O que acontece se eu fechar e abrir de novo?"**
Os itens continuam, porque o localStorage não se apaga ao fechar a aba. Para zerar,
rodo `localStorage.clear()` no Console e os itens de exemplo voltam.

**"Por que cada página chama uma função no final?"**
Porque o HTML é só a casca (divs vazios). O JavaScript é quem monta o conteúdo de
verdade com `innerHTML`. Cada página chama a função que monta aquela tela.

**"Como a busca funciona sem servidor?"**
O formulário recarrega a própria página colocando os filtros na URL
(`?q=...`). O JavaScript lê a URL e usa `array.filter()` para escolher os itens.

**"O que é o `escaparHtml`?"**
Uma proteção: troca caracteres como `<` e `>` por código seguro, para que um texto
digitado nunca seja interpretado como HTML ou script (evita o ataque chamado XSS).

**"Esse login é seguro?"**
Não. É só uma comparação no navegador para separar visitante de funcionário. Para
valer de verdade precisaria de um servidor verificando a senha.

**"Por que tem `Number(id)`?"**
O `id` vem da URL como **texto** (`"5"`). Os ids na lista são **números** (`5`). O
`Number(...)` converte para comparar certo.
