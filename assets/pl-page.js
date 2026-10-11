
(function(){
var A=window.PL_A||'img/';
var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
/* contatori */
function count(el){if(el._c)return;el._c=1;var to=+el.dataset.count,t0=null;function f(t){t0=t0||t;var p=Math.min((t-t0)/1600,1);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
function ring(sc){$$('.fg',sc).forEach(function(c){c.style.strokeDashoffset=176-176*(+c.dataset.v)/100});$$('[data-count]',sc).forEach(count)}
/* reveal */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var el=e.target;el.classList.add('in');
  $$('.bar i',el).forEach(function(b){b.style.width=b.dataset.w});
  if(el.matches('.dl'))$('.bar i',el).style.width=$('.bar i',el).dataset.w;
  $$('[data-count]',el).forEach(count);
  if(el.matches('[data-count]'))count(el);
  io.unobserve(el)})},{threshold:.18,rootMargin:'0px 0px -40px 0px'});
$$('.rv,.stat b,.stat span[data-count]').forEach(function(el){io.observe(el)});
/* hero */
setTimeout(function(){ring($('.hero'))},500);
$$('.hero [data-delay]').forEach(function(el){setTimeout(function(){el.classList.add('in')},+el.dataset.delay)});
var n1=$('.n1');setTimeout(function(){setInterval(function(){n1.classList.toggle('in')},n1.classList.contains('in')?4200:4200)},5600);
/* track percorso */
var tr=$('.track i');if(tr)new IntersectionObserver(function(es,o){if(es[0].isIntersecting){tr.style.width='100%';o.disconnect()}},{threshold:.3}).observe($('.phases'));
var gr=$('#graph');new IntersectionObserver(function(es,o){if(es[0].isIntersecting){gr.classList.add('in');o.disconnect()}},{threshold:.35}).observe(gr);
/* tasks spuntabili */
$$('.task').forEach(function(t){t.addEventListener('click',function(){t.classList.toggle('done');t.classList.remove('now');var sc=t.closest('.sv');if(sc){var d=$$('.task.done',sc).length;$('#tdone').textContent=d+' di 6 completate';var c=$('.fg',sc);c.style.strokeDashoffset=176-176*(60+d*6)/100;$('[data-count]',sc).textContent=60+d*6}})});

/* ---------- QUIZ ---------- */
var P={
 aria:{n:"Pancia d'aria",img:"ic-aria",d:"Ti gonfi subito dopo i pasti: la pancia si riempie d'aria mentre mangi.",w:"Quando mangi in fretta, parli molto a tavola o bevi bibite gassate, ingoi aria che resta nello stomaco e nell'intestino. Il percorso lavora su masticazione, ritmo dei pasti e respirazione.",day:[["08:00","Colazione seduta, 15 minuti, senza telefono"],["12:45","Riso basmati con pollo e zucchine"],["13:15","10 minuti di camminata lenta"],["22:00","Respirazione diaframmatica di 3 minuti"]]},
 ferm:{n:"Pancia da fermentazione",img:"ic-fermentazione",d:"Il gonfiore cresce nel pomeriggio e la sera, con gas, ed è legato a certi cibi.",w:"Alcuni cibi, anche sanissimi come mele, legumi e yogurt, fermentano nell'intestino e producono gas nelle ore successive. Prima li riduciamo per sgonfiarti, poi li reintroduciamo uno alla volta per scoprire i tuoi.",day:[["08:00","Porridge d'avena con mirtilli"],["12:45","Riso basmati, pollo, zucchine e limone"],["16:30","Kiwi e 10 mandorle"],["20:00","Orata al forno con patate"]]},
 stress:{n:"Pancia da stress",img:"ic-stress",d:"La pancia peggiora nei giorni pesanti, con crampi e un intestino nervoso.",w:"Intestino e cervello sono collegati: tensione, pasti saltati e orari irregolari rendono l'intestino più sensibile. Il percorso lavora su orari regolari, pause pasto vere, camminate e respirazione.",day:[["07:30","Acqua tiepida e 2 minuti di respiro"],["12:45","Pausa pranzo vera, lontano dalla scrivania"],["13:15","Camminata di 10 minuti"],["22:00","Respirazione guidata e voto della sera"]]},
 orm:{n:"Pancia ormonale",img:"ic-ormonale",d:"Ti gonfi soprattutto nei giorni prima del ciclo, con ritenzione e pesantezza.",w:"Nei giorni prima del ciclo gli ormoni rallentano l'intestino e favoriscono la ritenzione di liquidi. Il percorso segue il tuo calendario, regola sale e idratazione e ti propone menu dedicati in quei giorni.",day:[["07:30","Acqua tiepida con limone"],["12:45","Insalata di quinoa, spinaci e salmone"],["16:30","Promemoria acqua e uno yogurt di soia"],["20:00","Vellutata di zucca e uova"]]},
 lenta:{n:"Pancia lenta",img:"ic-lenta",d:"Vai poco di corpo, ti senti pesante e la pancia è dura.",w:"Quando l'intestino è lento, gas e residui restano più a lungo e la pancia si indurisce. Il percorso lavora su acqua, fibre introdotte gradualmente, movimento e una routine del mattino.",day:[["07:00","Due bicchieri d'acqua tiepida al risveglio"],["08:00","Yogurt di soia, kiwi e semi di lino"],["13:15","Camminata di 15 minuti"],["20:00","Minestrone di verdure e riso"]]}
};
var qz=$('#qz'),steps=$$('.qstep',qz),bar=$('.qbar i',qz),score,cur=0;
function reset(){score={aria:0,ferm:0,stress:0,orm:0,lenta:0};cur=0;$$('.opts button',qz).forEach(function(b){b.classList.remove('sel')});show(0)}
function show(i){cur=i;steps.forEach(function(s,k){s.classList.toggle('on',k===i)});bar.style.width=Math.min(i/5,1)*100+'%'}
$$('.opts button',qz).forEach(function(b){b.addEventListener('click',function(){
  var st=b.closest('.qstep');$$('button',st).forEach(function(x){x.classList.remove('sel')});b.classList.add('sel');
  score[b.dataset.p]+=2;var k=+st.dataset.q;
  setTimeout(function(){if(k<4)show(k+1);else{show(5);setTimeout(result,1900)}},320)})});
function result(){
  var arr=Object.keys(score).map(function(k){return[k,score[k]+Math.random()*.1]}).sort(function(a,b){return b[1]-a[1]});
  var a=arr[0][0],b=arr[1][0],sa=arr[0][1]+1,sb=Math.max(arr[1][1],.8)+1,tot=sa+sb,pa=Math.round(sa/tot*100);if(pa>82)pa=82;if(pa<56)pa=56;var pb=100-pa;
  var p=P[a];$('#rImg').src=A+p.img+'.png';$('#rName').textContent=p.n;$('#rDesc').textContent=p.d;$('#rWhy').textContent=p.w;
  $('#p1n').textContent=p.n.replace('Pancia ','').replace(/^da /,'').replace(/^d'/,'').replace(/^\w/,function(c){return c.toUpperCase()});
  $('#p2n').textContent=P[b].n.replace('Pancia ','').replace(/^da /,'').replace(/^d'/,'').replace(/^\w/,function(c){return c.toUpperCase()});
  $('#p1v').textContent=pa+'%';$('#p2v').textContent=pb+'%';$('#p1b').style.width='0';$('#p2b').style.width='0';
  $('#rDay').innerHTML=p.day.map(function(d){return '<li><b>'+d[0]+'</b>'+d[1]+'</li>'}).join('');
  show(6);bar.style.width='100%';setTimeout(function(){$('#p1b').style.width=pa+'%';$('#p2b').style.width=pb+'%'},120);
}
$('#qredo').addEventListener('click',reset);reset();

/* ---------- APP TOUR: l'app si usa da sola ---------- */
var svs=$$('.sv'),tph=$('.tour-ph');
var CAP={oggi:["Oggi","Le attività del giorno in ordine di orario, con le notifiche sui tuoi orari. Tocca un'attività per spuntarla."],
 menu:["Menu del giorno","Ricette da 15 minuti con la versione da portare in ufficio. Premi «Sostituisci piatto» se non ti va."],
 diario:["Diario del gonfiore","Un voto da 1 a 10 con un solo tocco dopo i pasti: è da qui che l'app capisce cosa ti gonfia."],
 prog:["Progressi e trigger","Il grafico del gonfiore che scende e, al giorno 21, la lista dei cibi che gonfiano proprio te."],
 sema:["Semaforo alimenti","Scrivi un cibo e scopri se è verde, giallo o rosso per il tuo profilo. Prova con «pizza» o «ceci»."],
 resp:["Respirazione guidata","3 minuti di respiro diaframmatico: segui il cerchio che si gonfia e si sgonfia."],
 sos:["SOS gonfiore","Sei gonfia adesso? Cinque passi per i prossimi 30 minuti, e cosa mangiare al pasto dopo."],
 spesa:["Lista della spesa","Generata in automatico dal tuo menu, divisa per reparto. Spunta mentre fai la spesa."]};
var TABK={oggi:'oggi',resp:'oggi',diario:'prog',menu:'menu',spesa:'menu',sos:'sos',prog:'prog',sema:'sema'};
function go(s){svs.forEach(function(v){v.classList.toggle('on',v.dataset.v===s)});
  $$('.tour-ph .tabbar>span').forEach(function(x){x.classList.toggle('on',x.dataset.go===TABK[s])});
  $('#capT').textContent=CAP[s][0];$('#capP').textContent=CAP[s][1];
  var cap=$('.tour-cap');cap.classList.remove('flip');void cap.offsetWidth;cap.classList.add('flip');
  if(s==='oggi')ring($('.sv.on'));
  if(s==='diario')$$('#week i').forEach(function(w,k){if(w.classList.contains('t')&&w.dataset.set)return;w.style.height='0';setTimeout(function(){w.style.height=w.dataset.h+'%'},80+k*90)});
  if(s==='resp')breathe()}
window.plGo=go;
tph.addEventListener('click',function(e){var b=e.target.closest('[data-go]');if(b){e.preventDefault();go(b.dataset.go)}tph.classList.add('used')});
new IntersectionObserver(function(es,o){if(es[0].isIntersecting){ring($('.sv.on'));o.disconnect()}},{threshold:.4}).observe(tph);
/* menu swap */
var dishes=[["Riso basmati con pollo, zucchine e limone","15 min",A+"ph-piatto.jpg"],["Insalata tiepida di quinoa, spinaci e salmone","12 min",A+"ph-spesa.jpg"],["Pasta senza glutine con zucchine e menta","15 min",A+"ph-piatto.jpg"],["Piadina con tacchino, rucola e carote","8 min",A+"ph-spesa.jpg"]],di=0;
$('#swap').addEventListener('click',function(){di=(di+1)%dishes.length;var im=$('#dImg');im.style.opacity=.2;setTimeout(function(){$('#dName').textContent=dishes[di][0];$('#dT').textContent=dishes[di][1];im.style.backgroundImage='url('+dishes[di][2]+')';im.style.opacity=1},250)});
/* diario */
var cols=['#6FAE7E','#7DB487','#8DBA87','#A8C27E','#C9C66F','#E5C25C','#EDAE5C','#EE9A5E','#E9825B','#DD6A4C'];
$$('#scale button').forEach(function(b,k){b.addEventListener('click',function(){$$('#scale button').forEach(function(x){x.classList.remove('sel');x.style.background=''});b.classList.add('sel');b.style.background=cols[k];
  $('#dok').textContent=k<4?'Ottimo! Il tuo voto migliora rispetto a ieri':k<7?'Registrato. Prova 10 minuti di camminata':'Registrato. Vuoi aprire la modalità SOS?';
  var last=$('#week i.t');last.style.height=(k+1)*9+'%'})});
/* semaforo */
var F=[["Pizza margherita","y","Meglio a pranzo, impasto lievitato a lungo"],["Ceci","r","Prova in fase trigger"],["Cappuccino","r","Scegli latte senza lattosio"],["Riso basmati","g","Ok per te"],["Zucchine","g","Ok per te"],["Mela","r","Fermentabile per il tuo profilo"],["Banana matura","y","Meglio poco matura"],["Kiwi","g","Ok, aiuta la regolarità"],["Piadina","y","Dipende dal ripieno"],["Sushi","g","Attenzione a salsa di soia e sale"],["Yogurt greco","r","Prova il senza lattosio"],["Pane integrale","y","In piccole quantità"],["Carote","g","Ok per te"],["Cipolla","r","Uno dei trigger più comuni"],["Parmigiano","g","Naturalmente senza lattosio"],["Bibite gassate","r","Aria nella pancia"],["Uova","g","Ok per te"],["Lenticchie","r","Prova in fase trigger"],["Mandorle","y","Massimo 10-12"],["Pollo","g","Ok per te"]];
function rf(q){q=(q||'').toLowerCase();$('#foods').innerHTML=F.filter(function(f){return f[0].toLowerCase().indexOf(q)>-1}).map(function(f){return '<div class="food"><span class="d '+f[1]+'"></span><span>'+f[0]+'</span><small>'+f[2]+'</small></div>'}).join('')||'<div class="food"><span>Nessun risultato: nell\'app trovi oltre 300 alimenti</span></div>'}
rf();$('#fs').addEventListener('input',function(e){rf(e.target.value)});
/* respiro */
var bt;function breathe(){clearTimeout(bt);var c=$('#brc'),t=$('#brt');(function loop(){if(!$('.sv[data-v=resp]').classList.contains('on'))return;c.style.transitionDuration='4s';c.classList.add('big');t.textContent='Inspira';bt=setTimeout(function(){t.textContent='Trattieni';bt=setTimeout(function(){c.style.transitionDuration='6s';c.classList.remove('big');t.textContent='Espira';bt=setTimeout(loop,6000)},2000)},4000)})()}

/* ---------- GIORNATA ---------- */
var hrs=$$('.hr'),imgs=$$('.day-ph img');
var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var h=e.target,i=+h.dataset.i;hrs.forEach(function(x){x.classList.toggle('on',x===h)});imgs.forEach(function(m){m.classList.toggle('on',+m.dataset.i===i)});
  var n=$('.day-ph .notif');n.classList.remove('in');setTimeout(function(){$('#ntT').textContent=h.dataset.t;$('#ntB').textContent=h.dataset.b;$('#ntP').textContent=h.dataset.p;n.classList.add('in')},300)})},{rootMargin:'-45% 0px -45% 0px'});
hrs.forEach(function(h){io2.observe(h)});

/* ---------- FAQ ---------- */
$$('.fq button').forEach(function(b){b.addEventListener('click',function(){var f=b.parentNode,o=f.classList.contains('on');$$('.fq').forEach(function(x){x.classList.remove('on')});if(!o)f.classList.add('on')})});
/* sticky */
var stk=$('#stk'),off=$('#offerta');addEventListener('scroll',function(){var r=off.getBoundingClientRect();stk.classList.toggle('on',scrollY>700&&!(r.top<innerHeight&&r.bottom>0))},{passive:true});
/* acquisto: in locale scorre all'offerta, nel tema invia il form */
$$('.buy').forEach(function(b){b.addEventListener('click',function(){var f=document.getElementById('pl-atc');if(f&&f.getAttribute('action'))f.submit();else off.scrollIntoView({behavior:'smooth'})})});
})();
