/* Componentes compartilhados (Bootstrap): guarda de sessão, navbar, offcanvas do carrinho, toast e modal */
const $=(s,r=document)=>r.querySelector(s);
const Layout={
 root:document.body.dataset.root||'',
 page:document.body.dataset.page,
 init(){
  const u=Store.user(),r=this.root;
  if(this.page==='auth'&&u){location.href=r+'pages/home.html';return false}
  if(this.page!=='auth'&&!u){location.href=r+'index.html';return false}
  if(u){Store.refresh(u);this.header();this.cart()}
  $('#app-footer').innerHTML=`<footer class="container border-top mt-5 py-4 small text-secondary"><p class="serif fs-3 text-body mb-1">Lost Wild</p><p class="mb-0">${CFG.ADDRESS}. Site fictício, para demonstração.</p></footer>`;
  document.body.insertAdjacentHTML('beforeend',`<div id="toast" class="position-fixed bottom-0 start-50 translate-middle-x mb-3" style="z-index:2100" role="status" aria-live="polite"></div>
   <div class="modal fade" id="modal" tabindex="-1" aria-label="Detalhes"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-body p-4" id="modal-body"></div></div></div></div>`);
  return true},
 header(){
  const r=this.root,u=Store.user(),link=(f,t)=>`<li class="nav-item"><a class="nav-link px-0 ${this.page===f?'active border-bottom border-2 border-danger':''}" href="${r}pages/${f}.html" ${this.page===f?'aria-current="page"':''}>${t}</a></li>`;
  $('#app-header').innerHTML=`<header class="sticky-top bg-body border-bottom"><nav class="navbar py-2" aria-label="Principal"><div class="container flex-wrap gap-2">
   <a class="navbar-brand serif fs-2 halo m-0" href="${r}pages/home.html">Lost Wild</a>
   <ul class="navbar-nav flex-row gap-3 order-3 order-sm-2">${link('home','Filmes')}${link('perfil','Meu perfil')}${link('sobre','Sobre')}</ul>
   <div class="d-flex gap-2 order-2 order-sm-3"><button id="cart-open" class="btn btn-paper btn-sm" aria-label="Abrir carrinho">Carrinho <span id="cart-count" class="badge text-bg-danger">${u.cart.length}</span></button>
   <button id="logout" class="btn btn-link btn-sm">Sair</button></div></div></nav>
   ${u.banned?`<div class="alert alert-danger rounded-0 text-center mb-0 py-2 small" role="alert">Conta suspensa: você deve ${money(Store.pending(u))} em multas. Pague em <a class="alert-link" href="${r}pages/perfil.html#multas">Meu perfil, aba Multas</a>.</div>`:''}</header>`;
  $('#logout').onclick=()=>{Store.logout();location.href=r+'index.html'};
  $('#cart-open').onclick=()=>bootstrap.Offcanvas.getOrCreateInstance('#cart').show();
 },
 cart(){
  document.body.insertAdjacentHTML('beforeend',`<aside class="offcanvas offcanvas-end" id="cart" tabindex="-1" aria-labelledby="cart-title"><div class="offcanvas-header"><h2 id="cart-title" class="offcanvas-title serif fs-2">Seu carrinho</h2><button class="btn-close" data-bs-dismiss="offcanvas" aria-label="Fechar carrinho"></button></div><div class="offcanvas-body" id="cart-body"></div></aside>`);
  $('#cart').addEventListener('click',e=>{
   const rm=e.target.closest('[data-rm]');if(rm){Store.removeCart(+rm.dataset.rm);this.renderCart()}
   if(e.target.closest('#checkout'))this.checkout()});
  this.renderCart()},
 renderCart(){
  const u=Store.user(),items=u.cart.map(c=>{const f=FILMS.find(x=>x.id===c.filmId);
   return `<li class="list-group-item bg-transparent d-flex justify-content-between gap-3"><div><div class="fw-medium">${f.t}</div><small class="text-secondary">${c.type==='buy'?'Compra':'Aluguel de '+CFG.RENT_DAYS+' dias'}: ${money(c.type==='buy'?f.b:f.r)}</small></div><button data-rm="${f.id}" class="btn btn-link btn-sm align-self-start" aria-label="Remover ${f.t}">Remover</button></li>`}).join('');
  $('#cart-count').textContent=u.cart.length;
  $('#cart-body').innerHTML=u.cart.length?`<ul class="list-group list-group-flush mb-3">${items}</ul><p class="d-flex justify-content-between fs-5"><span>Total</span><strong>${money(Store.cartTotal(u))}</strong></p>
   <label for="cart-card" class="form-label small">Pagar com</label>
   <select id="cart-card" class="form-select mb-2">${u.cards.length?u.cards.map(c=>`<option value="${c.id}">${c.brand} final ${c.last4}</option>`).join(''):'<option value="">Nenhum cartão cadastrado</option>'}</select>
   ${u.cards.length?'':`<p class="small">Cadastre um cartão em <a href="${this.root}pages/perfil.html#cartoes">Meu perfil</a>.</p>`}
   <button id="checkout" class="btn btn-ember w-100 py-2 mt-2">Finalizar pedido</button>`
   :`<p class="text-secondary">Seu carrinho está vazio. Escolha um filme para alugar ou comprar.</p>`},
 checkout(){
  const r=Store.checkout($('#cart-card').value);
  if(r.error)return this.toast(r.error,true);
  bootstrap.Offcanvas.getOrCreateInstance('#cart').hide();this.renderCart();
  this.modal(`<h2 class="serif fs-2">Pedido confirmado</h2><p>Pagamento de <strong>${money(r.total)}</strong> aprovado (simulação).</p>
  <p>Retire seus filmes em até <strong>${CFG.PICKUP_DAYS} dias</strong> em:</p><p class="border-start border-2 border-danger ps-3">${CFG.ADDRESS}</p>
  <p class="small text-secondary">Devolva os aluguéis ${CFG.RENT_DAYS} dias após a retirada. Depois disso há multa de ${money(CFG.LATE_FEE)} por dia.</p>
  <div class="d-flex flex-wrap gap-2 mt-3"><a href="${this.root}pages/perfil.html" class="btn btn-ember">Ver meus aluguéis</a><button class="btn btn-paper" data-bs-dismiss="modal">Continuar navegando</button></div>`)},
 toast(msg,err){const t=$('#toast');t.innerHTML=`<div class="alert ${err?'alert-danger':'alert-success'} shadow mb-0 py-2">${esc(msg)}</div>`;clearTimeout(this.tt);this.tt=setTimeout(()=>t.innerHTML='',4500)},
 modal(html){$('#modal-body').innerHTML=html;bootstrap.Modal.getOrCreateInstance('#modal').show()}
};
