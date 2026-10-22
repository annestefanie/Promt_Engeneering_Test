/* Componentes compartilhados: guarda de sessão, cabeçalho, carrinho, toast e modal */
const $=(s,r=document)=>r.querySelector(s);
const Layout={
 root:document.body.dataset.root||'',
 page:document.body.dataset.page,
 init(){
  const u=Store.user(),r=this.root;
  if(this.page==='auth'&&u){location.href=r+'pages/home.html';return false}
  if(this.page!=='auth'&&!u){location.href=r+'index.html';return false}
  if(u){Store.refresh(u);this.header();this.cart()}
  $('#app-footer').innerHTML=`<footer class="border-t border-paper/15 mt-24 px-5 py-10 text-sm text-paper/70"><p class="serif text-2xl text-paper">Lost Wild</p><p>${CFG.ADDRESS}</p><p>Site fictício, criado para fins de demonstração.</p></footer>`;
  const live=document.createElement('div');live.id='toast';live.setAttribute('role','status');live.setAttribute('aria-live','polite');
  live.className='fixed bottom-4 left-1/2 -translate-x-1/2 z-[80] max-w-[90%]';document.body.append(live);
  const dlg=document.createElement('dialog');dlg.id='modal';document.body.append(dlg);
  return true},
 header(){
  const r=this.root,u=Store.user(),link=(f,t)=>`<a href="${r}pages/${f}.html" class="py-2 border-b-2 ${this.page===f?'border-ember':'border-transparent'} hover:border-teal transition-colors" ${this.page===f?'aria-current="page"':''}>${t}</a>`;
  $('#app-header').innerHTML=`<header class="sticky top-0 z-40 bg-ink/90 backdrop-blur border-b border-paper/15">
  <div class="flex items-center justify-between gap-3 px-5 py-3 max-w-6xl mx-auto">
   <a href="${r}pages/home.html" class="serif text-3xl halo">Lost Wild</a>
   <nav aria-label="Principal" class="flex gap-4 sm:gap-6 text-sm">${link('home','Filmes')}${link('perfil','Meu perfil')}${link('sobre','Sobre')}</nav>
   <div class="flex items-center gap-2">
    <button id="cart-open" class="border border-paper/40 px-3 py-2 text-sm hover:bg-paper hover:text-ink transition-colors" aria-label="Abrir carrinho">Carrinho <span id="cart-count">${u.cart.length}</span></button>
    <button id="logout" class="px-3 py-2 text-sm underline underline-offset-4 hover:text-ember">Sair</button>
   </div></div>
  ${u.banned?`<p class="bg-blood text-paper text-center text-sm py-2 px-4" role="alert">Conta suspensa: você deve ${money(Store.pending(u))} em multas. Pague em <a class="underline" href="${r}pages/perfil.html#multas">Meu perfil, aba Multas</a> para voltar a alugar.</p>`:''}</header>`;
  $('#logout').onclick=()=>{Store.logout();location.href=r+'index.html'};
 },
 cart(){
  const aside=document.createElement('aside');aside.id='cart';aside.setAttribute('aria-label','Carrinho');aside.hidden=false;
  aside.className='fixed right-0 top-0 h-full w-full max-w-md bg-[#0b110c] border-l border-paper/20 z-50 p-5 overflow-y-auto translate-x-full invisible';
  document.body.append(aside);
  $('#cart-open').onclick=()=>this.toggleCart(true);
  aside.addEventListener('click',e=>{
   if(e.target.closest('#cart-close'))this.toggleCart(false);
   const rm=e.target.closest('[data-rm]');if(rm){Store.removeCart(+rm.dataset.rm);this.renderCart()}
   if(e.target.closest('#checkout'))this.checkout()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')this.toggleCart(false)});
  this.renderCart()},
 toggleCart(open){const a=$('#cart');a.classList.toggle('translate-x-full',!open);a.classList.toggle('invisible',!open);if(open){this.renderCart();$('#cart-close').focus()}},
 renderCart(){
  const u=Store.user(),items=u.cart.map(c=>{const f=FILMS.find(x=>x.id===c.filmId);
   return `<li class="flex justify-between gap-3 py-3 border-b border-paper/15"><div><p class="font-medium">${f.t}</p><p class="text-sm text-paper/70">${c.type==='buy'?'Compra':'Aluguel de '+CFG.RENT_DAYS+' dias'} — ${money(c.type==='buy'?f.b:f.r)}</p></div><button data-rm="${f.id}" class="text-sm underline hover:text-ember" aria-label="Remover ${f.t}">Remover</button></li>`}).join('');
  $('#cart-count').textContent=u.cart.length;
  $('#cart').innerHTML=`<div class="flex justify-between items-center mb-4"><h2 class="serif text-3xl">Seu carrinho</h2><button id="cart-close" class="border border-paper/40 px-3 py-1">Fechar</button></div>
  ${u.cart.length?`<ul>${items}</ul><p class="flex justify-between text-lg my-4"><span>Total</span><strong>${money(Store.cartTotal(u))}</strong></p>
  <label for="cart-card" class="block text-sm mb-1">Pagar com</label>
  <select id="cart-card" class="w-full bg-ink border border-paper/40 p-2 mb-4">${u.cards.length?u.cards.map(c=>`<option value="${c.id}">${c.brand} final ${c.last4}</option>`).join(''):'<option value="">Nenhum cartão cadastrado</option>'}</select>
  ${u.cards.length?'':`<p class="text-sm mb-3">Cadastre um cartão em <a class="underline" href="${this.root}pages/perfil.html#cartoes">Meu perfil</a>.</p>`}
  <button id="checkout" class="w-full bg-ember text-ink font-bold py-3 hover:bg-paper transition-colors">Finalizar pedido</button>`
  :`<p class="text-paper/70">Seu carrinho está vazio. Escolha um filme para alugar ou comprar.</p>`}`},
 checkout(){
  const r=Store.checkout($('#cart-card').value);
  if(r.error)return this.toast(r.error,true);
  this.toggleCart(false);this.renderCart();
  this.modal(`<h2 class="serif text-3xl mb-2">Pedido confirmado</h2><p>Pagamento de <strong>${money(r.total)}</strong> aprovado (simulação).</p>
  <p class="mt-3">Retire seus filmes em até <strong>${CFG.PICKUP_DAYS} dias</strong> em:</p><p class="border-l-2 border-ember pl-3 my-2">${CFG.ADDRESS}</p>
  <p class="text-sm text-paper/70">Aluguéis devem ser devolvidos ${CFG.RENT_DAYS} dias após a retirada. Depois disso há multa de ${money(CFG.LATE_FEE)} por dia.</p>
  <div class="flex gap-3 mt-5"><a href="${this.root}pages/perfil.html" class="bg-ember text-ink px-4 py-2 font-bold">Ver meus aluguéis</a><button class="border border-paper/40 px-4 py-2" onclick="this.closest('dialog').close()">Continuar navegando</button></div>`)},
 toast(msg,err){const t=$('#toast');t.innerHTML=`<p class="px-4 py-3 border ${err?'bg-blood border-ember':'bg-moss border-teal'} text-paper">${esc(msg)}</p>`;clearTimeout(this.tt);this.tt=setTimeout(()=>t.innerHTML='',4500)},
 modal(html){const d=$('#modal');d.innerHTML=html;d.showModal()}
};
