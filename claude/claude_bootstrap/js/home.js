/* Home: busca, filtros por gênero, lista de desejos, aluguel e compra */
if(Layout.init()){
 const grid=$('#grid'),state={q:'',g:'Todos',wish:false},genres=['Todos',...new Set(FILMS.map(f=>f.g))];
 $('#chips').innerHTML=genres.map(g=>`<button class="chip btn btn-paper btn-sm" aria-pressed="${g==='Todos'}" data-g="${g}">${g}</button>`).join('');
 $('#collage').insertAdjacentHTML('afterbegin',FILMS.slice(0,10).map((f,i)=>{const a=i/10*Math.PI*2-1.4;
  return `<div class="position-absolute" style="left:${50+40*Math.cos(a)}%;top:${50+40*Math.sin(a)}%;transform:translate(-50%,-50%) rotate(${(i%5-2)*9}deg)">${poster(f)}</div>`}).join(''));
 const card=(f,u)=>{const wished=u.wish.includes(f.id);
  return `<li class="col film"><div class="position-relative">${poster(f)}
   <button data-wish="${f.id}" aria-pressed="${wished}" aria-label="Lista de desejos: ${f.t}" class="btn btn-dark btn-sm position-absolute top-0 end-0 m-2 ${wished?'text-danger':''}">${wished?'♥':'♡'}</button></div>
   <h3 class="fs-6 fw-medium mt-3 mb-0">${f.t}</h3><p class="small text-secondary mb-1">${f.y}, ${f.d}</p>
   ${f.out?`<p class="small mb-1" style="color:var(--teal)">Com outro cliente. Volta em ${f.out} dias.</p>`:''}
   <div class="d-flex flex-wrap gap-2">
    ${f.out?`<button data-reserve="${f.id}" class="btn btn-teal btn-sm">Reservar</button>`:`<button data-cart="${f.id}" data-type="rent" class="btn btn-ember btn-sm">Alugar ${money(f.r)}</button>`}
    <button data-cart="${f.id}" data-type="buy" class="btn btn-paper btn-sm">Comprar ${money(f.b)}</button>
    <button data-info="${f.id}" class="btn btn-link btn-sm px-0">Detalhes</button></div></li>`};
 const render=()=>{const u=Store.user(),q=state.q.toLowerCase();
  const list=FILMS.filter(f=>(state.g==='Todos'||f.g===state.g)&&(!state.wish||u.wish.includes(f.id))&&(f.t+f.d).toLowerCase().includes(q));
  grid.innerHTML=list.length?list.map(f=>card(f,u)).join(''):`<li class="col-12 text-secondary">Nenhum filme encontrado. Tente outro título ou limpe os filtros.</li>`;
  $('#count').textContent=`${list.length} de ${FILMS.length} filmes`;
  document.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed',c.dataset.g===state.g))};
 $('#search').oninput=e=>{state.q=e.target.value;render()};
 $('#wish-filter').onclick=e=>{state.wish=!state.wish;e.target.setAttribute('aria-pressed',state.wish);render()};
 $('#chips').onclick=e=>{if(e.target.dataset.g){state.g=e.target.dataset.g;render()}};
 grid.onclick=e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.wish){const on=Store.toggleWish(+d.wish);Layout.toast(on?'Adicionado à sua lista.':'Removido da sua lista.');render()}
  if(d.cart){const err=Store.addCart(+d.cart,d.type);Layout.toast(err||'Adicionado ao carrinho.',!!err);Layout.renderCart()}
  if(d.reserve){const err=Store.reserve(+d.reserve);Layout.toast(err||'Reserva feita. Avisaremos quando o filme voltar.',!!err)}
  if(d.info){const f=FILMS.find(x=>x.id===+d.info);Layout.modal(`<h2 class="serif fs-2">${f.t}</h2><p class="text-secondary">${f.y}, direção de ${f.d}. ${f.g}.</p><p>${f.s}</p><p class="small">Aluguel de ${CFG.RENT_DAYS} dias: ${money(f.r)}. Compra: ${money(f.b)}.</p><button class="btn btn-paper" data-bs-dismiss="modal">Fechar</button>`)}};
 $('#user-name').textContent=Store.user().name.split(' ')[0];
 render();
}
