/*
  app.js — todo o JavaScript do site.

  O site é só HTML + CSS + este arquivo. Não há servidor.
  A lista de itens fica guardada no próprio navegador, usando o localStorage
  (uma "gavetinha" onde dá para salvar texto que continua lá depois de fechar a aba).

  Cada página HTML carrega este arquivo e chama uma função de montagem:
  - index.html    -> montarCatalogo()
  - item.html     -> montarDetalhe()
  - login.html    -> (usa entrar())
  - cadastrar.html-> montarFormulario()
*/

/* ====================== DADOS ====================== */

// Dados do funcionário (login de demonstração).
const USUARIO = { nome: "Marina Alves", email: "funcionario@pucpr.br", local: "Bloco 10" };
const SENHA = "pucpr";

// Itens que aparecem na primeira vez que o site abre.
const ITENS_INICIAIS = [
  { id: 1, nome: "Guarda-chuva azul", categoria: "Acessórios", descricao: "Guarda-chuva azul-marinho com cabo preto. Disponível para retirada na Central de Atendimento.", local: "Bloco 10", data: "2026-05-29", responsavel: "Marina Alves", status: "available", fotos: ["images/items/guarda-chuva.jpg"] },
  { id: 2, nome: "Caderno Midnight", categoria: "Material escolar", descricao: "Caderno de capa escura com estampa de fases da lua e anotações nas primeiras páginas.", local: "Bloco 5", data: "2026-05-28", responsavel: "Carlos Lima", status: "available", fotos: ["images/items/caderno.jpg"] },
  { id: 3, nome: "Copo térmico Stanley", categoria: "Garrafas e copos", descricao: "Copo térmico branco, com tampa e alça. Disponível para retirada na secretaria do Bloco 10.", local: "Bloco 10", data: "2026-05-27", responsavel: "Marina Alves", status: "available", fotos: ["images/items/copo-termico-1.jpg", "images/items/copo-termico-2.jpg", "images/items/copo-termico-3.jpg", "images/items/copo-termico-4.jpg"] },
  { id: 4, nome: "Chaveiro com chaves", categoria: "Acessórios", descricao: "Conjunto com quatro chaves e um chaveiro vermelho. O proprietário deverá informar detalhes adicionais.", local: "Bloco 3", data: "2026-05-27", responsavel: "João Mendes", status: "available", fotos: ["images/items/chaves.jpg"] },
  { id: 5, nome: "iPhone dourado", categoria: "Eletrônicos", descricao: "Celular Apple com capa transparente, encontrado próximo à praça de alimentação.", local: "Bloco 5", data: "2026-05-25", responsavel: "Carlos Lima", status: "claimed", fotos: ["images/items/celular.jpg"], resgateNome: "Helena Castro", resgateDocumento: "000.000.000-00", resgateData: "2026-05-26T17:20:00.000Z" },
  { id: 6, nome: "Pendrive com chaveiro", categoria: "Eletrônicos", descricao: "Pendrive preso a um chaveiro metálico. Não conectamos o dispositivo por segurança.", local: "Bloco 2", data: "2026-05-24", responsavel: "Ana Souza", status: "available", fotos: ["images/items/pendrive.jpg"] },
  { id: 7, nome: "Power bank Anker", categoria: "Eletrônicos", descricao: "Carregador portátil preto com alça cinza, encontrado em uma sala de estudos.", local: "Bloco 6", data: "2026-05-23", responsavel: "Paulo Rocha", status: "available", fotos: ["images/items/power-bank.jpg"] },
  { id: 8, nome: "Kindle verde", categoria: "Eletrônicos", descricao: "Leitor digital com capa verde. A tela está em boas condições.", local: "Bloco 10", data: "2026-05-22", responsavel: "Marina Alves", status: "available", fotos: ["images/items/kindle.jpg"] },
  { id: 9, nome: "Console portátil", categoria: "Eletrônicos", descricao: "Console portátil em estojo preto, sem carregador.", local: "Bloco 8", data: "2026-03-12", responsavel: "Renata Costa", status: "expired", fotos: ["images/items/jogo-portatil.jpg"] },
  { id: 10, nome: "Fones JBL", categoria: "Eletrônicos", descricao: "Par de fones sem fio JBL em estojo carregador preto.", local: "Bloco 3", data: "2026-03-10", responsavel: "João Mendes", status: "donated", fotos: ["images/items/fone-ouvido.jpg"], doacaoInstituicao: "Complexo de Saúde Pequeno Cotolengo", doacaoData: "2026-05-12T14:00:00.000Z" },
  { id: 11, nome: "Apple Pencil", categoria: "Eletrônicos", descricao: "Caneta digital branca encontrada no laboratório de informática.", local: "Bloco 9", data: "2026-05-20", responsavel: "Paulo Rocha", status: "available", fotos: ["images/items/apple-pencil.jpg"] },
  { id: 12, nome: "Livro Entendendo Algoritmos", categoria: "Livros", descricao: "Livro técnico com pequenas marcações a lápis.", local: "Biblioteca", data: "2026-05-18", responsavel: "Luciana Prado", status: "available", fotos: ["images/items/livro.jpg"] }
];

// Lê os itens guardados no navegador. Na primeira vez, salva os iniciais.
function carregarItens() {
  const salvos = localStorage.getItem("itens");
  if (salvos) return JSON.parse(salvos);
  localStorage.setItem("itens", JSON.stringify(ITENS_INICIAIS));
  return ITENS_INICIAIS;
}

// Salva a lista de itens no navegador.
function salvarItens(itens) {
  localStorage.setItem("itens", JSON.stringify(itens));
}

// Procura um item pelo id (o id da URL vem como texto, por isso o Number).
function acharItem(id) {
  return carregarItens().find((item) => item.id === Number(id));
}

/* ====================== LOGIN ====================== */

// Diz se o funcionário está logado (guardamos a marca "sim" no navegador).
function estaLogado() {
  return localStorage.getItem("logado") === "sim";
}

// Confere e-mail e senha. Se acertar, marca como logado e devolve true.
function entrar(email, senha) {
  if (email === USUARIO.email && senha === SENHA) {
    localStorage.setItem("logado", "sim");
    return true;
  }
  return false;
}

// Sai da área do funcionário e volta para o catálogo.
function sair() {
  localStorage.removeItem("logado");
  location.href = "index.html?msg=" + encodeURIComponent("Você saiu da área administrativa.");
}

/* ====================== LISTAS E TEXTOS ====================== */

const categorias = ["Acessórios", "Documentos", "Eletrônicos", "Garrafas e copos", "Livros", "Material escolar", "Roupas", "Outros"];
const locais = ["Bloco1","Bloco 2", "Bloco 3", "Bloco 4", "Bloco 5", "Bloco 6", "Bloco 7", "Bloco 8", "Bloco 9", "Bloco 10", "Biblioteca", "Ginásio"];
const statusTexto = { available: "Disponível", claimed: "Resgatado", expired: "Expirado", donated: "Doado" };

// Desenhos (ícones) da interface. Cada um é um trecho de SVG.
const icones = {
  arrowLeft: '<path d="m15 18-6-6 6-6"/><path d="M21 12H9"/>',
  box: '<path d="m21 8-9 5-9-5"/><path d="m3 8 9-5 9 5v8l-9 5-9-5Z"/><path d="m12 13 9-5"/><path d="M12 13v8"/>',
  calendar: '<path d="M8 2v4M16 2v4M3 10h18"/><rect width="18" height="18" x="3" y="4" rx="2"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
  filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  gift: '<rect width="18" height="14" x="3" y="8" rx="2"/><path d="M12 8v13M3 12h18M7.5 8C5 8 4 6.5 4 5.5S5 3 6.5 3C9 3 12 8 12 8s3-5 5.5-5C19 3 20 4.5 20 5.5S19 8 16.5 8"/>',
  image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  location: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  login: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3Z"/><path d="m9 12 2 2 4-4"/>',
  sort: '<path d="m3 16 4 4 4-4M7 20V4M21 8l-4-4-4 4M17 4v16"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'
};

function icone(nome, tamanho = 20) {
  return `<svg aria-hidden="true" width="${tamanho}" height="${tamanho}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icones[nome] || ""}</svg>`;
}

// Troca caracteres perigosos (< > " ') para o texto do usuário não virar HTML.
function escaparHtml(texto = "") {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Mostra a data no formato brasileiro (dd/mm/aaaa).
function formatarData(valor, comHora = false) {
  if (!valor) return "";
  const data = valor.includes("T") ? new Date(valor) : new Date(valor + "T12:00:00");
  const opcoes = comHora ? { dateStyle: "short", timeStyle: "short" } : { dateStyle: "short" };
  return new Intl.DateTimeFormat("pt-BR", opcoes).format(data);
}

// Lê um valor que veio na URL, por exemplo "?id=5" -> pegarParam("id") devolve "5".
function pegarParam(nome) {
  return new URLSearchParams(location.search).get(nome) || "";
}

/* ====================== CABEÇALHO E AVISOS (em todas as páginas) ====================== */

// Monta o cabeçalho. Muda conforme o funcionário está logado ou não.
function montarCabecalho() {
  const navAdmin = estaLogado()
    ? `
      <div class="user-menu-wrapper">
        <button class="user-menu-trigger" type="button" aria-haspopup="true" aria-expanded="false" onclick="toggleUserMenu(this)">
          <span class="user-avatar">${icone("user", 19)}</span>
        </button>
        <div class="user-menu-dropdown" role="menu">
          <div class="user-menu-header">
            <strong>${escaparHtml(USUARIO.nome)}</strong>
            <small>${escaparHtml(USUARIO.local)}</small>
          </div>
          <hr class="user-menu-divider">
          <a class="user-menu-item" href="index.html" role="menuitem">${icone("box", 18)} Catálogo</a>
          <a class="user-menu-item" href="cadastrar.html" role="menuitem">${icone("plus", 18)} Cadastrar item</a>
          <hr class="user-menu-divider">
          <button class="user-menu-item user-menu-logout" type="button" onclick="sair()" role="menuitem">${icone("logout", 18)} Sair</button>
        </div>
      </div>`
    : `<a class="nav-login" href="login.html">${icone("login", 18)} Área do funcionário</a>`;

  return `
    <header class="site-header">
      <div class="header-accent"></div>
      <div class="header-inner container">
        <a class="brand" href="index.html" aria-label="Ir para o início">
          <img src="images/brand/pucpr-header.png" alt="PUCPR Grupo Marista">
          <span class="brand-divider"></span>
          <span class="brand-product"><strong>Achados</strong><span>e Perdidos</span></span>
        </a>
        <nav class="header-nav desktop-navigation" aria-label="Navegação principal">
          ${navAdmin}
        </nav>
        <details class="mobile-navigation">
          <summary aria-label="Abrir menu"><span></span><span></span><span></span></summary>
          <nav aria-label="Navegação móvel">
            ${navAdmin}
          </nav>
        </details>
      </div>
    </header>`;
}

// Abre e fecha o menu do usuário no canto (funciona tanto para o clique quanto para teclado).
function toggleUserMenu(botao) {
  const wrapper = botao.closest(".user-menu-wrapper");
  const aberto = wrapper.classList.toggle("open");
  botao.setAttribute("aria-expanded", aberto);

  // Fecha ao clicar fora
  if (aberto) {
    const fechar = (e) => {
      if (!wrapper.contains(e.target)) {
        wrapper.classList.remove("open");
        botao.setAttribute("aria-expanded", "false");
        document.removeEventListener("click", fechar);
      }
    };
    // Timeout para não capturar o próprio clique que abriu
    setTimeout(() => document.addEventListener("click", fechar), 0);
  }
}

// Caixa de aviso verde (sucesso) ou vermelha (erro), lida a partir da URL.
function montarAviso() {
  const msg = pegarParam("msg");
  const erro = pegarParam("erro");
  if (!msg && !erro) return "";
  const tipo = erro ? "error" : "success";
  const texto = erro || msg;
  return `<div class="page-notice notice-${tipo}" role="status">${icone(erro ? "info" : "check")}<span>${escaparHtml(texto)}</span></div>`;
}

// Preenche o cabeçalho e o aviso. Toda página chama isso ao abrir.
function prepararPagina() {
  document.getElementById("cabecalho").innerHTML = montarCabecalho();
  const aviso = document.getElementById("aviso");
  if (aviso) aviso.innerHTML = montarAviso();
}

/* ====================== PÁGINA INICIAL (CATÁLOGO) ====================== */

function ehSelecionado(valor, esperado) {
  return valor === esperado ? " selected" : "";
}

// Cartão de um item na lista.
function cartaoItem(item, mostrarStatus) {
  return `
    <a class="item-card" href="item.html?id=${item.id}">
      <div class="item-card-image">
        <img src="${escaparHtml(item.fotos[0])}" alt="${escaparHtml(item.nome)}" loading="lazy">
        ${mostrarStatus ? `<span class="status-badge status-${item.status}">${statusTexto[item.status]}</span>` : ""}
      </div>
      <div class="item-card-content">
        <span class="item-category">${escaparHtml(item.categoria)}</span>
        <h3>${escaparHtml(item.nome)}</h3>
        <p>${icone("location", 16)} ${escaparHtml(item.local)}</p>
        <p>${icone("calendar", 16)} Encontrado em ${formatarData(item.data)}</p>
      </div>
    </a>`;
}

// Tira da lista os itens que não passam na busca/filtros e ordena o resultado.
function filtrarItens(filtros) {
  let itens = carregarItens();

  if (filtros.q.trim()) {
    const termo = filtros.q.trim().toLowerCase();
    itens = itens.filter((item) =>
      item.nome.toLowerCase().includes(termo) ||
      item.descricao.toLowerCase().includes(termo) ||
      item.categoria.toLowerCase().includes(termo) ||
      item.local.toLowerCase().includes(termo));
  }
  if (filtros.status !== "all") itens = itens.filter((item) => item.status === filtros.status);
  if (filtros.categoria !== "all") itens = itens.filter((item) => item.categoria === filtros.categoria);
  if (filtros.local !== "all") itens = itens.filter((item) => item.local === filtros.local);
  if (filtros.dataDe) itens = itens.filter((item) => item.data >= filtros.dataDe);
  if (filtros.dataAte) itens = itens.filter((item) => item.data <= filtros.dataAte);

  if (filtros.ordem === "oldest") itens.sort((a, b) => a.data.localeCompare(b.data));
  else if (filtros.ordem === "name") itens.sort((a, b) => a.nome.localeCompare(b.nome));
  else itens.sort((a, b) => b.data.localeCompare(a.data));

  return itens;
}

// Conta quantos itens há em cada situação (painel do funcionário).
function contarStatus() {
  const itens = carregarItens();
  const conta = (s) => itens.filter((item) => item.status === s).length;
  return { total: itens.length, available: conta("available"), claimed: conta("claimed"), expired: conta("expired"), donated: conta("donated") };
}

function faixaDeNumeros(stats) {
  const linhas = [
    ["box", "", stats.total, "Itens cadastrados"],
    ["check", "available", stats.available, "Disponíveis"],
    ["check", "claimed", stats.claimed, "Resgatados"],
    ["clock", "expired", stats.expired, "Expirados"],
    ["gift", "donated", stats.donated, "Doados"]
  ];
  return `
    <section class="stats-strip container" aria-label="Resumo dos itens">
      ${linhas.map(([ic, status, valor, rotulo]) => `
        <article>
          <span class="stat-icon ${status}">${icone(ic)}</span>
          <div><strong>${valor}</strong><small>${rotulo}</small></div>
        </article>`).join("")}
    </section>`;
}

// Monta a página inicial inteira e coloca no <div id="conteudo">.
function montarCatalogo() {
  prepararPagina();
  const logado = estaLogado();

  // Filtros vêm da URL (o formulário recarrega a página com ?q=...&categoria=...).
  const filtros = {
    q: pegarParam("q"),
    status: logado ? (pegarParam("status") || "all") : "available",
    categoria: pegarParam("categoria") || "all",
    local: pegarParam("local") || "all",
    ordem: pegarParam("ordem") || "newest",
    dataDe: pegarParam("dataDe"),
    dataAte: pegarParam("dataAte")
  };

  const itens = filtrarItens(filtros);
  const temFiltro = filtros.categoria !== "all" || filtros.local !== "all" || filtros.status !== "all" || filtros.dataDe || filtros.dataAte;


  const botoesStatus = [["all", "Todos"], ...Object.entries(statusTexto)].map(([valor, rotulo]) => `
    <label class="${filtros.status === valor ? "selected" : ""}">
      <input type="radio" name="status" value="${valor}"${filtros.status === valor ? " checked" : ""}>
      <span>${rotulo}</span>
    </label>`).join("");

  document.getElementById("conteudo").innerHTML = `
    <section class="hero ${logado ? "hero-admin" : ""}">
      <div class="container hero-content">
        <div class="hero-copy">
          <span class="eyebrow">${logado ? "Painel administrativo" : "Portal do campus Curitiba"}</span>
          <h1>${logado ? "Gestão de itens encontrados" : "Perdeu alguma coisa por aqui?"}</h1>
          <p>${logado
            ? "Acompanhe os itens sob responsabilidade da equipe, registre retiradas e mantenha o catálogo atualizado."
            : "Consulte os objetos encontrados no campus e veja onde fazer a retirada com segurança."}</p>
          <p> <a href="https://www.pucpr.br" >Conheça também o site principal da PUCPR</a> </p>
        </div>
        ${logado ? "" : `
          <div class="hero-note">
            ${icone("check")}
            <span><strong>Encontrou o seu item?</strong>Leve um documento com foto ao local indicado.</span>
          </div>`}
      </div>
    </section>

    ${logado ? faixaDeNumeros(contarStatus()) : ""}

    <section class="catalog-section container">
      <div class="catalog-heading">
        <div>
          <span class="eyebrow">${logado ? "Inventário" : "Objetos encontrados"}</span>
          <h2>${logado ? "Todos os itens" : "Itens disponíveis"}</h2>
        </div>
        ${logado ? `<a class="button button-primary desktop-create" href="cadastrar.html">${icone("plus", 18)} Cadastrar item</a>` : ""}
      </div>

      <form class="catalog-filters" method="get" action="index.html">
        <div class="search-toolbar">
          <label class="search-box">
            ${icone("search")}
            <input type="search" name="q" aria-label="Buscar itens" placeholder="Busque por nome, categoria ou local..." value="${escaparHtml(filtros.q)}">
          </label>
          <button class="search-submit" type="submit">Buscar</button>
          <details class="filter-popover">
            <summary class="button-filter">
              ${icone("filter", 19)} Filtros
              ${temFiltro ? '<span class="filter-dot"></span>' : ""}
            </summary>
            <div class="filter-panel-native">
              <div class="filter-panel-header"><span>${icone("filter", 20)} Filtros</span></div>
              ${logado ? `
                <fieldset class="filter-group">
                  <legend>Status</legend>
                  <div class="status-filter-grid">${botoesStatus}</div>
                </fieldset>` : ""}
              <label class="field">
                <span>Categoria</span>
                <select name="categoria">
                  <option value="all"${ehSelecionado(filtros.categoria, "all")}>Todas as categorias</option>
                  ${categorias.map((c) => `<option${ehSelecionado(filtros.categoria, c)}>${escaparHtml(c)}</option>`).join("")}
                </select>
              </label>
              <label class="field">
                <span>Localização</span>
                <select name="local">
                  <option value="all"${ehSelecionado(filtros.local, "all")}>Todos os locais</option>
                  ${locais.map((l) => `<option${ehSelecionado(filtros.local, l)}>${escaparHtml(l)}</option>`).join("")}
                </select>
              </label>
              <div class="filter-group">
                <span class="field-label">Data em que foi encontrado</span>
                <div class="date-range">
                  <label><span>De</span><input type="date" name="dataDe" value="${escaparHtml(filtros.dataDe)}"></label>
                  <label><span>Até</span><input type="date" name="dataAte" value="${escaparHtml(filtros.dataAte)}"></label>
                </div>
              </div>
              <div class="filter-actions">
                <a class="button button-secondary" href="index.html">Limpar</a>
                <button class="button button-primary" type="submit">Ver resultados</button>
              </div>
            </div>
          </details>
          <label class="sort-control">
            ${icone("sort", 18)}
            <select name="ordem" aria-label="Ordenar itens">
              <option value="newest"${ehSelecionado(filtros.ordem, "newest")}>Mais recentes</option>
              <option value="oldest"${ehSelecionado(filtros.ordem, "oldest")}>Mais antigos</option>
              <option value="name"${ehSelecionado(filtros.ordem, "name")}>Nome A–Z</option>
            </select>
          </label>
          <button class="sort-submit" type="submit">Aplicar</button>
        </div>
      </form>

      <div class="results-meta">
        <span>${itens.length} ${itens.length === 1 ? "item encontrado" : "itens encontrados"}</span>
        ${logado ? "" : '<span class="results-help">O catálogo exibe somente itens disponíveis para retirada.</span>'}
      </div>

      ${itens.length
        ? `<div class="items-grid">${itens.map((item) => cartaoItem(item, logado)).join("")}</div>`
        : `<div class="empty-state"><span>${icone("search", 30)}</span><h3>Nenhum item por aqui</h3><p>Tente buscar por outro termo ou remova alguns filtros.</p><a class="button button-secondary" href="index.html">Limpar filtros</a></div>`}
    </section>`;
}

// Atualiza visual dos botões de status na hora do clique
document.addEventListener("change", function (e) {
  if (e.target.name === "status") {
    document.querySelectorAll(".status-filter-grid label").forEach((label) => {
      label.classList.remove("selected");
    });
    e.target.closest("label").classList.add("selected");
  }
});


/* ====================== PÁGINA DE DETALHE ====================== */

// Galeria de fotos (troca de foto só com CSS, usando radio buttons).
function galeria(item) {
  const fotos = item.fotos.slice(0, 5);
  return `
    <section class="gallery css-gallery" aria-label="Fotos do item">
      ${fotos.map((_, i) => `<input type="radio" name="gallery" id="photo-${i + 1}"${i === 0 ? " checked" : ""}>`).join("")}
      <div class="gallery-main">
        ${fotos.map((foto, i) => `<img class="gallery-photo gallery-photo-${i + 1}" src="${escaparHtml(foto)}" alt="${escaparHtml(item.nome)} - foto ${i + 1}">`).join("")}
        <span class="status-badge status-${item.status}">${statusTexto[item.status]}</span>
      </div>
      ${fotos.length > 1 ? `
        <div class="gallery-thumbnails">
          ${fotos.map((foto, i) => `<label class="gallery-thumb gallery-thumb-${i + 1}" for="photo-${i + 1}"><img src="${escaparHtml(foto)}" alt="Exibir foto ${i + 1}"></label>`).join("")}
        </div>` : ""}
    </section>`;
}

// Comprovante mostrado quando o item já foi resgatado ou doado.
function comprovante(item) {
  if (item.status === "claimed") {
    return `
      <section class="status-receipt receipt-claimed">
        <header>${icone("check", 26)}<div><span>Item resgatado</span><small>Retirada concluída</small></div></header>
        <div class="receipt-grid">
          <p>${icone("user")}<span><small>Retirado por</small><strong>${escaparHtml(item.resgateNome)}</strong></span></p>
          <p>${icone("shield")}<span><small>Documento</small><strong>${escaparHtml(item.resgateDocumento)}</strong></span></p>
          <p>${icone("calendar")}<span><small>Data e hora</small><strong>${formatarData(item.resgateData, true)}</strong></span></p>
        </div>
      </section>`;
  }
  if (item.status === "donated") {
    return `
      <section class="status-receipt receipt-donated">
        <header>${icone("gift", 26)}<div><span>Item doado</span><small>Destinação social concluída</small></div></header>
        <div class="receipt-grid">
          <p>${icone("shield")}<span><small>Instituição</small><strong>${escaparHtml(item.doacaoInstituicao)}</strong></span></p>
          <p>${icone("calendar")}<span><small>Doado em</small><strong>${formatarData(item.doacaoData, true)}</strong></span></p>
        </div>
      </section>`;
  }
  return "";
}

// Botões que só aparecem para o funcionário (resgatar, expirar, doar).
function acoesAdmin(item) {
  if (item.status === "available") {
    return `
      <div class="admin-actions">
        <details class="action-disclosure">
          <summary class="button button-primary">${icone("check", 18)} Registrar resgate</summary>
          <form class="inline-action-form" onsubmit="return registrarResgate(event, ${item.id})">
            <h3>Registrar resgate</h3>
            <p>Confirme a identidade da pessoa antes de concluir a entrega.</p>
            <label class="field"><span>Nome completo</span><input name="nome" required></label>
            <label class="field"><span>CPF ou documento</span><input name="documento" required></label>
            <button class="button button-primary" type="submit">Confirmar retirada</button>
          </form>
        </details>
        <form onsubmit="return expirarItem(event, ${item.id})">
          <button class="button button-secondary" type="submit">${icone("clock", 18)} Marcar como expirado</button>
        </form>
      </div>`;
  }
  if (item.status === "expired") {
    return `
      <div class="admin-actions">
        <details class="action-disclosure">
          <summary class="button button-primary">${icone("gift", 18)} Registrar doação</summary>
          <form class="inline-action-form" onsubmit="return registrarDoacao(event, ${item.id})">
            <h3>Registrar doação</h3>
            <p>Informe a instituição que recebeu o objeto.</p>
            <label class="field">
              <span>Instituição beneficiada</span>
              <input name="instituicao" placeholder="Ex.: Complexo de Saúde Pequeno Cotolengo" required>
            </label>
            <button class="button button-primary" type="submit">Confirmar doação</button>
          </form>
        </details>
      </div>`;
  }
  return "";
}

// Monta a página de detalhe a partir do ?id= da URL.
function montarDetalhe() {
  prepararPagina();
  const logado = estaLogado();
  const item = acharItem(pegarParam("id"));

  if (!item) {
    document.getElementById("conteudo").innerHTML = `
      <section class="error-page container">
        <span class="error-code">404</span>
        <h1>Página não encontrada</h1>
        <p>Item não encontrado.</p>
        <a class="button button-primary" href="index.html">Voltar ao catálogo</a>
      </section>`;
    return;
  }

  document.title = item.nome + " | PUCPR";
  document.getElementById("conteudo").innerHTML = `
    <div class="detail-page container">
      <div class="detail-topbar">
        <a class="back-link" href="index.html">${icone("arrowLeft", 19)} Voltar ao catálogo</a>
        ${logado ? `<a class="button button-secondary" href="cadastrar.html?id=${item.id}">${icone("edit", 17)} Editar item</a>` : ""}
      </div>
      <div class="detail-layout">
        ${galeria(item)}
        <section class="item-detail">
          <span class="eyebrow">${escaparHtml(item.categoria)}</span>
          <h1>${escaparHtml(item.nome)}</h1>
          <div class="detail-meta">
            <p>${icone("calendar")}<span><small>Encontrado em</small><strong>${formatarData(item.data)}</strong></span></p>
            <p>${icone("location")}<span><small>Local de retirada</small><strong>${escaparHtml(item.local)}</strong></span></p>
            <p>${icone("clock")}<span><small>Horário de atendimento</small><strong>Segunda a sexta, das 8h às 19h</strong></span></p>
          </div>
          <div class="detail-description">
            <h2>Sobre o item</h2>
            <p>${escaparHtml(item.descricao)}</p>
          </div>
          <div class="security-note">
            ${icone("shield")}
            <div><strong>Retirada com identificação</strong><p>Apresente um documento com foto e confirme características do objeto no atendimento.</p></div>
          </div>
          ${logado ? acoesAdmin(item) : ""}
        </section>
      </div>
      ${comprovante(item)}
    </div>`;
}

// ----- Ações do funcionário na página de detalhe -----

// Registra a retirada de um item por uma pessoa.
function registrarResgate(evento, id) {
  evento.preventDefault();
  const form = evento.target;
  const itens = carregarItens();
  const item = itens.find((i) => i.id === id);
  item.status = "claimed";
  item.resgateNome = form.nome.value.trim();
  item.resgateDocumento = form.documento.value.trim();
  item.resgateData = new Date().toISOString();
  salvarItens(itens);
  location.href = "item.html?id=" + id + "&msg=" + encodeURIComponent("Retirada registrada com sucesso.");
  return false;
}

// Marca um item disponível como expirado.
function expirarItem(evento, id) {
  evento.preventDefault();
  const itens = carregarItens();
  const item = itens.find((i) => i.id === id);
  item.status = "expired";
  salvarItens(itens);
  location.href = "item.html?id=" + id + "&msg=" + encodeURIComponent("Item marcado como expirado.");
  return false;
}

// Registra a doação de um item expirado.
function registrarDoacao(evento, id) {
  evento.preventDefault();
  const form = evento.target;
  const itens = carregarItens();
  const item = itens.find((i) => i.id === id);
  item.status = "donated";
  item.doacaoInstituicao = form.instituicao.value.trim();
  item.doacaoData = new Date().toISOString();
  salvarItens(itens);
  location.href = "item.html?id=" + id + "&msg=" + encodeURIComponent("Doação registrada com sucesso.");
  return false;
}

/* ====================== FORMULÁRIO (CADASTRAR / EDITAR) ====================== */

function opcoes(valores, atual, placeholder) {
  const primeira = placeholder ? `<option value="">${escaparHtml(placeholder)}</option>` : "";
  return primeira + valores.map((v) => `<option${ehSelecionado(atual, v)}>${escaparHtml(v)}</option>`).join("");
}

// Data de hoje no formato aaaa-mm-dd (valor inicial do campo de data).
function hoje() {
  return new Date().toLocaleDateString("en-CA");
}

// Monta o formulário de cadastrar ou editar. Se houver ?id= na URL, é edição.
function montarFormulario() {
  // Só funcionário acessa esta página.
  if (!estaLogado()) {
    location.href = "login.html?erro=" + encodeURIComponent("Entre para acessar a área administrativa.");
    return;
  }
  prepararPagina();

  const item = pegarParam("id") ? acharItem(pegarParam("id")) : null;
  const editando = Boolean(item);
  const v = item || { nome: "", categoria: "", descricao: "", local: "Bloco 10", data: hoje(), responsavel: USUARIO.nome, fotos: [] };

  const fotosAtuais = editando && v.fotos.length ? `
    <div class="existing-photo-grid">
      ${v.fotos.map((foto, i) => `
        <label class="existing-photo">
          <img src="${escaparHtml(foto)}" alt="Foto atual do item">
          <span><input type="checkbox" name="remover" value="${i}"> Remover foto</span>
        </label>`).join("")}
    </div>` : "";

  document.title = (editando ? "Editar item" : "Cadastrar item") + " | PUCPR";
  document.getElementById("conteudo").innerHTML = `
    <div class="form-page">
      <div class="container form-page-header">
        <a class="back-link" href="${editando ? "item.html?id=" + item.id : "index.html"}">${icone("arrowLeft", 19)} Voltar</a>
        <div>
          <span class="eyebrow">Área administrativa</span>
          <h1>${editando ? "Editar item" : "Cadastrar novo item"}</h1>
          <p>${editando ? "Atualize as informações públicas do objeto." : "Registre o objeto encontrado para disponibilizá-lo no catálogo."}</p>
        </div>
      </div>
      <form class="item-form container" id="form-item" onsubmit="return salvarFormulario(event)">
        <div class="form-alert" id="form-erro" style="display:none">${icone("info")}<span></span></div>
        <section class="form-card photo-section">
          <div class="section-heading">
            <span class="section-number">1</span>
            <div><h2>Fotos do item</h2><p>Inclua até 5 imagens claras, sem expor dados pessoais.</p></div>
          </div>
          ${fotosAtuais}
          <label class="native-file-upload">
            ${icone("image", 27)}
            <strong>${editando ? "Adicionar novas fotos" : "Selecionar fotos"}</strong>
            <span>PNG, JPG ou WEBP</span>
            <input type="file" name="fotos" accept="image/*" multiple>
          </label>
        </section>
        <section class="form-card">
          <div class="section-heading">
            <span class="section-number">2</span>
            <div><h2>Informações do item</h2><p>Use uma descrição objetiva para facilitar a identificação.</p></div>
          </div>
          <div class="form-grid">
            <label class="field field-wide">
              <span>Nome do item *</span>
              <input name="nome" value="${escaparHtml(v.nome)}" placeholder="Ex.: Copo térmico branco" required>
            </label>
            <label class="field">
              <span>Categoria *</span>
              <select name="categoria" required>${opcoes(categorias, v.categoria, "Selecione uma categoria")}</select>
            </label>
            <label class="field">
              <span>Localização *</span>
              <select name="local" required>${opcoes(locais, v.local)}</select>
            </label>
            <label class="field field-wide">
              <span>Descrição *</span>
              <textarea name="descricao" placeholder="Cor, marca, estado de conservação e informações úteis para a retirada..." maxlength="500" rows="5" required>${escaparHtml(v.descricao)}</textarea>
            </label>
          </div>
        </section>
        <section class="form-card">
          <div class="section-heading">
            <span class="section-number">3</span>
            <div><h2>Dados de controle</h2><p>Estas informações ajudam a equipe a manter a rastreabilidade.</p></div>
          </div>
          <div class="form-grid">
            <label class="field">
              <span>Data em que foi encontrado *</span>
              <input type="date" name="data" value="${escaparHtml(v.data)}" required>
            </label>
            <label class="field">
              <span>Responsável pelo registro *</span>
              <input name="responsavel" value="${escaparHtml(v.responsavel)}" required>
            </label>
          </div>
        </section>
        <div class="form-footer">
          <a class="button button-secondary" href="${editando ? "item.html?id=" + item.id : "index.html"}">Cancelar</a>
          <button class="button button-primary" type="submit">${icone("save", 18)} ${editando ? "Salvar alterações" : "Cadastrar item"}</button>
        </div>
      </form>
    </div>`;
}

// Lê um arquivo de imagem e devolve o conteúdo como texto (data URL) para salvar.
function lerFoto(arquivo) {
  return new Promise((resolve) => {
    const leitor = new FileReader();
    leitor.onload = () => resolve(leitor.result);
    leitor.readAsDataURL(arquivo);
  });
}

// Salva o item do formulário (novo ou editado). É async por causa da leitura das fotos.
async function salvarFormulario(evento) {
  evento.preventDefault();
  const form = evento.target;
  const itens = carregarItens();
  const editando = Boolean(pegarParam("id"));
  const item = editando ? itens.find((i) => i.id === Number(pegarParam("id"))) : null;

  // Monta a lista de fotos: mantém as antigas (menos as marcadas para remover) e soma as novas.
  let fotos = item ? [...item.fotos] : [];
  const remover = [...form.querySelectorAll('input[name="remover"]:checked')].map((c) => Number(c.value));
  fotos = fotos.filter((_, i) => !remover.includes(i));
  for (const arquivo of form.fotos.files) {
    fotos.push(await lerFoto(arquivo));
  }
  fotos = fotos.slice(0, 5);

  if (!fotos.length) return mostrarErroForm("Adicione ao menos uma foto do item.");

  const dados = {
    nome: form.nome.value.trim(),
    categoria: form.categoria.value,
    descricao: form.descricao.value.trim(),
    local: form.local.value,
    data: form.data.value,
    responsavel: form.responsavel.value.trim(),
    fotos
  };

  if (editando) {
    Object.assign(item, dados);
  } else {
    const novoId = itens.length ? Math.max(...itens.map((i) => i.id)) + 1 : 1;
    itens.push({ id: novoId, status: "available", ...dados });
  }
  salvarItens(itens);

  const id = editando ? item.id : itens[itens.length - 1].id;
  location.href = "item.html?id=" + id + "&msg=" + encodeURIComponent(editando ? "Item atualizado com sucesso." : "Item cadastrado com sucesso.");
  return false;
}

// Mostra a faixa de erro no topo do formulário.
function mostrarErroForm(texto) {
  const alerta = document.getElementById("form-erro");
  alerta.querySelector("span").textContent = texto;
  alerta.style.display = "";
  window.scrollTo(0, 0);
  return false;
}
