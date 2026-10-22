/* Camada de dados (localStorage) + regras de negócio: contas, carrinho, aluguéis, multas e banimento */
const LS={get:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set:(k,v)=>localStorage.setItem(k,JSON.stringify(v))};
const CFG={RENT_DAYS:5,PICKUP_DAYS:2,LATE_FEE:3,BAN_LIMIT:40,ADDRESS:'Rua das Fitas Perdidas, 77, Loja 3 — Brasília/DF (endereço fictício)'};
const FEE_TABLE=[['Atraso na devolução','R$ 3,00 por dia'],['Reserva não retirada em 2 dias','R$ 5,00'],['Disco ou case danificado','R$ 25,00'],['Perda ou extravio','Preço de compra + R$ 10,00']];
const DAY=864e5;
const money=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const fmt=t=>new Date(t).toLocaleDateString('pt-BR');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,9);

const Store={
 now:()=>Date.now()+LS.get('lw_offset',0)*DAY,
 advance:d=>LS.set('lw_offset',LS.get('lw_offset',0)+d),
 users:()=>LS.get('lw_users',{}),
 user(){return this.users()[LS.get('lw_session',null)]||null},
 save(u){const all=this.users();all[u.email]=u;LS.set('lw_users',all)},
 hash:s=>btoa(unescape(encodeURIComponent(s))),
 passErrors(p){const e=[];if(p.length<8)e.push('8 caracteres ou mais');if(!/[A-Z]/.test(p))e.push('uma letra maiúscula');if(!/\d/.test(p))e.push('um número');return e},

 register(name,email,pass){
  email=email.trim().toLowerCase();
  if(name.trim().length<2)return'Informe seu nome.';
  if(!/^\S+@\S+\.\S+$/.test(email))return'Informe um e-mail válido, como nome@email.com.';
  const miss=this.passErrors(pass);if(miss.length)return'A senha precisa ter: '+miss.join(', ')+'.';
  if(this.users()[email])return'Este e-mail já tem conta. Use a aba Entrar.';
  const n=this.now();
  this.save({email,name:name.trim(),pass:this.hash(pass),cards:[],wish:[],cart:[],banned:false,
   rentals:[{id:uid(),filmId:2,type:'rent',status:'alugado',pickupBy:n-DAY,due:n+2*DAY},{id:uid(),filmId:3,type:'rent',status:'reservado',pickupBy:null,due:null}],
   fines:[{id:uid(),film:'Psicose',days:3,amount:9,status:'paga'},{id:uid(),film:'Persona',days:4,amount:12,status:'pendente'}]});
  LS.set('lw_session',email);return null},
 login(email,pass){
  const u=this.users()[email.trim().toLowerCase()];
  if(!u||u.pass!==this.hash(pass))return'E-mail ou senha incorretos. Confira os dados e tente de novo.';
  LS.set('lw_session',u.email);return null},
 google(){const email='visitante@gmail.com';if(!this.users()[email])this.register('Visitante Google',email,'Google123');LS.set('lw_session',email)},
 logout(){localStorage.removeItem('lw_session')},

 /* multas: gera/atualiza multa de atraso e aplica banimento ao atingir o limite */
 refresh(u){
  const n=this.now();
  u.rentals.filter(r=>r.status==='alugado'&&r.due<n).forEach(r=>{
   const f=FILMS.find(x=>x.id===r.filmId),days=Math.ceil((n-r.due)/DAY),amount=Math.min(days*CFG.LATE_FEE,f.b);
   const old=u.fines.find(x=>x.rentalId===r.id);
   if(old){if(old.status==='pendente'){old.days=days;old.amount=amount}}
   else u.fines.push({id:uid(),rentalId:r.id,film:f.t,days,amount,status:'pendente'})});
  u.banned=this.pending(u)>=CFG.BAN_LIMIT;this.save(u);return u},
 pending:u=>u.fines.filter(f=>f.status==='pendente').reduce((s,f)=>s+f.amount,0),
 payFine(id){const u=this.user();
  if(!u.cards.length)return'Cadastre um cartão na aba Cartões para pagar.';
  u.fines.find(f=>f.id===id).status='paga';this.refresh(u);return null},

 addCart(filmId,type){const u=this.user();
  if(u.banned)return'Conta suspensa por multas. Quite as pendências no perfil para voltar a alugar.';
  if(u.cart.some(c=>c.filmId===filmId))return'Este filme já está no carrinho.';
  u.cart.push({filmId,type});this.save(u);return null},
 removeCart(filmId){const u=this.user();u.cart=u.cart.filter(c=>c.filmId!==filmId);this.save(u)},
 cartTotal:u=>u.cart.reduce((s,c)=>{const f=FILMS.find(x=>x.id===c.filmId);return s+(c.type==='buy'?f.b:f.r)},0),
 checkout(cardId){const u=this.user(),n=this.now();
  if(u.banned)return{error:'Conta suspensa por multas pendentes.'};
  if(!u.cart.length)return{error:'Seu carrinho está vazio.'};
  if(!u.cards.some(c=>c.id===cardId))return{error:'Escolha um cartão. Cadastre um na aba Cartões do perfil.'};
  const total=this.cartTotal(u);
  u.cart.forEach(c=>u.rentals.push({id:uid(),filmId:c.filmId,type:c.type,status:c.type==='buy'?'comprado':'alugado',
   pickupBy:n+CFG.PICKUP_DAYS*DAY,due:c.type==='buy'?null:n+(CFG.PICKUP_DAYS+CFG.RENT_DAYS)*DAY}));
  u.cart=[];this.save(u);return{ok:true,total}},
 giveBack(id){const u=this.user();u.rentals.find(r=>r.id===id).status='devolvido';this.refresh(u)},
 toggleWish(id){const u=this.user();u.wish=u.wish.includes(id)?u.wish.filter(x=>x!==id):[...u.wish,id];this.save(u);return u.wish.includes(id)},
 reserve(id){const u=this.user();
  if(u.banned)return'Conta suspensa por multas. Quite as pendências para reservar.';
  if(u.rentals.some(r=>r.filmId===id&&r.status==='reservado'))return'Você já está na fila deste filme.';
  u.rentals.push({id:uid(),filmId:id,type:'rent',status:'reservado',pickupBy:null,due:null});this.save(u);return null},
 addCard(num,name,exp,cvv){
  num=num.replace(/\s/g,'');
  if(!/^\d{16}$/.test(num))return'O número do cartão tem 16 dígitos.';
  if(name.trim().length<3)return'Informe o nome como está no cartão.';
  if(!/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp))return'Validade no formato MM/AA.';
  if(!/^\d{3}$/.test(cvv))return'O CVV tem 3 dígitos.';
  const u=this.user();u.cards.push({id:uid(),last4:num.slice(-4),name:name.trim(),exp,brand:num[0]==='4'?'Visa':'Mastercard'});this.save(u);return null}
};
