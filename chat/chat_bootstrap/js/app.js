(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const money = value => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const STORAGE_KEY = "lostWildBootstrapState";
  const initialMovies = [
    {id:1,title:"Persona",year:1966,director:"Ingmar Bergman",genre:"Drama",format:["DVD","Online"],rent:7.5,buy:24.9,description:"Duas mulheres, uma ilha e as fronteiras frágeis entre identidade, silêncio e representação.",color:"#54877a",rare:true},
    {id:2,title:"In the Mood for Love",year:2000,director:"Wong Kar-wai",genre:"Romance",format:["DVD","Online"],rent:8,buy:29.9,description:"Dois vizinhos descobrem uma intimidade delicada em meio à solidão de Hong Kong.",color:"#9a4430",rare:true},
    {id:3,title:"Stalker",year:1979,director:"Andrei Tarkovsky",genre:"Ficção científica",format:["DVD"],rent:9,buy:34.9,description:"Uma travessia hipnótica por uma zona misteriosa onde desejos parecem ganhar forma.",color:"#5c7861",rare:true},
    {id:4,title:"Cléo de 5 à 7",year:1962,director:"Agnès Varda",genre:"Drama",format:["DVD","Online"],rent:6.5,buy:22.9,description:"Em tempo quase real, uma cantora atravessa Paris enquanto espera uma notícia decisiva.",color:"#8c9b75"},
    {id:5,title:"Tokyo Story",year:1953,director:"Yasujirō Ozu",genre:"Drama",format:["DVD","Online"],rent:6,buy:21.9,description:"Um casal idoso visita os filhos em uma história quieta sobre distância e afeto.",color:"#607f85"},
    {id:6,title:"The Red Shoes",year:1948,director:"Michael Powell, Emeric Pressburger",genre:"Musical",format:["DVD"],rent:7,buy:26.9,description:"Uma bailarina se vê dividida entre a arte, o amor e uma ambição sem descanso.",color:"#a13a26"},
    {id:7,title:"A Brighter Summer Day",year:1991,director:"Edward Yang",genre:"Drama",format:["DVD"],rent:10,buy:39.9,description:"Juventude, violência e identidade em Taiwan no início dos anos 1960.",color:"#5c7d8a",rare:true},
    {id:8,title:"The 400 Blows",year:1959,director:"François Truffaut",genre:"Drama",format:["DVD","Online"],rent:6.5,buy:22.9,description:"Um retrato inquieto da infância e de um menino tentando encontrar seu lugar.",color:"#7a8e7d"},
    {id:9,title:"House",year:1977,director:"Nobuhiko Obayashi",genre:"Terror",format:["DVD"],rent:8,buy:29.9,description:"Uma casa de férias transforma-se num pesadelo pop, surreal e deliciosamente estranho.",color:"#7b3c2e",rare:true},
    {id:10,title:"Paris, Texas",year:1984,director:"Wim Wenders",genre:"Drama",format:["DVD","Online"],rent:7.5,buy:27.9,description:"Um homem reaparece no deserto e tenta reconstruir laços que o tempo desfez.",color:"#a26b45"},
    {id:11,title:"The Apartment",year:1960,director:"Billy Wilder",genre:"Comédia",format:["DVD","Online"],rent:6,buy:21.9,description:"Um funcionário empresta seu apartamento aos chefes e acaba preso numa trama afetiva.",color:"#8b8065"},
    {id:12,title:"Suspiria",year:1977,director:"Dario Argento",genre:"Terror",format:["DVD"],rent:7.5,buy:27.9,description:"Uma escola de dança esconde forças inquietantes sob cores saturadas e música hipnótica.",color:"#9c2e24",rare:true},
    {id:13,title:"Breathless",year:1960,director:"Jean-Luc Godard",genre:"Crime",format:["DVD","Online"],rent:6.5,buy:23.9,description:"Um pequeno criminoso e uma estudante vivem um romance à deriva pelas ruas de Paris.",color:"#687b6d"},
    {id:14,title:"The Night of the Hunter",year:1955,director:"Charles Laughton",genre:"Suspense",format:["DVD"],rent:7,buy:25.9,description:"Dois irmãos fogem de um pregador ameaçador num conto sombrio quase expressionista.",color:"#314d49",rare:true},
    {id:15,title:"In the Realm of the Senses",year:1976,director:"Nagisa Ōshima",genre:"Drama",format:["DVD"],rent:9,buy:34.9,description:"Uma obra provocadora e controversa sobre obsessão e limites.",color:"#8a493e",rare:true},
    {id:16,title:"The General",year:1926,director:"Buster Keaton, Clyde Bruckman",genre:"Comédia",format:["DVD","Online"],rent:5.5,buy:19.9,description:"Uma comédia muda de precisão impressionante, movida por locomotivas e invenção.",color:"#77796c"},
    {id:17,title:"Do the Right Thing",year:1989,director:"Spike Lee",genre:"Drama",format:["DVD","Online"],rent:7,buy:26.9,description:"Um dia quente no Brooklyn expõe tensões raciais e comunitárias prestes a explodir.",color:"#a44d2b"},
    {id:18,title:"Wings of Desire",year:1987,director:"Wim Wenders",genre:"Fantasia",format:["DVD","Online"],rent:7.5,buy:27.9,description:"Anjos observam a vida cotidiana de Berlim até que um deles deseja sentir o mundo.",color:"#537d82"},
    {id:19,title:"The Wicker Man",year:1973,director:"Robin Hardy",genre:"Terror",format:["DVD"],rent:8,buy:29.9,description:"Uma investigação numa ilha remota leva a um ritual comunitário perturbador.",color:"#7c8b50",rare:true},
    {id:20,title:"Cinema Paradiso",year:1988,director:"Giuseppe Tornatore",genre:"Drama",format:["DVD","Online"],rent:6.5,buy:23.9,description:"A amizade entre um menino e o projecionista da vila se torna uma carta de amor ao cinema.",color:"#8d673c"}
  ];

  const freshState = () => ({
    user: null, wishes: [], cart: [], orders: [], payments: [],
    fines: [], nextOrderId: 1
  });
  let state = loadState();
  let authMode = "login";
  let activeMovieId = null;
  const movieModal = () => bootstrap.Modal.getOrCreateInstance($("#movieModal"));
  const editModal = () => bootstrap.Modal.getOrCreateInstance($("#editNameModal"));

  function loadState() {
    try { return { ...freshState(), ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") }; }
    catch { return freshState(); }
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch { showToast("Não foi possível salvar neste navegador."); }
  }
  function showToast(message) {
    $("#toastMessage").textContent = message;
    bootstrap.Toast.getOrCreateInstance($("#appToast"), { delay: 3200 }).show();
  }
  function escapeHtml(value = "") {
    return String(value).replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
  }
  function setAuthMode(mode) {
    authMode = mode;
    $$("[data-auth-mode]").forEach(button => {
      const active = button.dataset.authMode === mode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    $("#nameField").hidden = mode !== "signup";
    $("#authTitle").innerHTML = mode === "signup" ? "Encontre seu<br><em>lugar no arquivo.</em>" : "Entre para<br><em>ficar mais um pouco.</em>";
    $("#authSubmit").innerHTML = mode === "signup" ? "Criar minha conta <span aria-hidden=\"true\">↗</span>" : "Entrar no arquivo <span aria-hidden=\"true\">↗</span>";
    $("#authPassword").setAttribute("autocomplete", mode === "signup" ? "new-password" : "current-password");
    $("#authError").hidden = true;
  }
  function enterApp(user) {
    state.user = user;
    saveState();
    $("#authScreen").hidden = true;
    $("#appShell").hidden = false;
    $("#userMenuButton").textContent = initials(user.name);
    updateAccountViews();
    renderAll();
    showView("home");
  }
  function initials(name = "Lost Wild") {
    return name.trim().split(/\s+/).slice(0, 2).map(part => part[0] || "").join("").toUpperCase();
  }
  function logout() {
    state.user = null;
    saveState();
    $("#appShell").hidden = true;
    $("#authScreen").hidden = false;
    $("#authPassword").value = "";
    setAuthMode("login");
    showToast("Você saiu da sua conta.");
  }
  function updateAccountViews() {
    const user = state.user || { name: "Pessoa leitora", email: "" };
    $("#profileName").textContent = user.name;
    $("#profileEmail").textContent = user.email;
    $("#profileAvatar").textContent = initials(user.name);
    $("#userMenuButton").textContent = initials(user.name);
  }
  function showView(view) {
    if (!state.user) return;
    $$(".view-section").forEach(section => section.hidden = section.id !== `view-${view}`);
    $$("[data-view]").forEach(link => {
      link.classList.toggle("active", link.dataset.view === view);
      if (link.classList.contains("nav-link")) link.setAttribute("aria-current", link.dataset.view === view ? "page" : "false");
    });
    const catalogue = $("#catalogue");
    if (view === "home") setTimeout(() => catalogue?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
    if (view === "wishlist") renderWishlist();
    if (view === "shelf") renderShelf();
    if (view === "profile") renderProfile();
    if (view === "fines") renderFines();
    if (view === "payments") renderPayments();
    const navCollapse = $("#mainNav");
    if (navCollapse.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
  }
  function getMovie(id) { return initialMovies.find(movie => movie.id === Number(id)); }
  function renderGenres() {
    const select = $("#genreFilter");
    const current = select.value;
    const genres = [...new Set(initialMovies.map(movie => movie.genre))].sort((a,b) => a.localeCompare(b, "pt-BR"));
    select.innerHTML = '<option value="all">Todos os gêneros</option>' + genres.map(genre => `<option value="${escapeHtml(genre)}">${escapeHtml(genre)}</option>`).join("");
    select.value = genres.includes(current) ? current : "all";
  }
  function movieCard(movie) {
    const wished = state.wishes.includes(movie.id);
    const format = movie.format.join(" · ");
    return `<div class="col-6 col-md-4 col-xl-3"><article class="movie-card">
      <div class="poster" style="--poster-glow:${movie.color}55;background:linear-gradient(140deg,${movie.color}55,#071716 85%)">
        <div class="poster-meta"><span>${movie.year}</span><span>${String(movie.id).padStart(2,"0")} / 20</span></div>
        <button class="wish-btn" type="button" data-wish="${movie.id}" aria-label="${wished ? "Remover" : "Adicionar"} ${escapeHtml(movie.title)} ${wished ? "dos" : "aos"} favoritos" aria-pressed="${wished}">${wished ? "♥" : "♡"}</button>
        <div class="poster-title">${escapeHtml(movie.title)}</div><span class="poster-number">LW—${String(movie.id).padStart(3,"0")}</span>
      </div>
      <div class="movie-info"><h3>${escapeHtml(movie.title)}</h3><p class="movie-director">${escapeHtml(movie.director)} · ${movie.year}</p>
        <div class="movie-tags"><span class="tag">${escapeHtml(movie.genre.toUpperCase())}</span><span class="tag">${format.toUpperCase()}</span>${movie.rare ? '<span class="tag">RARO ✳</span>' : ""}</div>
        <div class="movie-prices"><div><span class="price-label">ALUGAR</span><span class="price-value">${money(movie.rent)}</span></div><div><span class="price-label">COMPRAR</span><span class="price-value">${money(movie.buy)}</span></div></div>
        <div class="movie-actions"><button class="btn btn-outline-lw" data-details="${movie.id}" type="button">Detalhes</button><button class="btn btn-lw" data-add="${movie.id}" data-mode="rent" type="button">Alugar</button></div>
      </div></article></div>`;
  }
  function renderMovies() {
    const query = $("#searchInput").value.trim().toLocaleLowerCase("pt-BR");
    const genre = $("#genreFilter").value;
    const format = $("#formatFilter").value;
    const sort = $("#sortFilter").value;
    let movies = initialMovies.filter(movie => {
      const text = `${movie.title} ${movie.director} ${movie.year} ${movie.genre}`.toLocaleLowerCase("pt-BR");
      return text.includes(query) && (genre === "all" || movie.genre === genre) && (format === "all" || movie.format.includes(format));
    });
    if (sort === "title") movies.sort((a,b) => a.title.localeCompare(b.title));
    if (sort === "year") movies.sort((a,b) => a.year - b.year);
    if (sort === "price") movies.sort((a,b) => a.rent - b.rent);
    $("#movieGrid").innerHTML = movies.map(movieCard).join("");
    $("#emptyState").hidden = movies.length > 0;
    $("#resultsCount").textContent = `${movies.length} ${movies.length === 1 ? "título encontrado" : "títulos encontrados"}`;
  }
  function renderWishlist() {
    const movies = state.wishes.map(getMovie).filter(Boolean);
    $("#wishlistGrid").innerHTML = movies.map(movieCard).join("");
    $("#wishlistEmpty").hidden = movies.length > 0;
  }
  function toggleWish(id) {
    id = Number(id);
    state.wishes = state.wishes.includes(id) ? state.wishes.filter(item => item !== id) : [...state.wishes, id];
    saveState(); renderAll();
    showToast(state.wishes.includes(id) ? "Filme guardado na sua lista." : "Filme removido da sua lista.");
  }
  function showMovieDetails(id) {
    const movie = getMovie(id);
    if (!movie) return;
    activeMovieId = movie.id;
    $("#movieModalBody").innerHTML = `<div class="row g-4"><div class="col-12 col-md-5"><div class="movie-detail-poster" style="background:radial-gradient(ellipse at 65% 25%,${movie.color}77,transparent 35%),linear-gradient(130deg,${movie.color}88,#071716 85%)">${escapeHtml(movie.title)}</div></div><div class="col-12 col-md-7 movie-detail-copy"><p class="eyebrow">${movie.year} · ${escapeHtml(movie.genre)} · LW—${String(movie.id).padStart(3,"0")}</p><h2 id="movieModalTitle">${escapeHtml(movie.title)}</h2><p>Direção: ${escapeHtml(movie.director)}</p><p>${escapeHtml(movie.description)}</p><p class="eyebrow mt-4">FORMATOS DISPONÍVEIS</p><p>${movie.format.join(" · ")}</p>${movie.rare ? '<p class="status-pill status-pending">CÓPIA RARA DO ARQUIVO</p>' : ""}<div class="d-flex flex-wrap gap-2 mt-4"><button class="btn btn-lw" data-add="${movie.id}" data-mode="rent" data-close-modal="true">Alugar · ${money(movie.rent)}</button><button class="btn btn-outline-lw" data-add="${movie.id}" data-mode="buy" data-close-modal="true">Comprar · ${money(movie.buy)}</button><button class="btn btn-outline-lw" data-wish="${movie.id}">♡ Guardar</button></div></div></div>`;
    movieModal().show();
  }
  function addToCart(id, mode) {
    const movie = getMovie(id);
    if (!movie) return;
    const format = movie.format.includes("DVD") ? "DVD" : "Online";
    const existing = state.cart.find(item => item.id === movie.id && item.mode === mode && item.format === format);
    if (existing) existing.qty += 1;
    else state.cart.push({ id: movie.id, mode, format, qty: 1 });
    saveState(); renderCart(); renderHeaderCounts();
    showToast(`${movie.title} adicionado à sacola.`);
  }
  function renderCart() {
    const container = $("#cartItems");
    container.innerHTML = state.cart.map(item => {
      const movie = getMovie(item.id);
      const price = item.mode === "rent" ? movie.rent : movie.buy;
      return `<div class="cart-item"><div class="cart-thumb">${escapeHtml(movie.title)}</div><div><h3>${escapeHtml(movie.title)}</h3><p>${item.mode === "rent" ? "Aluguel" : "Compra"} · ${item.format} · qtd. ${item.qty}</p><button class="btn btn-link p-0 text-decoration-none" style="color:#a7c6a5;font-size:10px" data-remove-cart="${movie.id}" data-mode="${item.mode}" data-format="${item.format}">Remover</button></div><strong>${money(price * item.qty)}</strong></div>`;
    }).join("");
    const empty = state.cart.length === 0;
    $("#cartEmpty").hidden = !empty;
    $("#cartCheckout").hidden = empty;
    $("#cartSubtotal").textContent = money(cartTotal());
    renderHeaderCounts();
  }
  function cartTotal() {
    return state.cart.reduce((sum,item) => {
      const movie = getMovie(item.id);
      return sum + (item.mode === "rent" ? movie.rent : movie.buy) * item.qty;
    }, 0);
  }
  function checkout() {
    if (!state.cart.length) return;
    const orderId = state.nextOrderId++;
    const created = state.cart.map(item => {
      const movie = getMovie(item.id);
      return { ...item, title: movie.title, price: item.mode === "rent" ? movie.rent : movie.buy, status: item.mode === "rent" ? "Reservado" : "Compra confirmada", orderId };
    });
    state.orders.push(...created);
    state.cart = [];
    saveState(); renderAll();
    bootstrap.Offcanvas.getOrCreateInstance($("#cartPanel")).hide();
    showView("shelf");
    showToast(`Pedido demo #${String(orderId).padStart(4,"0")} confirmado. Retirada fictícia em até 3 dias úteis.`);
  }
  function renderHeaderCounts() {
    $("#wishCount").textContent = state.wishes.length;
    $("#cartCount").textContent = state.cart.reduce((sum,item) => sum + item.qty, 0);
    $("#fineNavBadge").textContent = state.fines.filter(fine => fine.status === "Pendente").length;
  }
  function renderShelf() {
    const orders = state.orders;
    $("#shelfStats").innerHTML = [
      ["TÍTULOS NA ESTANTE", orders.length],
      ["ALUGUÉIS ATIVOS", orders.filter(item => item.mode === "rent" && item.status !== "Devolvido").length],
      ["RESERVAS", orders.filter(item => item.status === "Reservado").length]
    ].map(([label,value]) => `<div class="col-6 col-lg-4"><div class="stat-card"><span>${label}</span><strong>${value}</strong></div></div>`).join("");
    $("#shelfTable").innerHTML = orders.map(order => `<tr><td>${escapeHtml(order.title)}</td><td>${order.mode === "rent" ? "Aluguel" : "Compra"} · ${order.format}</td><td><span class="status-pill ${order.status === "Reservado" ? "status-pending" : "status-paid"}">${order.status}</span>${order.mode === "rent" && order.status !== "Devolvido" ? `<div class="mt-2"><button class="btn btn-outline-lw py-1" data-return="${order.orderId}-${order.id}-${order.mode}">Registrar devolução</button></div>` : ""}</td><td>${order.mode === "rent" ? "Retirar em até 3 dias úteis" : "Disponível na sua estante"}</td><td>${money(order.price * order.qty)}</td></tr>`).join("");
    $("#shelfEmpty").hidden = orders.length > 0;
  }
  function registerReturn(key) {
    const [orderId,id,mode] = key.split("-");
    const order = state.orders.find(item => item.orderId === Number(orderId) && item.id === Number(id) && item.mode === mode && item.status !== "Devolvido");
    if (!order) return;
    order.status = "Devolvido";
    saveState(); renderShelf(); renderProfile();
    showToast("Devolução registrada no protótipo. Obrigado por cuidar da cópia.");
  }
  function renderProfile() {
    updateAccountViews();
    const orders = state.orders;
    const pending = state.fines.filter(fine => fine.status === "Pendente").reduce((sum,fine) => sum + fine.amount,0);
    $("#profileStats").innerHTML = [
      ["FILMES NA ESTANTE",orders.length],["FILMES FAVORITOS",state.wishes.length],["MULTAS PENDENTES",money(pending)]
    ].map(([label,value]) => `<div class="col-12 col-md-4"><div class="stat-card"><span>${label}</span><strong style="font-size:${typeof value === "string" ? "1.25rem" : "2rem"}">${value}</strong></div></div>`).join("");
  }
  function renderFines() {
    const pending = state.fines.filter(fine => fine.status === "Pendente");
    const paid = state.fines.filter(fine => fine.status === "Quitada");
    const total = pending.reduce((sum,fine) => sum + fine.amount,0);
    $("#fineSummary").innerHTML = [
      ["VALOR PENDENTE",money(total)],["QUITADAS",paid.length],["PENDÊNCIAS",pending.length]
    ].map(([label,value]) => `<div class="col-12 col-md-4"><div class="stat-card"><span>${label}</span><strong style="font-size:${label.includes("VALOR") ? "1.4rem" : "2rem"}">${value}</strong></div></div>`).join("");
    $("#fineList").innerHTML = state.fines.map(fine => `<div class="fine-item"><div><h3>${escapeHtml(fine.title)}</h3><p>${escapeHtml(fine.date)} · ${escapeHtml(fine.note)}</p><span class="status-pill ${fine.status === "Quitada" ? "status-paid" : "status-pending"} mt-2">${fine.status}</span></div><div class="fine-amount">${money(fine.amount)}${fine.status === "Pendente" ? `<button class="btn btn-outline-lw d-block mt-2 py-1" data-pay-fine="${fine.id}">Quitar demo</button><button class="btn btn-link d-block p-0 mt-2 text-decoration-none" style="color:#a7c6a5;font-size:10px" data-dispute-fine="${fine.id}">Contestar</button>` : "<small>REGISTRO ENCERRADO</small>"}</div></div>`).join("");
    $("#fineEmpty").hidden = state.fines.length > 0;
    renderHeaderCounts();
  }
  function payFine(id) {
    const fine = state.fines.find(item => item.id === Number(id));
    if (!fine || fine.status !== "Pendente") return;
    fine.status = "Quitada"; fine.note = "Quitação fictícia registrada";
    saveState(); renderFines(); renderProfile();
    showToast("Multa marcada como quitada no protótipo.");
  }
  function disputeFine(id) {
    const fine = state.fines.find(item => item.id === Number(id));
    if (!fine || fine.status !== "Pendente") return;
    fine.note = "Contestação solicitada — aguardando revisão";
    saveState(); renderFines();
    showToast("Contestação registrada. Em um serviço real, a cobrança ficaria em revisão.");
  }
  function renderPayments() {
    $("#paymentList").innerHTML = state.payments.map(payment => `<div class="payment-item"><div class="payment-chip">${escapeHtml(payment.brand)}</div><div class="payment-details"><strong>${escapeHtml(payment.name)}</strong><span>•••• ${escapeHtml(payment.last4)} · validade ${escapeHtml(payment.expiry)}</span></div><button class="btn btn-outline-lw py-1" data-remove-payment="${payment.id}">Remover</button></div>`).join("");
    $("#paymentEmpty").hidden = state.payments.length > 0;
  }
  function renderAll() {
    renderGenres(); renderMovies(); renderWishlist(); renderCart(); renderShelf(); renderProfile(); renderFines(); renderPayments(); renderHeaderCounts();
  }

  $("#authForm").addEventListener("submit", event => {
    event.preventDefault();
    const email = $("#authEmail").value.trim().toLowerCase();
    const password = $("#authPassword").value;
    const name = $("#authName").value.trim();
    const error = $("#authError");
    if (!$("#authForm").reportValidity()) return;
    if (password.length < 8) { error.textContent = "Sua senha precisa ter pelo menos 8 caracteres."; error.hidden = false; return; }
    const users = JSON.parse(localStorage.getItem("lostWildDemoUsers") || "[]");
    if (authMode === "signup") {
      if (!name) { error.textContent = "Digite seu nome para continuar."; error.hidden = false; return; }
      if (users.some(user => user.email === email)) { error.textContent = "Já existe uma conta demo com esse e-mail. Entre em vez disso."; error.hidden = false; return; }
      users.push({ name, email, password });
      localStorage.setItem("lostWildDemoUsers", JSON.stringify(users));
      enterApp({ name, email });
    } else {
      const user = users.find(item => item.email === email && item.password === password);
      if (!user) { error.textContent = "E-mail ou senha incorretos. Para testar, crie uma conta demo primeiro."; error.hidden = false; return; }
      enterApp({ name: user.name, email: user.email });
    }
  });
  $$("[data-auth-mode]").forEach(button => button.addEventListener("click", () => setAuthMode(button.dataset.authMode)));
  $("#googleLogin").addEventListener("click", () => enterApp({ name: "Visitante Google (demo)", email: "visitante@lostwild.demo" }));
  $("#logoutBtn").addEventListener("click", logout);
  $$("[data-view]").forEach(link => link.addEventListener("click", event => { event.preventDefault(); showView(link.dataset.view); }));
  ["searchInput","genreFilter","formatFilter","sortFilter"].forEach(id => $("#" + id).addEventListener(id === "searchInput" ? "input" : "change", renderMovies));
  document.addEventListener("click", event => {
    const wish = event.target.closest("[data-wish]");
    const add = event.target.closest("[data-add]");
    const details = event.target.closest("[data-details]");
    const removeCart = event.target.closest("[data-remove-cart]");
    const pay = event.target.closest("[data-pay-fine]");
    const dispute = event.target.closest("[data-dispute-fine]");
    const removePayment = event.target.closest("[data-remove-payment]");
    const returnBtn = event.target.closest("[data-return]");
    if (wish) { event.preventDefault(); toggleWish(wish.dataset.wish); if ($("#view-wishlist") && !$("#view-wishlist").hidden) renderWishlist(); }
    else if (add) { addToCart(add.dataset.add, add.dataset.mode || "rent"); if (add.dataset.closeModal) movieModal().hide(); }
    else if (details) showMovieDetails(details.dataset.details);
    else if (removeCart) {
      state.cart = state.cart.filter(item => !(item.id === Number(removeCart.dataset.removeCart) && item.mode === removeCart.dataset.mode && item.format === removeCart.dataset.format));
      saveState(); renderCart(); showToast("Item removido da sacola.");
    }
    else if (pay) payFine(pay.dataset.payFine);
    else if (dispute) disputeFine(dispute.dataset.disputeFine);
    else if (removePayment) {
      state.payments = state.payments.filter(item => item.id !== Number(removePayment.dataset.removePayment));
      saveState(); renderPayments(); showToast("Cartão fictício removido.");
    }
    else if (returnBtn) registerReturn(returnBtn.dataset.return);
  });
  $("#checkoutBtn").addEventListener("click", checkout);
  $("#editProfileBtn").addEventListener("click", () => { $("#newDisplayName").value = state.user?.name || ""; editModal().show(); });
  $("#editNameForm").addEventListener("submit", event => {
    event.preventDefault();
    const name = $("#newDisplayName").value.trim();
    if (!name || !state.user) return;
    state.user.name = name; saveState(); updateAccountViews(); editModal().hide(); showToast("Nome atualizado.");
  });
  $("#paymentForm").addEventListener("submit", event => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const number = $("#cardNumber").value.replace(/\s/g,"");
    if (!/^\d{16}$/.test(number)) { $("#paymentFeedback").textContent = "Use um número de teste com exatamente 16 dígitos."; return; }
    state.payments.push({ id: Date.now(), name: $("#cardName").value.trim(), last4: number.slice(-4), expiry: $("#cardExpiry").value, brand: $("#cardBrand").value });
    saveState(); renderPayments(); event.currentTarget.reset();
    $("#paymentFeedback").textContent = "Cartão de demonstração salvo localmente.";
  });

  if (state.user) {
    $("#authScreen").hidden = true;
    $("#appShell").hidden = false;
    updateAccountViews();
    renderAll();
    showView("home");
  } else {
    $("#authScreen").hidden = false;
    $("#appShell").hidden = true;
    setAuthMode("login");
  }
})();