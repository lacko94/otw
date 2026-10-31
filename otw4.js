(function(){
'use strict';

// ---------- Parkirani nalozi ----------
var PARK=function(){
(function(){
var D=document,P=D.getElementById('pk');if(P){P.remove();return;}
var ts=[].slice.call(D.querySelectorAll('table')),tx=function(c){return c.textContent.trim();};
var h=ts.find(function(t){return t.rows[0]&&[].some.call(t.rows[0].cells,function(c){return tx(c)=='Parkirano do';});});
if(!h){alert('Nije lista parkiranih');return;}
var H=[].map.call(h.rows[0].cells,tx),iK=H.indexOf('Kartica'),iD=H.indexOf('Parkirano do'),iA=H.indexOf('Adresa instalacije');
var dt=ts.find(function(t){return t!=h&&t.rows.length&&t.rows[0].cells.length==H.length&&/\d{4}-\d\d-\d\d/.test(t.textContent);});
if(!dt||iK<0||iD<0){alert('Nema stupca Kartica');return;}
var pg=D.body.innerText.match(/\d+-(\d+) od (\d+)/),part=pg&&+pg[2]>+pg[1];if(part)alert('Samo '+pg[1]+' od '+pg[2]+'!');
var m={},L=[];
[].forEach.call(dt.rows,function(r){var c=[].map.call(r.cells,tx),k=c[iK],d=c[iD];if(!k||!d)return;
 if(!m[k]){m[k]={k:k,d:d,a:iA<0?'':c[iA].replace(/\s+/g,' ').replace(/\s*,\s*/g,', '),n:0};L.push(m[k]);}m[k].n++;if(d<m[k].d)m[k].d=d;});
L.sort(function(a,b){return a.d<b.d?-1:1;});
var S=function(k,v){try{if(v===undefined)return JSON.parse(localStorage[k]||'null');localStorage[k]=JSON.stringify(v);}catch(e){}};
var two=function(n){return(n<10?'0':'')+n;},pd=function(s){var p=s.split(/[- :]/);return new Date(p[0],p[1]-1,p[2],p[3]||0,p[4]||0,p[5]||0);};
var gc=function(d){return d.getFullYear()+two(d.getMonth()+1)+two(d.getDate())+'T'+two(d.getHours())+two(d.getMinutes())+'00';};
var hr=function(d){return two(d.getDate())+'.'+two(d.getMonth()+1)+'.'+d.getFullYear()+'. '+two(d.getHours())+':'+two(d.getMinutes());};
var nt=function(o){return 'Nalog '+o.k+'\nParkirano do: '+hr(pd(o.d))+'\nAdresa: '+o.a;},all=function(){return L.map(nt).join('\n\n');};
var toast=function(s){var t=D.createElement('div');t.className='pkt';t.textContent=s;P.appendChild(t);setTimeout(function(){t.remove();},2e3);};
var cp=function(s,g){var f=function(){var a=D.createElement('textarea');a.value=s;P.appendChild(a);a.select();var ok;try{ok=D.execCommand('copy');}catch(e){}a.remove();ok?toast(g):prompt('Kopiraj:',s);};
 navigator.clipboard?navigator.clipboard.writeText(s).then(function(){toast(g);},f):f();};
var sh=function(t,s){navigator.share?navigator.share({title:t,text:s}).catch(function(){}):cp(s,'Kopirano');};
var now=new Date(),K=function(o){return o.k+'|'+o.d;},nu=function(a){return L.filter(function(o){return a.indexOf(K(o))<0;});},mk=function(n,a,l){l.forEach(function(o){a.indexOf(K(o))<0&&a.push(K(o));});S(n,a.slice(-300));};
var ex=S('pk-ics')||[],fr=nu(ex),cd=S('pk-cpd')||[],nw=nu(cd);
var ics=function(l,n){var s=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:pk'];
 l.forEach(function(o){var d=pd(o.d),A=function(t){return['BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:Parking '+o.k,'TRIGGER:'+t,'END:VALARM'];};
  s=s.concat(['BEGIN:VEVENT','UID:nalog-'+o.k+'@parkirani','DTSTAMP:'+gc(now),'DTSTART:'+gc(d),'DTEND:'+gc(new Date(+d+18e5)),'SUMMARY:Parkiran nalog '+o.k,'LOCATION:'+o.a.replace(/([,;\\])/g,'\\$1')],A('-P1D'),A('-PT1H'),['END:VEVENT']);});
 s.push('END:VCALENDAR');var a=D.createElement('a');a.href=URL.createObjectURL(new Blob([s.join('\r\n')],{type:'text/calendar'}));a.download=n;P.appendChild(a);a.click();a.remove();mk('pk-ics',ex,l);};
var gs=S('pk-gs');
var setup=function(){var u=prompt('Google link (s ?key=):',gs||'');if(u==null)return;u=u.trim();
 if(u&&!/^https:\/\/script\.google\.com\/.+\?key=/.test(u))return alert('Neispravan link');S('pk-gs',gs=u||null);toast(u?'Link spremljen':'Link obrisan');};
var sync=function(){if(!gs)setup();if(!gs)return;var f=D.createElement('form');f.method='POST';f.action=gs;f.target='_blank';
 f.innerHTML='<input type=hidden name=data>';f.firstChild.value=JSON.stringify({complete:!part,orders:L.map(function(o){return{k:o.k,d:o.d,a:o.a};})});P.appendChild(f);f.submit();f.remove();};
var back=location.hash.slice(1),busy=0,sl=function(x){return new Promise(function(r){setTimeout(r,x);});};
var zb=async function(o,el){if(busy)return;busy=1;var z=el.querySelector('.z')||el.appendChild(D.createElement('div'));z.className='z';z.textContent='Učitavam zabilješku…';
 location.hash='yellow-notes:ticketId='+o.k;var t='',i;
 for(i=0;i<60;i++){await sl(250);t=D.body.innerText;if(t.indexOf('kartica: '+o.k)>=0||i>16&&t.indexOf('Nova zabilješka')>=0)break;}
 var j=t.indexOf('Osvježi'),s=t.slice(j+7),mm=j<0?0:s.match(RegExp('kartica: '+o.k+' \\|[^\\n]*'));
 z.textContent=mm?s.slice(0,mm.index).trim()+'\n— '+((mm[0].match(/podnosilac: ([^(|]+)/)||[])[1]||'').trim()+' · '+((mm[0].match(/podnošenja: (\S+)/)||[])[1]||''):'Nema zabilješki.';
 location.hash=back;for(i=0;i<40;i++){await sl(250);if(D.body.innerText.indexOf('Parkirano do')>=0)break;}busy=0;};
var es=function(s){return s.replace(/[&<"]/g,function(c){return'&#'+c.charCodeAt(0)+';';});};
var op=function(i,t,s){return'<button class=o id='+i+'><b>'+t+'</b><br>'+s+'</button>';};
P=D.createElement('div');P.id='pk';
P.innerHTML='<style>#pk{position:fixed;inset:0;z-index:99999;background:#fff;color:#222;overflow:auto;padding:12px 16px;font:14px sans-serif}#pk .b{border:1px solid #e20074;border-radius:6px;padding:7px 9px;background:#fff;color:#e20074;text-decoration:none}#pk .p,#pk .n{background:#e20074;color:#fff}#pk .n{font-size:10px;padding:1px 4px;border-radius:3px;vertical-align:3px}#pk .r{padding:9px 0;border-bottom:1px solid #ddd;display:flex;gap:8px}#pk .r>div{display:grid;gap:6px}#pk .r>div:first-child{flex:1;display:block}#pk p .b{margin:0 6px 6px 0}#pk .z{white-space:pre-wrap;background:#fff4dc;border-radius:6px;padding:6px 8px;margin-top:6px;font-size:13px}#pk .o{display:block;width:100%;text-align:left;padding:9px;margin-top:8px}.pkt{position:fixed;left:30%;bottom:24px;background:#222;color:#fff;padding:9px}</style>'
 +'<button id=pkx class=b style=float:right>Zatvori</button><b style=font-size:18px>Parkirani nalozi ('+L.length+')</b>'
 +'<p><button id=pkc class=b>Kopiraj sve</button><button id=pkw class=b>Kopiraj nove ('+nw.length+')</button><button id=pks class=b>Podijeli sve</button><button id=pke class="b p">Izvoz ▾</button></p>'
 +'<div id=pkm hidden>'
 +op('pkg','Google kalendar',gs?'Sinkroniziraj':'Unesi link')
 +op('pka','.ics – svi','Samsung, Outlook')
 +op('pkn','.ics – novi ('+fr.length+')','Bez duplikata')
 +(gs?op('pkl','Google link','Promijeni'):'')+'</div>'
 +L.map(function(o,i){var d=pd(o.d),n=Math.ceil((d-now)/864e5);
  return'<div class=r data-i='+i+'><div><b style="font-size:17px">'+o.k+'</b>'+(cd.indexOf(K(o))<0?' <b class=n>NOVO</b>':'')
  +'<br><b style="color:'+(n<0?'#b00020':n<2?'#d35400':'#2e7d32')+'">do '+hr(d)+' ('+(n<0?'ISTEKLO':n==0?'danas':n==1?'sutra':'za '+n+' d')+')</b><br>'+es(o.a)+' <small>· '+o.n+' zad.</small></div>'
  +'<div><button class=b data-s='+i+'>Podijeli</button><button class=b data-z='+i+'>Zabilješka</button><a class="b p" target=_blank href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Parkiran+nalog+'+o.k+'&dates='+gc(d)+'/'+gc(new Date(+d+18e5))+'&ctz=Europe/Zagreb&location='+encodeURIComponent(o.a)+'">+ Kalendar</a></div></div>';}).join('');
D.body.appendChild(P);
var $=function(i){return D.getElementById(i);};
P.onclick=function(e){var t=e.target,s=t.closest('[data-s]'),r=t.closest('.r'),z=t.closest('[data-z]');if(t.closest('a'))return;
 if(z)zb(L[z.dataset.z],r.firstChild);else if(s){var o=L[s.dataset.s];sh('Nalog '+o.k,nt(o));}else if(r){o=L[r.dataset.i];cp(nt(o),'Kopirano');mk('pk-cpd',cd,[o]);}};
$('pkx').onclick=function(){P.remove();};
$('pke').onclick=function(){$('pkm').hidden^=1;};
$('pkc').onclick=function(){cp(all(),'Kopirano');mk('pk-cpd',cd,L);};
$('pkw').onclick=function(){if(!nw.length)return toast('Nema novih');cp(nw.map(nt).join('\n\n'),'Kopirano');mk('pk-cpd',cd,nw);nw=[];this.textContent='Kopiraj nove (0)';};
$('pks').onclick=function(){sh('Parkirani nalozi',all());};
$('pkg').onclick=sync;
$('pka').onclick=function(){ics(L,'parkirani-nalozi.ics');};
$('pkn').onclick=function(){if(!fr.length)return toast('Nema novih');ics(fr,'parkirani-novi.ics');fr=[];this.firstChild.textContent='.ics – novi (0)';};
if($('pkl'))$('pkl').onclick=setup;
})();
};

// ---------- Novi nalozi (optika) ----------
var NOVE=function(){
(async function(){
var D=document,P=D.getElementById('pn');if(P){P.remove();return;}
var back=location.hash.slice(1),sleep=function(x){return new Promise(function(r){setTimeout(r,x);});};
var Z='Instalacija kod korisnika (Optika)',KI='FTTH kućna instalacija';
var tx=function(c){return c.textContent.trim();};
var hdr=function(){return[].find.call(D.querySelectorAll('table'),function(t){return t.rows[0]&&[].some.call(t.rows[0].cells,function(c){return tx(c)=='Adresa instalacije';})&&[].some.call(t.rows[0].cells,function(c){return tx(c)=='Zadatak';});});};
var h=hdr();if(!h){alert('Nema stupaca Zadatak i Adresa instalacije.');return;}
var H=[].map.call(h.rows[0].cells,tx),iK=H.indexOf('Kartica'),iA=H.indexOf('Adresa instalacije'),iZ=H.indexOf('Zadatak'),iN=H.indexOf('Naziv korisnika'),iP=H.indexOf('Proces'),iC=H.indexOf('CX identifikator');
var data=function(){var x=hdr();return[].find.call(D.querySelectorAll('table'),function(t){return t!=x&&t.rows.length&&t.rows[0].cells.length==H.length&&!t.querySelector('th');});};
var pt=function(){var m=D.body.innerText.match(/(\d+)-(\d+) od (\d+)/);return m?m[0]:'';};
var btn=function(l){return D.querySelector('img[aria-label="'+l+'"]');};
var fire=function(e){['mousedown','mouseup','click'].forEach(function(t){e.dispatchEvent(new MouseEvent(t,{bubbles:true,view:window}));});};
var wait=function(old){return new Promise(function(r){var n=0,i=setInterval(function(){if(pt()!=old||++n>60){clearInterval(i);setTimeout(r,300);}},150);});};
var first=async function(){var f=btn('First page');if(f&&f.getAttribute('aria-disabled')=='false'){var o=pt();fire(f);await wait(o);}};
var css='<style>#pn{position:fixed;inset:0;z-index:99999;background:#fff;color:#222;overflow:auto;padding:12px 16px;font:15px sans-serif}#pn .b{border:1px solid #e20074;border-radius:6px;padding:7px 10px;background:#fff;color:#e20074}#pn .on{background:#e20074;color:#fff}#pn .r{padding:10px 0;border-bottom:1px solid #ddd;display:flex;gap:8px;align-items:center}#pn .r>div:first-child{flex:1}#pn .r>div+div{display:grid;gap:6px}#pn .z{white-space:pre-wrap;background:#fff4dc;border-radius:6px;padding:6px 8px;margin-top:6px;font-size:13px}#pn .k{font-size:20px;font-weight:bold}#pn small{color:#666}.pnt{position:fixed;left:30%;bottom:24px;background:#222;color:#fff;padding:9px;border-radius:6px}</style>';
P=D.createElement('div');P.id='pn';P.innerHTML=css+'<b>Učitavam naloge…</b>';D.body.appendChild(P);
await first();
var m={},L=[],pages=0;
while(1){var t=data();
 if(t)[].forEach.call(t.rows,function(r){var c=[].map.call(r.cells,tx),k=c[iK];if(!k)return;
  if(!m[k]){m[k]={k:k,a:c[iA].replace(/\s+/g,' ').replace(/\s*,\s*/g,', '),z:[],n:(iN<0?'':c[iN])||(iC<0?'':c[iC]),b:iP>=0&&/^Bitstream/i.test(c[iP]),s:0};L.push(m[k]);}m[k].z.push(c[iZ]);if(iP>=0&&/slo[žz]eno uklju[čc]enje/i.test(c[iP]))m[k].s=1;});
 pages++;P.querySelector('b').textContent='Učitavam… '+pt();
 var n=btn('Next page');if(!n||n.getAttribute('aria-disabled')!='false'||pages>50)break;
 var o=pt();fire(n);await wait(o);}
var tot=(pt().match(/od (\d+)/)||[])[1];
await first();
var has=function(o,z){return o.z.indexOf(z)>=0;},kuc=function(o){return has(o,KI)||has(o,'Izrada optičke instalacije u stanu (optika)');};
var sl=L.filter(function(o){return has(o,Z)&&o.s;}).length;L=L.filter(function(o){return has(o,Z)&&!o.s;});
var ki=false;try{ki=localStorage['pn-ki']=='1';}catch(e){}
var es=function(s){return s.replace(/[&<"]/g,function(c){return'&#'+c.charCodeAt(0)+';';});};
var toast=function(s){var t=D.createElement('div');t.className='pnt';t.textContent=s;P.appendChild(t);setTimeout(function(){t.remove();},1500);};
var who=function(o){return o.n+(o.b?' · Bitstream':'');},line=function(o){return o.k+'\n'+o.a+'\n'+who(o);};
var cp=function(s,g){g=g||'Kopirano '+s;var fb=function(){var a=D.createElement('textarea');a.value=s;P.appendChild(a);a.select();var ok;try{ok=D.execCommand('copy');}catch(e){}a.remove();ok?toast(g):prompt('Kopiraj:',s);};
 navigator.clipboard?navigator.clipboard.writeText(s).then(function(){toast(g);},fb):fb();};
var V,busy=0;
var draw=function(){var sc=P.scrollTop;V=ki?L.filter(function(o){return kuc(o);}):L;
 P.innerHTML=css+'<button id=pnx class=b style=float:right>Zatvori</button><b style=font-size:18px>Instalacija kod korisnika (Optika)</b><br><small>'+V.length+' kartica · pregledano '+(tot||'?')+' naloga · bez '+sl+' složenih uključenja</small>'
 +'<p><button id=pnc class=b>Kopiraj sve ('+V.length+')</button> <button id=pnf class="b'+(ki?' on':'')+'">'+(ki?'✓ ':'')+'Samo + kućna instalacija ('+L.filter(function(o){return kuc(o);}).length+')</button></p>'
 +V.map(function(o,i){return'<div class=r><div><span class=k>'+o.k+'</span><br>'+es(o.a)+'<br><small>'+es(who(o))+'</small>'+(o.zb?'<div class=z>'+es(o.zb)+(o.zm?'<br><small>'+es(o.zm)+'</small>':'')+'</div>':'')+'</div><div><button class=b data-i='+i+'>Kopiraj karticu</button><button class=b data-z='+i+'>Zabilješka</button></div></div>';}).join('')
 +(V.length?'':'<p>Nema takvih naloga.</p>');P.scrollTop=sc;};
var note=async function(o){if(busy)return;busy=1;o.zb='Učitavam…';o.zm='';draw();
 location.hash='yellow-notes:ticketId='+o.k;var t='',i;
 for(i=0;i<60;i++){await sleep(250);t=D.body.innerText;if(t.indexOf('kartica: '+o.k)>=0||(i>16&&t.indexOf('Nova zabilješka')>=0))break;}
 var j=t.indexOf('Osvježi'),s=j<0?'':t.slice(j+7),mm=s.match(new RegExp('kartica: '+o.k+' \\|[^\\n]*'));
 if(mm){o.zb=s.slice(0,mm.index).trim()||'(prazno)';o.zm=((mm[0].match(/podnosilac: ([^(|]+)/)||[])[1]||'').trim()+' · '+((mm[0].match(/podnošenja: (\S+)/)||[])[1]||'');}else o.zb='Nema zabilješki.';
 location.hash=back;for(i=0;i<40;i++){await sleep(250);if(data()&&pt())break;}
 busy=0;draw();};
draw();
P.onclick=function(e){var b=e.target.closest('[data-i]'),z=e.target.closest('[data-z]');if(b)cp(V[b.dataset.i].k);if(z)note(V[z.dataset.z]);
 if(e.target.id=='pnx')P.remove();
 if(e.target.id=='pnc')cp(V.map(line).join('\n\n'),'Kopirano '+V.length);
 if(e.target.id=='pnf'){ki=!ki;try{localStorage['pn-ki']=ki?'1':'0';}catch(x){}draw();}};
})();
};

// ---------- Moji dodijeljeni nalozi ----------
var MOJI=function(){
(async function(){
var D=document,P=D.getElementById('pd');if(P){P.remove();return;}
var back=location.hash.slice(1),sleep=function(x){return new Promise(function(r){setTimeout(r,x);});};
var Z='Instalacija kod korisnika (Optika)';
var tx=function(c){return c.textContent.trim();};
var hdr=function(){return[].find.call(D.querySelectorAll('table'),function(t){return t.querySelector('th')&&[].some.call(t.rows[0].cells,function(c){return tx(c)=='Zadatak';})&&[].some.call(t.rows[0].cells,function(c){return tx(c)=='Kartica';});});};
var h=hdr();if(!h){alert('Nema liste zadataka.');return;}
var H=[].map.call(h.rows[0].cells,tx),I=function(n){return H.indexOf(n);};
var iK=I('Kartica'),iZ=I('Zadatak'),iA=I('Adresa instalacije'),iN=I('Naziv korisnika'),iP=I('Proces'),iC=I('CX identifikator'),iT=I('Dogovoreni termin'),iO=I('Obvezujuće vrijeme'),iB=I('Broj kontakta'),iS=I('Datum početka'),iTC=I('Tip CPE-a');
var data=function(){var x=hdr();return[].find.call(D.querySelectorAll('table'),function(t){return t!=x&&t.rows.length&&t.rows[0].cells.length==H.length&&!t.querySelector('th');});};
var pt=function(){var m=D.body.innerText.match(/(\d+)-(\d+) od (\d+)/);return m?m[0]:'';};
var btn=function(l){return D.querySelector('img[aria-label="'+l+'"]');};
var fire=function(e){['mousedown','mouseup','click'].forEach(function(t){e.dispatchEvent(new MouseEvent(t,{bubbles:true,view:window}));});};
var wait=function(old){return new Promise(function(r){var n=0,i=setInterval(function(){if(pt()!=old||++n>60){clearInterval(i);setTimeout(r,300);}},150);});};
var first=async function(){var f=btn('First page');if(f&&f.getAttribute('aria-disabled')=='false'){var o=pt();fire(f);await wait(o);}};
var next=async function(){var n=btn('Next page');if(!n||n.getAttribute('aria-disabled')!='false')return 0;var o=pt();fire(n);await wait(o);return 1;};
var css='<style>#pd{position:fixed;inset:0;z-index:99999;background:#fff;color:#222;overflow:auto;padding:12px 16px;font:15px sans-serif}#pd .b{border:1px solid #e20074;border-radius:6px;padding:7px 10px;background:#fff;color:#e20074}#pd .p{background:#e20074;color:#fff}#pd .r{padding:10px 0;border-bottom:1px solid #ddd;display:flex;gap:8px;align-items:center}#pd .r>div:first-child{flex:1;min-width:0}#pd .r>div+div{display:grid;gap:6px}#pd .k{font-size:20px;font-weight:bold}#pd .t{font-weight:bold;color:#e20074}#pd .x{color:#b00020;font-weight:bold}#pd small{color:#666}#pd .z{white-space:pre-wrap;background:#fff4dc;border-radius:6px;padding:6px 8px;margin-top:6px;font-size:13px}#pd a.b{text-decoration:none;text-align:center}#pd .r>div+div{grid-template-columns:1fr 1fr}#pd .d{background:#b00020;color:#fff;font-size:11px;padding:1px 5px;border-radius:3px;vertical-align:3px}#pd .rt{background:#fdecee;border-left:4px solid #b00020;padding-left:8px}#pd .rx{background:#fff3e6;border-left:4px solid #d35400;padding-left:8px}#pd .dx{background:#d35400}#pd .op{background:#eef6ee;border-radius:8px;padding:8px 10px;margin:8px 0;font-size:14px}#pd .op b{display:block}.pdt{position:fixed;left:30%;bottom:24px;background:#222;color:#fff;padding:9px;border-radius:6px}</style>';
P=D.createElement('div');P.id='pd';P.innerHTML=css+'<b>Učitavam naloge…</b>';D.body.appendChild(P);
await first();
var m={},L=[],pages=0,rows=0;
do{var t=data();
 if(t)[].forEach.call(t.rows,function(r){var c=[].map.call(r.cells,tx),k=c[iK],z=c[iZ];if(!k)return;rows++;
  var o=m[k];if(!o){o=m[k]={k:k,z:[],r:null,a:c[iA].replace(/\s+/g,' ').replace(/\s*,\s*/g,', '),n:(iN<0?'':c[iN])||(iC<0?'':c[iC]),bs:iP>=0&&/^Bitstream/i.test(c[iP]),tel:iB<0?'':c[iB],tc:iTC<0?'':c[iTC].replace(/\s+/g,' ')};L.push(o);}
  if(o.z.indexOf(z)<0)o.z.push(z);
  if(!o.r||z==Z)o.r={z:z,t:iT<0?'':c[iT],s:iS<0?'':c[iS],o:iO<0?'':c[iO]};});
 pages++;P.querySelector('b').textContent='Učitavam… '+pt();
}while(pages<50&&await next());
await first();
var es=function(s){return s.replace(/[&<"]/g,function(c){return'&#'+c.charCodeAt(0)+';';});};
var dt=function(s){var x=s.match(/\d{4}-(\d\d)-(\d\d) (\d\d:\d\d)/);return x?x[2]+'.'+x[1]+'.'+(x[3]=='00:00'?'':' '+x[3]):'';};
var toast=function(s){var t=D.createElement('div');t.className='pdt';t.textContent=s;P.appendChild(t);setTimeout(function(){t.remove();},1500);};
var cp=function(s){var fb=function(){var a=D.createElement('textarea');a.value=s;P.appendChild(a);a.select();var ok;try{ok=D.execCommand('copy');}catch(e){}a.remove();ok?toast('Kopirano '+s):prompt('Kopiraj:',s);};
 navigator.clipboard?navigator.clipboard.writeText(s).then(function(){toast('Kopirano '+s);},fb):fb();};
var main=function(o){return o.z.indexOf(Z)>=0?Z:o.z.join(' + ');};
var busy=0,stop=0;
var two=function(n){return(n<10?'0':'')+n;},nd=new Date(),today=nd.getFullYear()+'-'+two(nd.getMonth()+1)+'-'+two(nd.getDate());
var ob=function(o){return (o.r.o||'').slice(0,10);},isT=function(o){return ob(o)==today;},isX=function(o){var d=ob(o);return !!d&&d<today;};
var grp=function(o){return isT(o)?0:isX(o)?1:2;};
L=L.map(function(o,i){o.i=i;return o;}).sort(function(a,b){return grp(a)-grp(b)||a.i-b.i;});
var TD=L.filter(isT);
var opt=function(o){return o.z.indexOf(Z)>=0||o.z.indexOf('FTTH kućna instalacija')>=0;};
var tel=function(n){n=(n||'').replace(/[^\d+]/g,'');return /^385/.test(n)?'+'+n:n;};
var nav=function(a){return 'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(a);};
var RT=L.slice(0,10),route='https://www.google.com/maps/dir//'+RT.map(function(o){return encodeURIComponent(o.a);}).join('/');
P.innerHTML=css+'<button id=pdx class=b style=float:right>Zatvori</button><b style=font-size:18px>Moji nalozi: '+L.length+' kartica</b><br><small>'+rows+' zadataka na listi'+(TD.length?' · obvezujuće danas '+TD.length:'')+' · <span id=pdn></span></small>'
 +'<p><a class="b p" target=_blank href="'+route+'">🧭 Ruta ('+RT.length+(L.length>10?' od '+L.length:'')+')</a> <button id=pdq class=b>Provjeri opremu</button></p><div id=pdo></div>'
 +L.map(function(o,i){var tm=dt(o.r.t),st=dt(o.r.s),ob=dt(o.r.o);
  return'<div class="r'+(isT(o)?' rt':isX(o)?' rx':'')+'"><div><span class=k>'+o.k+'</span>'+(isT(o)?' <span class=d>DANAS</span>':isX(o)?' <span class="d dx">ISTEKLO</span>':'')+'<br><span class=t>'+es(main(o))+'</span><br>'+es(o.a)+'<br><small>'+es(o.n+(o.bs?' · Bitstream':''))+(o.tel?' · '+es(o.tel):'')+'</small>'
  +(tm?'<br><span class=x>Termin: '+tm+'</span>':'')+(st?'<br><span class=x>Početak: '+st+'</span>':'')+(ob?'<br>'+(isT(o)||isX(o)?'<span class=x>':'<small>')+'Obvezujuće: '+ob+(isT(o)||isX(o)?'</span>':'</small>'):'')+(o.tc?'<br><small>Usluge: '+es(o.tc)+'</small>':'')+'</div>'
  +'<div><button class="b p" data-o='+i+'>Otvori</button>'+(o.tel?'<a class=b href="tel:'+tel(o.tel)+'">📞 Nazovi</a>':'<span></span>')+'<a class=b target=_blank href="'+nav(o.a)+'">🧭 Navigacija</a><button class=b data-c='+i+'>Kopiraj</button><button class=b data-z='+i+'>Zabilješka</button></div></div>';}).join('')
 +(L.length?'':'<p>Nema naloga.</p>');
var note=async function(o,el){if(busy)return;busy=1;var z=el.querySelector('.z')||el.appendChild(D.createElement('div'));z.className='z';z.textContent='Učitavam zabilješku…';
 location.hash='yellow-notes:ticketId='+o.k;var t='',i;
 for(i=0;i<60;i++){await sleep(250);t=D.body.innerText;if(t.indexOf('kartica: '+o.k)>=0||i>16&&t.indexOf('Nova zabilješka')>=0)break;}
 var j=t.indexOf('Osvježi'),s=t.slice(j+7),mm=j<0?0:s.match(RegExp('kartica: '+o.k+' \\|[^\\n]*'));
 z.textContent=mm?s.slice(0,mm.index).trim()+'\n— '+((mm[0].match(/podnosilac: ([^(|]+)/)||[])[1]||'').trim()+' · '+((mm[0].match(/(\d{4}-\d\d-\d\d)[^|]*\| podnosilac/)||[])[1]||''):'Nema zabilješki.';
 location.hash=back;for(i=0;i<40;i++){await sleep(250);if(data())break;}busy=0;};
var open=async function(o){stop=1;while(busy)await sleep(100);busy=1;toast('Otvaram '+o.k);await first();
 do{var t=data(),r=t&&[].find.call(t.rows,function(r){return tx(r.cells[iK])==o.k&&tx(r.cells[iZ])==o.r.z;});
  if(r){P.remove();fire(r.cells[iK].querySelector('div')||r.cells[iK]);return;}}while(await next());
 busy=0;toast('Nalog nije pronađen');};
P.onclick=function(e){var b=e.target.closest('[data-o],[data-c],[data-z]');if(e.target.id=='pdx'){stop=1;P.remove();}if(e.target.id=='pdq')gear();if(!b)return;
 var d=b.dataset;if(d.c)cp(L[d.c].k);if(d.o)open(L[d.o]);if(d.z)note(L[d.z],b.closest('.r').firstChild);};
var gear=async function(){var box=D.getElementById('pdo');stop=1;while(busy)await sleep(100);busy=1;box.className='op';box.textContent='Učitavam CPE dostupnost…';
 location.hash='available-item-list:null';var t=null,i;
 for(i=0;i<60;i++){await sleep(250);t=[].find.call(D.querySelectorAll('table'),function(x){return x.rows[0]&&/Serijski broj/.test(x.rows[0].textContent);});if(t&&t.rows.length>1)break;}
 var C={opt:0,ont:0,stb:0,modem:0},ok=!!t;
 if(t){var hh=[].map.call(t.rows[0].cells,tx),jT=hh.indexOf('Tip'),jM=hh.indexOf('Model');
  [].slice.call(t.rows,1).forEach(function(r){var c=[].map.call(r.cells,tx);if(c.length<hh.length)return;var tp=c[jT],md=c[jM];
   if(/COMBO ONT|GPON/i.test(md))C.opt++;else if(tp=='ONT')C.ont++;else if(/STB/i.test(tp))C.stb++;else if(tp=='Modem')C.modem++;});}
 location.hash=back;for(i=0;i<40;i++){await sleep(250);if(data())break;}busy=0;
 if(!ok){box.textContent='Ne mogu pročitati CPE dostupnost.';return;}
 var need={opt:[],ont:[],stb:[]};L.forEach(function(o){if(opt(o))(o.bs?need.ont:need.opt).push(o.k);if(/TV/.test(o.tc))need.stb.push(o.k);});
 var ln=function(n,k,have){var l=need[k];if(!l.length)return'';return'<br>'+(have>=l.length?'✅':'⚠️')+' '+n+': treba '+l.length+', imaš '+have+' <small>('+l.join(', ')+')</small>';};
 box.innerHTML='<b>Oprema na stanju</b>Optički modem (Combo ONT / GPON): '+C.opt+' · ONT: '+C.ont+' · STB: '+C.stb+' · Modem: '+C.modem
  +'<b style=margin-top:6px>Za tvoje naloge (procjena)</b>'+(ln('Optički modem','opt',C.opt)+ln('ONT (Bitstream)','ont',C.ont)+ln('STB za TV','stb',C.stb)||'<br>Nalozi ne traže ovu opremu.');};
(async function(){var rs=P.querySelectorAll('.r'),pn=D.getElementById('pdn');
 for(var i=0;i<L.length&&!stop;i++){if(pn)pn.textContent='zabilješke '+(i+1)+'/'+L.length;await note(L[i],rs[i].firstChild);}
 if(pn)pn.textContent=stop?'':'zabilješke učitane';})();
})();
};

// ---------- Zabilješke za zalijepljene kartice ----------
var KART=function(){
(async function(){
var D=document,P=D.getElementById('pz');if(P){P.remove();return;}
var sl=function(x){return new Promise(function(r){setTimeout(r,x);});};
var vis=function(e){return e&&e.offsetParent;};
var fire=function(e){['mousedown','mouseup','click'].forEach(function(t){e.dispatchEvent(new MouseEvent(t,{bubbles:true,view:window}));});};
var btn=function(t){return[].find.call(D.querySelectorAll('button'),function(b){return vis(b)&&b.textContent.trim()==t&&!P.contains(b);});};
var until=async function(f,ms){for(var i=0;i<(ms||10000)/200;i++){var v=f();if(v)return v;await sl(200);}return null;};
var es=function(s){return String(s).replace(/[&<"]/g,function(c){return'&#'+c.charCodeAt(0)+';';});};
var S=function(k,v){try{if(v===undefined)return localStorage[k]||'';localStorage[k]=v;}catch(e){}};
var css='<style>#pz{position:fixed;inset:0;z-index:99999;background:#fff;color:#222;overflow:auto;padding:12px 16px;font:15px sans-serif}#pz .b{border:1px solid #e20074;border-radius:6px;padding:7px 10px;background:#fff;color:#e20074;margin:0 6px 6px 0}#pz .p{background:#e20074;color:#fff}#pz textarea{width:100%;height:110px;box-sizing:border-box;font:14px monospace;margin:8px 0}#pz .r{padding:10px 0;border-bottom:1px solid #ddd;display:flex;gap:8px;align-items:flex-start}#pz .r>div:first-child{flex:1;min-width:0}#pz .k{font-size:20px;font-weight:bold}#pz small{color:#666}#pz .z{white-space:pre-wrap;background:#fff4dc;border-radius:6px;padding:6px 8px;margin-top:6px;font-size:13px}#pz .e{color:#b00020}.pzt{position:fixed;left:30%;bottom:24px;background:#222;color:#fff;padding:9px;border-radius:6px}</style>';
P=D.createElement('div');P.id='pz';D.body.appendChild(P);
var toast=function(s){var t=D.createElement('div');t.className='pzt';t.textContent=s;P.appendChild(t);setTimeout(function(){t.remove();},1500);};
var cp=function(s,g){var fb=function(){var a=D.createElement('textarea');a.value=s;P.appendChild(a);a.select();var ok;try{ok=D.execCommand('copy');}catch(e){}a.remove();ok?toast(g):prompt('Kopiraj:',s);};
 navigator.clipboard?navigator.clipboard.writeText(s).then(function(){toast(g);},fb):fb();};
var L=[],stop=0,run=0;
var txt=function(o){return o.k+(o.a?'\n'+o.a:'')+'\n'+(o.n?o.n+(o.w?'\n— '+o.w:''):(o.err||'Nema zabilješki'));};
var draw=function(msg){
 P.innerHTML=css+'<button id=pzx class=b style=float:right>Zatvori</button><b style=font-size:18px>Zabilješke kartica</b>'
 +(run?'<p><b>'+es(msg||'')+'</b><br><button id=pzs class=b>Zaustavi</button></p>'
  :'<textarea id=pzi placeholder="Zalijepi kartice (iz Excela, maila…)">'+es(S('pz-in'))+'</textarea><button id=pzg class="b p">Pokreni</button>'+(L.length?'<button id=pzc class=b>Kopiraj sve</button>':'')+(msg?'<br><small>'+es(msg)+'</small>':''))
 +L.map(function(o,i){return'<div class=r><div><span class=k>'+o.k+'</span>'+(o.s?' <small>'+es(o.s)+'</small>':'')+'<br>'+es(o.a||'')
  +(o.done?'<div class=z>'+(o.err?'<span class=e>'+es(o.err)+'</span>':es(o.n||'Nema zabilješki.')+(o.w?'\n— '+es(o.w):''))+'</div>':'<br><small>čeka…</small>')
  +'</div><div><button class=b data-c='+i+'>Kopiraj</button></div></div>';}).join('');};
var one=async function(o){
 // 1) Kartice -> pretraga
 var a=[].find.call(D.querySelectorAll('a.gwt-Anchor'),function(x){return x.textContent.trim()=='Kartice';});
 if(!a)throw'Nema izbornika Kartice';fire(a);
 var inp=await until(function(){return location.hash.indexOf('#ticket-search')==0&&[].find.call(D.querySelectorAll('input.gwt-TextBox'),function(e){return vis(e)&&!P.contains(e);});});
 if(!inp)throw'Pretraga se nije otvorila';
 inp.focus();inp.value=o.k;inp.dispatchEvent(new Event('input',{bubbles:true}));inp.dispatchEvent(new Event('change',{bubbles:true}));
 var t=await until(function(){return btn('Traži');});if(!t)throw'Nema gumba Traži';
 var lis=function(){return[].filter.call(D.querySelectorAll('li'),function(e){return!P.contains(e)&&e.textContent.indexOf(' | ')>0;});};
 var old=lis(),ot=old.map(function(e){return e.textContent;});t.click();
 // 2) rezultat (samo novi, ne ostaci prethodne pretrage)
 var res=await until(function(){if(location.hash.indexOf('value='+o.k)<0)return null;var l=lis().filter(function(e){var i=old.indexOf(e);return vis(e)&&(i<0||ot[i]!=e.textContent);});return l.length?l:null;},12000);
 if(!res){o.err='Kartica nije pronađena';return;}
 var li=res.find(function(e){return/ \| A \| /.test(e.textContent);})||res[0],s=li.textContent.trim(),p=s.split(' | ');
 var j=p[0].lastIndexOf(' - ');o.a=(j>0?p[0].slice(j+3):'').trim();o.s=(p[1]||'')=='A'?'':(p[1]||'');
 fire(li);
 // 3) kartica -> zabilješke
 var zb=await until(function(){return location.hash.indexOf('#ticket:ticketId='+o.k)==0&&btn('Zabilješke');},15000);
 if(!zb){o.err='Kartica se nije otvorila';return;}
 try{
  zb.click();var T='';
  await until(function(){T=D.body.innerText;return location.hash.indexOf('#yellow-notes')==0&&(T.indexOf('kartica: '+o.k)>=0);},6000);
  T=D.body.innerText;var i=T.indexOf('Osvježi'),r=T.slice(i+7),m=i<0?0:r.match(RegExp('kartica: '+o.k+' \\|[^\\n]*'));
  if(m){o.n=r.slice(0,m.index).trim();o.w=(((m[0].match(/podnosilac: ([^(|]+)/)||[])[1]||'').trim()+' · '+((m[0].match(/podnošenja: (\d{4})-(\d\d)-(\d\d)/)||[]).slice(1).reverse().join('.'))).replace(/ · $/,'');}
 }finally{
  // 4) Natrag -> Napusti karticu
  if(location.hash.indexOf('#yellow-notes')==0){var n=await until(function(){return btn('Natrag');},5000);if(n)n.click();}
  var nk=await until(function(){return location.hash.indexOf('#ticket:')==0&&btn('Napusti karticu');},8000);
  if(nk){nk.click();await until(function(){return location.hash.indexOf('#ticket:')!=0;},8000);}
  else o.err=(o.err?o.err+' · ':'')+'Nisam našao „Napusti karticu“';
 }};
var go=async function(){
 var v=P.querySelector('#pzi').value;S('pz-in',v);var ks=[],x=v.match(/\b\d{8}\b/g)||[];x.forEach(function(k){if(ks.indexOf(k)<0)ks.push(k);});
 if(!ks.length)return toast('Nema brojeva kartica');
 L=ks.map(function(k){return{k:k};});run=1;stop=0;
 for(var i=0;i<L.length&&!stop;i++){draw('Kartica '+(i+1)+' / '+L.length+' – '+L[i].k);
  try{await one(L[i]);}catch(e){L[i].err=String(e);}L[i].done=1;}
 run=0;var bad=L.filter(function(o){return o.err;}).length;draw((stop?'Zaustavljeno. ':'Gotovo. ')+L.filter(function(o){return o.done;}).length+' kartica'+(bad?', '+bad+' s greškom':''));
 var a=[].find.call(D.querySelectorAll('a.gwt-Anchor'),function(x){return x.textContent.trim()=='Kartice';});if(a)fire(a);};
P.onclick=function(e){var t=e.target,c=t.closest('[data-c]');
 if(t.id=='pzx'){stop=1;P.remove();}else if(t.id=='pzs'){stop=1;t.textContent='Zaustavljam…';}else if(t.id=='pzg')go();
 else if(t.id=='pzc')cp(L.filter(function(o){return o.done;}).map(txt).join('\n\n'),'Kopirano sve');else if(c)cp(txt(L[c.dataset.c]),'Kopirano '+L[c.dataset.c].k);};
draw();
})();
};

// ---------- Gumb ----------
var hasCol=function(n){return [].some.call(document.querySelectorAll('th'),function(c){return c.textContent.trim()==n;});};
var run=function(){
 var h=location.hash;
 if(document.getElementById('pk')||document.getElementById('pn')||document.getElementById('pd')||document.getElementById('pz')){['pk','pn','pd','pz'].forEach(function(i){var e=document.getElementById(i);if(e)e.remove();});return;}
 if(/^#(ticket-search|tickets:|ticket:|yellow-notes)/.test(h))KART();
 else if(/parked-tasks/.test(h)||hasCol('Parkirano do'))PARK();
 else if(/new-tasks/.test(h))NOVE();
 else if(hasCol('Kartica')&&hasCol('Zadatak'))MOJI();
 else KART();
};
run();
})();
