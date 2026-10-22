/* Catálogo fictício: r = aluguel (5 dias), b = compra, out = dias até voltar à prateleira (0 = disponível) */
const FILMS=[
{id:1,t:'Cidadão Kane',y:1941,d:'Orson Welles',g:'Drama',r:9,b:49,out:0,s:'A vida de um magnata, reconstruída a partir de uma última palavra.'},
{id:2,t:'Casablanca',y:1942,d:'Michael Curtiz',g:'Romance',r:8,b:45,out:0,s:'Um bar, um reencontro e uma escolha impossível em plena guerra.'},
{id:3,t:'Vertigo',y:1958,d:'Alfred Hitchcock',g:'Suspense',r:10,b:55,out:3,s:'Um detetive com medo de altura é preso numa obsessão.'},
{id:4,t:'Psicose',y:1960,d:'Alfred Hitchcock',g:'Terror',r:9,b:49,out:0,s:'Uma fuga termina num motel à beira da estrada.'},
{id:5,t:'Acossado',y:1960,d:'Jean-Luc Godard',g:'Nouvelle Vague',r:11,b:59,out:0,s:'Um ladrão e uma americana em Paris, sem tempo a perder.'},
{id:6,t:'Cléo das 5 às 7',y:1962,d:'Agnès Varda',g:'Nouvelle Vague',r:12,b:62,out:0,s:'Duas horas de uma cantora esperando um diagnóstico.'},
{id:7,t:'8½',y:1963,d:'Federico Fellini',g:'Drama',r:11,b:58,out:6,s:'Um diretor bloqueado se perde entre memória e fantasia.'},
{id:8,t:'Persona',y:1966,d:'Ingmar Bergman',g:'Drama',r:12,b:64,out:0,s:'Uma enfermeira e uma atriz muda se confundem numa ilha.'},
{id:9,t:'2001: Uma Odisseia no Espaço',y:1968,d:'Stanley Kubrick',g:'Ficção',r:10,b:56,out:0,s:'Da aurora do homem a um computador que não perdoa.'},
{id:10,t:'Três Homens em Conflito',y:1966,d:'Sergio Leone',g:'Faroeste',r:9,b:48,out:0,s:'Três pistoleiros disputam um tesouro enterrado.'},
{id:11,t:'Taxi Driver',y:1976,d:'Martin Scorsese',g:'Drama',r:9,b:50,out:0,s:'Um motorista insone vaga por uma Nova York febril.'},
{id:12,t:'Stalker',y:1979,d:'Andrei Tarkovski',g:'Ficção',r:13,b:69,out:2,s:'Um guia leva dois homens a uma Zona onde desejos se realizam.'},
{id:13,t:'Blade Runner',y:1982,d:'Ridley Scott',g:'Ficção',r:10,b:54,out:0,s:'Chuva, neon e um caçador de androides em fim de linha.'},
{id:14,t:'Paris, Texas',y:1984,d:'Wim Wenders',g:'Drama',r:11,b:57,out:4,s:'Um homem reaparece no deserto sem dizer uma palavra.'},
{id:15,t:'Dias Selvagens',y:1990,d:'Wong Kar-wai',g:'Romance',r:12,b:63,out:0,s:'Hong Kong, 1960: um playboy que nunca ama de volta.'},
{id:16,t:'Chungking Express',y:1994,d:'Wong Kar-wai',g:'Romance',r:11,b:58,out:0,s:'Dois policiais solitários, duas noites, uma lata de abacaxi.'},
{id:17,t:'Amor à Flor da Pele',y:2000,d:'Wong Kar-wai',g:'Romance',r:12,b:61,out:0,s:'Dois vizinhos descobrem a traição que os aproxima.'},
{id:18,t:'Os Sete Samurais',y:1954,d:'Akira Kurosawa',g:'Aventura',r:10,b:52,out:0,s:'Uma vila pobre contrata sete guerreiros contra bandidos.'},
{id:19,t:'Metrópolis',y:1927,d:'Fritz Lang',g:'Ficção',r:8,b:44,out:5,s:'Uma cidade de torres e operários, e um robô que a incendeia.'},
{id:20,t:'Tempos Modernos',y:1936,d:'Charles Chaplin',g:'Comédia',r:8,b:42,out:0,s:'O operário que a linha de montagem engoliu.'}];
const PALETTES=[['#1c3a1c','#d14a1b'],['#071516','#448690'],['#8f160c','#050807'],['#2b6e7c','#d14a1b'],['#28565d','#8f160c'],['#1c3a1c','#448690']];
const poster=f=>{const[a,b]=PALETTES[f.id%PALETTES.length];
 return `<div class="poster" aria-hidden="true" style="background:linear-gradient(160deg,${a},${b})"><span>${f.d}</span><b>${f.t}</b><span>${f.y}</span></div>`};
