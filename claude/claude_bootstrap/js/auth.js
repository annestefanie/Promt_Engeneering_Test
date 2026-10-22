/* Página de login e cadastro */
if(Layout.init()){
 const form=$('#auth-form'),msg=$('#auth-msg'),pass=$('#pass');let mode='login';
 const setMode=m=>{mode=m;
  document.querySelectorAll('.tab').forEach(t=>{const on=t.dataset.mode===m;t.setAttribute('aria-selected',on);t.classList.toggle('active',on)});
  $('#name-wrap').hidden=m==='login';$('#rules').hidden=m==='login';$('#submit').textContent=m==='login'?'Entrar':'Criar conta';
  pass.autocomplete=m==='login'?'current-password':'new-password';msg.textContent=''};
 document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>setMode(t.dataset.mode));
 pass.oninput=()=>{const ok=[[/.{8,}/,'8+'],[/[A-Z]/,'A'],[/\d/,'1']];
  document.querySelectorAll('#rules li').forEach((li,i)=>{const good=ok[i][0].test(pass.value);li.dataset.ok=good;li.textContent=(good?'✓ ':'• ')+li.dataset.t})};
 $('#toggle-pass').onclick=e=>{const show=pass.type==='password';pass.type=show?'text':'password';e.target.textContent=show?'Ocultar senha':'Mostrar senha';e.target.setAttribute('aria-pressed',show)};
 form.onsubmit=e=>{e.preventDefault();
  const err=mode==='login'?Store.login($('#email').value,pass.value):Store.register($('#name').value,$('#email').value,pass.value);
  if(err){msg.textContent=err;$('#email').focus&&0;return}
  location.href='pages/home.html'};
 $('#google').onclick=()=>{Store.google();location.href='pages/home.html'};
 setMode('login');
}
