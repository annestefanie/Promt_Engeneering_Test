/* Perfil: aluguéis, multas e cartões */
if(Layout.init()){
 const panel=$('#panel'),tabs=document.querySelectorAll('.tab');let tab=location.hash.slice(1)||'alugueis';
 const film=id=>FILMS.find(f=>f.id===id);
 const label={alugado:'Alugado',comprado:'Comprado',reservado:'Na fila de reserva',devolvido:'Devolvido'};
 const rentalRow=r=>{const f=film(r.filmId),late=r.status==='alugado'&&r.due<Store.now();
  return `<li class="list-group-item bg-transparent d-flex flex-wrap justify-content-between gap-2 px-0"><div><span class="fw-medium">${f.t}</span> <small class="text-secondary">${f.y}</small>
   <div class="small text-secondary">${label[r.status]}${r.type==='buy'?'':' · '+money(f.r)}${r.pickupBy&&r.pickupBy>Store.now()?' · retire até '+fmt(r.pickupBy):''}${r.due?' · devolver até '+fmt(r.due):''}</div>
   ${late?'<div class="small text-danger" role="alert">Em atraso: a multa cresce a cada dia.</div>':''}</div>
   ${r.status==='alugado'?`<button data-back="${r.id}" class="btn btn-paper btn-sm align-self-start">Devolver</button>`:''}</li>`};
 const section=(t,rows,empty)=>`<h3 class="serif fs-2 mt-4 mb-1">${t}</h3>${rows.length?`<ul class="list-group list-group-flush">${rows.join('')}</ul>`:`<p class="text-secondary">${empty}</p>`}`;
 const views={
  alugueis(u){const by=s=>u.rentals.filter(r=>s.includes(r.status)).map(rentalRow);
   const others=FILMS.filter(f=>f.out).map(f=>`<li class="list-group-item bg-transparent px-0"><span class="fw-medium">${f.t}</span><div class="small text-secondary">Com outro cliente, volta em ${f.out} dias. ${money(f.r)} por ${CFG.RENT_DAYS} dias.</div></li>`);
   return section('Meus filmes',by(['alugado','comprado']),'Você não tem filmes agora. Visite a página Filmes.')+section('Reservados por mim',by(['reservado']),'Nenhuma reserva.')+section('Alugados por outros clientes',others,'Todos os filmes estão na prateleira.')+section('Histórico',by(['devolvido']),'Nada devolvido ainda.')},
  multas(u){const p=Store.pending(u),rows=u.fines.map(f=>`<tr><td>${esc(f.film)}</td><td>${f.days} dias</td><td>${money(f.amount)}</td><td>${f.status==='paga'?'✓ Quitada':'⚠ Pendente'}</td><td>${f.status==='pendente'?`<button data-pay="${f.id}" class="btn btn-ember btn-sm">Pagar</button>`:''}</td></tr>`).join('');
   return `<div class="alert ${u.banned?'alert-danger':'alert-success'} mt-4" role="${u.banned?'alert':'status'}"><p class="serif fs-3 mb-1">${u.banned?'Conta suspensa':'Conta em dia'}</p>
   Pendente: <strong>${money(p)}</strong>. A conta é suspensa quando as multas pendentes chegam a ${money(CFG.BAN_LIMIT)}${u.banned?'. Quite o que falta para reativar.':`; faltam ${money(Math.max(CFG.BAN_LIMIT-p,0)) }.`}</div>
   <h3 class="serif fs-2 mb-1">Minhas multas</h3><div class="table-responsive"><table class="table align-middle"><caption class="visually-hidden">Minhas multas</caption><thead><tr><th scope="col">Filme</th><th scope="col">Atraso</th><th scope="col">Valor</th><th scope="col">Situação</th><th scope="col"><span class="visually-hidden">Ação</span></th></tr></thead><tbody>${rows}</tbody></table></div>
   <h3 class="serif fs-2 mt-4 mb-1">Tabela de valores</h3><table class="table table-sm"><caption class="visually-hidden">Tabela de multas</caption><tbody>${FEE_TABLE.map(([a,b])=>`<tr><th scope="row" class="fw-normal">${a}</th><td>${b}</td></tr>`).join('')}</tbody></table>
   <div class="border border-secondary-subtle rounded p-3 mt-4 small" style="border-style:dashed!important"><p class="mb-2">Modo demonstração: simule o tempo passando para ver multas e banimento em ação.</p><button data-skip="5" class="btn btn-paper btn-sm">Avançar 5 dias</button></div>`},
  cartoes(u){return `<ul class="list-group list-group-flush mt-3">${u.cards.map(c=>`<li class="list-group-item bg-transparent d-flex justify-content-between px-0"><span>${c.brand} final ${c.last4} · ${esc(c.name)} · vence ${c.exp}</span><button data-delcard="${c.id}" class="btn btn-link btn-sm py-0">Remover</button></li>`).join('')||'<li class="list-group-item bg-transparent px-0 text-secondary">Nenhum cartão cadastrado.</li>'}</ul>
   <form id="card-form" class="row g-3 mt-3" novalidate><h3 class="serif fs-2 col-12 mb-0">Adicionar cartão (simulação, não use dados reais)</h3>
   ${[['num','Número do cartão','1234 5678 9012 3456','cc-number'],['cname','Nome no cartão','','cc-name'],['exp','Validade (MM/AA)','08/29','cc-exp'],['cvv','CVV','123','cc-csc']].map(([id,l,p,a])=>`<div class="col-sm-6"><label for="${id}" class="form-label small">${l}</label><input id="${id}" placeholder="${p}" autocomplete="${a}" class="form-control"></div>`).join('')}
   <p id="card-msg" class="col-12 text-danger mb-0" role="alert"></p><div class="col-12"><button class="btn btn-ember w-100 py-2">Salvar cartão</button></div></form>`}};
 const render=()=>{const u=Store.refresh(Store.user());
  tabs.forEach(t=>{const on=t.dataset.tab===tab;t.setAttribute('aria-selected',on);t.classList.toggle('active',on)});
  panel.innerHTML=views[tab](u);Layout.header();Layout.renderCart();
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
