/* Perfil: aluguéis, multas e cartões */
if(Layout.init()){
 const panel=$('#panel'),tabs=document.querySelectorAll('.tab');let tab=location.hash.slice(1)||'alugueis';
 const film=id=>FILMS.find(f=>f.id===id);
 const label={alugado:'Alugado',comprado:'Comprado',reservado:'Na fila de reserva',devolvido:'Devolvido'};
 const rentalRow=(r,u)=>{const f=film(r.filmId),late=r.status==='alugado'&&r.due<Store.now();
  return `<li class="flex flex-wrap justify-between gap-2 py-3 border-b border-paper/15"><div><p class="font-medium">${f.t} <span class="text-sm text-paper/70">${f.y}</span></p>
   <p class="text-sm text-paper/70">${label[r.status]}${r.type==='buy'?'':' · '+money(f.r)}${r.pickupBy&&r.pickupBy>Store.now()?' · retire até '+fmt(r.pickupBy):''}${r.due?' · devolver até '+fmt(r.due):''}</p>
   ${late?'<p class="text-sm text-ember" role="alert">Em atraso: a multa cresce a cada dia.</p>':''}</div>
   ${r.status==='alugado'?`<button data-back="${r.id}" class="border border-paper/40 px-3 py-1 text-sm hover:bg-paper hover:text-ink">Devolver</button>`:''}</li>`};
 const section=(t,rows,empty)=>`<h3 class="serif text-2xl mt-8 mb-1">${t}</h3>${rows.length?`<ul>${rows.join('')}</ul>`:`<p class="text-paper/70">${empty}</p>`}`;
 const views={
  alugueis(u){const mine=u.rentals.filter(r=>['alugado','comprado'].includes(r.status)),res=u.rentals.filter(r=>r.status==='reservado'),old=u.rentals.filter(r=>r.status==='devolvido');
   const others=FILMS.filter(f=>f.out).map(f=>`<li class="py-3 border-b border-paper/15"><p class="font-medium">${f.t}</p><p class="text-sm text-paper/70">Com outro cliente, volta em ${f.out} dias. ${money(f.r)} por ${CFG.RENT_DAYS} dias.</p></li>`);
   return section('Meus filmes',mine.map(r=>rentalRow(r,u)),'Você não tem filmes agora. Visite a página Filmes.')+section('Reservados por mim',res.map(r=>rentalRow(r,u)),'Nenhuma reserva.')+section('Alugados por outros clientes',others,'Todos os filmes estão na prateleira.')+section('Histórico',old.map(r=>rentalRow(r,u)),'Nada devolvido ainda.')},
  multas(u){const p=Store.pending(u),limit=CFG.BAN_LIMIT;
   const rows=u.fines.map(f=>`<tr class="border-b border-paper/15"><td class="py-2">${esc(f.film)}</td><td>${f.days} dias</td><td>${money(f.amount)}</td><td>${f.status==='paga'?'✓ Quitada':'⚠ Pendente'}</td><td>${f.status==='pendente'?`<button data-pay="${f.id}" class="bg-ember text-ink px-3 py-1 text-sm font-bold">Pagar</button>`:''}</td></tr>`).join('');
   return `<div class="mt-6 p-4 border ${u.banned?'border-blood bg-blood/30':'border-teal/50'}" role="${u.banned?'alert':'status'}"><p class="serif text-2xl">${u.banned?'Conta suspensa':'Conta em dia'}</p>
   <p>Pendente: <strong>${money(p)}</strong>. A conta é suspensa quando as multas pendentes chegam a ${money(limit)}${u.banned?'. Quite o que falta para reativar.':`; faltam ${money(Math.max(limit-p,0))}.`}</p></div>`
   +section('Minhas multas',[],'').replace('<p class="text-paper/70"></p>',`<div class="overflow-x-auto"><table class="w-full text-left text-sm"><caption class="sr-only">Minhas multas</caption><thead><tr class="border-b border-paper/30"><th class="py-2" scope="col">Filme</th><th scope="col">Atraso</th><th scope="col">Valor</th><th scope="col">Situação</th><th scope="col"><span class="sr-only">Ação</span></th></tr></thead><tbody>${rows}</tbody></table></div>`)
   +`<h3 class="serif text-2xl mt-8 mb-1">Tabela de valores</h3><table class="w-full text-left text-sm"><caption class="sr-only">Tabela de multas</caption><tbody>${FEE_TABLE.map(([a,b])=>`<tr class="border-b border-paper/15"><th scope="row" class="py-2 font-normal">${a}</th><td>${b}</td></tr>`).join('')}</tbody></table>`
   +`<div class="mt-8 p-4 border border-dashed border-paper/30 text-sm"><p>Modo demonstração: simule o tempo passando para ver as multas e o banimento em ação.</p><button data-skip="5" class="border border-paper/40 px-3 py-1 mt-2 hover:bg-paper hover:text-ink">Avançar 5 dias</button></div>`},
  cartoes(u){return `<ul class="mt-6">${u.cards.map(c=>`<li class="flex justify-between py-3 border-b border-paper/15"><span>${c.brand} final ${c.last4} · ${esc(c.name)} · vence ${c.exp}</span><button data-delcard="${c.id}" class="underline text-sm hover:text-ember">Remover</button></li>`).join('')||'<li class="text-paper/70">Nenhum cartão cadastrado.</li>'}</ul>
   <form id="card-form" class="grid sm:grid-cols-2 gap-3 mt-6" novalidate><h3 class="serif text-2xl sm:col-span-2">Adicionar cartão (simulação, não use dados reais)</h3>
   ${[['num','Número do cartão','1234 5678 9012 3456','cc-number'],['cname','Nome no cartão','','cc-name'],['exp','Validade (MM/AA)','08/29','cc-exp'],['cvv','CVV','123','cc-csc']].map(([id,l,p,a])=>`<div><label for="${id}" class="block text-sm mb-1">${l}</label><input id="${id}" placeholder="${p}" autocomplete="${a}" class="w-full bg-ink border border-paper/40 p-2"></div>`).join('')}
   <p id="card-msg" class="sm:col-span-2 text-ember" role="alert"></p><button class="bg-ember text-ink font-bold py-2 sm:col-span-2 hover:bg-paper transition-colors">Salvar cartão</button></form>`}};
 const render=()=>{const u=Store.refresh(Store.user());
  tabs.forEach(t=>t.setAttribute('aria-selected',t.dataset.tab===tab));panel.innerHTML=views[tab](u);Layout.header();Layout.renderCart();
  const f=$('#card-form');if(f)f.onsubmit=e=>{e.preventDefault();const err=Store.addCard($('#num').value,$('#cname').value,$('#exp').value,$('#cvv').value);
   if(err)$('#card-msg').textContent=err;else{Layout.toast('Cartão salvo.');render()}}};
 tabs.forEach(t=>t.onclick=()=>{tab=t.dataset.tab;history.replaceState(null,'','#'+tab);render()});
 panel.onclick=e=>{const d=e.target.closest('button')?.dataset;if(!d)return;
  if(d.back){Store.giveBack(d.back);Layout.toast('Devolução registrada.');render()}
  if(d.pay){const err=Store.payFine(d.pay);Layout.toast(err||'Multa quitada. Obrigado!',!!err);render()}
  if(d.skip){Store.advance(+d.skip);Layout.toast('Passaram-se 5 dias.');render()}
  if(d.delcard){const u=Store.user();u.cards=u.cards.filter(c=>c.id!==d.delcard);Store.save(u);render()}};
 $('#hello').textContent=Store.user().name;
 if(!views[tab])tab='alugueis';render();
}
