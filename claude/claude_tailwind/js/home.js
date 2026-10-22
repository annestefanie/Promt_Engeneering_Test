/* Home: busca, filtros por gênero, lista de desejos, aluguel e compra */
if(Layout.init()){
 const grid=$('#grid'),state={q:'',g:'Todos',wish:false},genres=['Todos',...new Set(FILMS.map(f=>f.g))];
 $('#chips').innerHTML=genres.map(g=>`<button class="chip border border-paper/30 px-3 py-1 text-sm hover:border-teal transition-colors" aria-pressed="${g==='Todos'}" data-g="${g}">${g}</button>`).join('');
 /* colagem circular do hero */
 $('#collage').insertAdjacentHTML('afterbegin',FILMS.slice(0,10).map((f,i)=>{const a=i/10*Math.PI*2-1.4;
  return `<div style="position:absolute;left:${50+40*Math.cos(a)}%;top:${50+40*Math.sin(a)}%;transform:translate(-50%,-50%) rotate(${(i%5-2)*9}deg);width:0">${poster(f)}</div>`}).join(''));
 const card=(f,u)=>{const wished=u.wish.includes(f.id);
  return `<li class="film"><div class="relative">${poster(f)}
   <button data-wish="${f.id}" aria-pressed="${wished}" aria-label="Lista de desejos: ${f.t}" class="absolute top-2 right-2 bg-ink/80 w-9 h-9 grid place-items-center text-lg ${wished?'text-ember':'text-paper'} hover:text-ember transition-colors">${wished?'♥':'♡'}</button></div>
   <h3 class="mt-3 font-medium leading-tight">${f.t}</h3><p class="text-sm text-paper/70">${f.y}, ${f.d}</p>
   ${f.out?`<p class="text-sm text-teal mt-1">Com outro cliente. Volta em ${f.out} dias.</p>`:''}
   <div class="flex flex-wrap gap-2 mt-2">
    ${f.out?`<button data-reserve="${f.id}" class="border border-teal text-teal px-3 py-1 text-sm hover:bg-teal hover:text-ink transition-colors">Reservar</button>`
    :`<button data-cart="${f.id}" data-type="rent" class="bg-ember text-ink px-3 py-1 text-sm font-bold hover:bg-paper transition-colors">Alugar ${money(f.r)}</button>`}
    <button data-cart="${f.id}" data-type="buy" class="border border-paper/40 px-3 py-1 text-sm hover:bg-paper hover:text-ink transition-colors">Comprar ${money(f.b)}</button>
    <button data-info="${f.id}" class="underline text-sm">Detalhes</button></div></li>`};
 const render=()=>{const u=Store.user(),q=state.q.toLowerCase();
  const list=FILMS.filter(f=>(state.g==='Todos'||f.g===state.g)&&(!state.wish||u.wish.includes(f.id))&&(f.t+f.d).toLowerCase().includes(q));
  grid.innerHTML=list.length?list.map(f=>card(f,u)).join(''):`<li class="col-span-full text-paper/70">Nenhum filme encontrado. Tente outro título ou limpe os filtros.</li>`;
  $('#count').textContent=`${list.length} de ${FILMS.length} filmes`;
  document.querySelectorAll('.chip').forEach(c=>{const on=c.dataset.g===state.g;c.setAttribute('aria-pressed',on);c.classList.toggle('bg-paper',on);c.classList.toggle('text-ink',on)})};
 $('#search').oninput=e=>{state.q=e.target.value;render()};
 $('#wish-filter').onclick=e=>{state.wish=!state.wish;e.target.setAttribute('aria-pressed',state.wish);render()};
 $('#chips').onclick=e=>{if(e.target.dataset.g){state.g=e.target.dataset.g;render()}};
 grid.onclick=e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.wish){const on=Store.toggleWish(+d.wish);Layout.toast(on?'Adicionado à sua lista.':'Removido da sua lista.');render()}
  if(d.cart){const err=Store.addCart(+d.cart,d.type);Layout.toast(err||'Adicionado ao carrinho.',!!err);Layout.renderCart()}
  if(d.reserve){const err=Store.reserve(+d.reserve);Layout.toast(err||'Reserva feita. Avisaremos quando o filme voltar.',!!err)}
  if(d.info){const f=FILMS.find(x=>x.id===+d.info);Layout.modal(`<h2 class="serif text-3xl">${f.t}</h2><p class="text-paper/70 mb-3">${f.y}, direção de ${f.d}. ${f.g}.</p><p>${f.s}</p><p class="mt-3 text-sm">Aluguel de ${CFG.RENT_DAYS} dias: ${money(f.r)}. Compra: ${money(f.b)}.</p><button class="border border-paper/40 px-4 py-2 mt-4" onclick="this.closest('dialog').close()">Fechar</button>`)}};
 $('#user-name').textContent=Store.user().name.split(' ')[0];
 render();
}
