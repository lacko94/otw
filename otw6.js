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

// ---------- Zabilješke za zalijepljene kartice (brzo, preko OTW servera) ----------
var KART=function(){
(async function(){
var D=document,P=D.getElementById('pz');if(P){P.remove();return;}
var es=function(s){return String(s==null?'':s).replace(/[&<"]/g,function(c){return'&#'+c.charCodeAt(0)+';';});};
var S=function(k,v){try{if(v===undefined)return localStorage[k]||'';localStorage[k]=v;}catch(e){}};
var css='<style>#pz{position:fixed;inset:0;z-index:99999;background:#fff;color:#222;overflow:auto;padding:12px 16px;font:15px sans-serif}#pz .b{border:1px solid #e20074;border-radius:6px;padding:7px 10px;background:#fff;color:#e20074;margin:0 6px 6px 0;cursor:pointer}#pz .p{background:#e20074;color:#fff}#pz textarea{width:100%;height:110px;box-sizing:border-box;font:14px monospace;margin:8px 0}#pz .r{padding:10px 0;border-bottom:1px solid #ddd;display:flex;gap:8px;align-items:flex-start}#pz .r>div:first-child{flex:1;min-width:0}#pz .k{font-size:20px;font-weight:bold}#pz small{color:#666}#pz .pk{background:#1565c0;color:#fff;border-radius:3px;padding:1px 5px;font-size:11px;vertical-align:3px}#pz .z{white-space:pre-wrap;background:#fff4dc;border-radius:6px;padding:6px 8px;margin-top:6px;font-size:13px}#pz .e{color:#b00020}.pzt{position:fixed;left:30%;bottom:24px;background:#222;color:#fff;padding:9px;border-radius:6px}</style>';
P=D.createElement('div');P.id='pz';D.body.appendChild(P);
var toast=function(s){var t=D.createElement('div');t.className='pzt';t.textContent=s;P.appendChild(t);setTimeout(function(){t.remove();},1500);};
var cp=function(s,g){var fb=function(){var a=D.createElement('textarea');a.value=s;P.appendChild(a);a.select();var ok;try{ok=D.execCommand('copy');}catch(e){}a.remove();ok?toast(g):prompt('Kopiraj:',s);};
 navigator.clipboard?navigator.clipboard.writeText(s).then(function(){toast(g);},fb):fb();};
// --- GWT RPC ---
var B64='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$_';
var enc=function(n){var s='';do{s=B64[n%64]+s;n=Math.floor(n/64);}while(n>0);return s;};
var base=location.origin+'/OTW/otw/',perm,TP='290BF2F2BB83047DCFAE4C1AF6B19DEF',XP='E1EF26ED6384B9AF4934C71870F2E259',tok;
var post=async function(svc,body){var r=await fetch(base+svc,{method:'POST',credentials:'include',headers:{'Content-Type':'text/x-gwt-rpc; charset=utf-8','X-GWT-Module-Base':base,'X-GWT-Permutation':perm},body:body});
 var t=await r.text();if(t.indexOf('//OK')!=0)throw(t.indexOf('//EX')==0?'OTW greška (možda istekla prijava)':'HTTP '+r.status);return Function('return '+t.slice(4))();};
var init=async function(){
 var sc=[].map.call(D.scripts,function(s){return s.src;}).find(function(u){return/\/otw\/[0-9A-F]{32}\.cache\.js/.test(u);});
 if(!sc)throw'Nisam našao OTW modul – otvori OTW i prijavi se';perm=sc.match(/([0-9A-F]{32})\.cache/)[1];
 try{var js=await(await fetch(sc)).text(),m=js.match(/'task','([0-9A-F]{32})'/),x=js.match(/null,'([0-9A-F]{32})',\w+\)\}/);if(m)TP=m[1];if(x)XP=x[1];}catch(e){}
 var a=await post('xsrf','7|0|4|'+base+'|'+XP+'|com.google.gwt.user.client.rpc.XsrfTokenService|getNewXsrfToken|1|2|3|4|0|');
 tok=a[a.length-3][1];if(!/^[0-9A-F]{32}$/.test(tok||''))throw'Nema XSRF tokena';};
var hdr=function(n,strs){return'7|2|'+n+'|'+base+'|'+TP+'|com.google.gwt.user.client.rpc.XsrfToken/4254043109|'+tok+'|hr.scvc.otw.gwt.main.client.service.OtwService|'+strs;};
var isType=function(s){return/^[\w.$]+\/\d+$/.test(s);};
var card=async function(o){
 var k=+o.k;
 var q=await Promise.all([
  post('task',hdr(10,'getTicketList|java.lang.String/2004016611|Z|TICKET_ID|'+o.k+'|1|2|3|4|5|6|4|7|7|8|8|9|10|0|0|')),
  post('task',hdr(7,'getYellowNotes|java.lang.Long/4227064769|1|2|3|4|5|6|1|7|7|'+enc(k)+'|'))]);
 // kartica: adresa, proces, parkirana
 var tl=q[0][q[0].length-3],st=tl.filter(function(s){return!isType(s);});
 if(!tl.some(function(s){return/TicketListItem/.test(s);})){o.err='Kartica nije pronađena';}
 else{o.a=st[0]||'';o.pr=st[1]||'';}
 // zabilješke: ArrayList<YellowNote>
 var d=q[1],T=d[d.length-3],i=d.length-4,rd=function(){return d[i--];},s=function(x){return x>0?T[x-1]:'';};
 var L=[];if(/ArrayList/.test(s(rd()))){var n=rd();for(var j=0;j<n;j++){rd();var f1=rd(),tx=s(rd()),f3=rd(),dx=s(rd()),wx=s(rd()),stt=s(rd()),dp=s(rd()),pod=s(rd());rd();L.push({t:tx.trim(),d:dp,w:pod});}}
 L.sort(function(a,b){return a.d<b.d?1:-1;});o.cnt=L.length;
 if(L[0]){var z=L[0],dm=z.d.match(/(\d{4})-(\d\d)-(\d\d)/);o.n=z.t;o.w=z.w.replace(/\s*\(.*$/,'')+(dm?' · '+dm[3]+'.'+dm[2]+'.'+dm[1]:'');}
};
// --- UI ---
var L=[],run=0,stop=0;
var txt=function(o){return o.k+(o.a?'\n'+o.a:'')+'\n'+(o.err||(o.n?o.n+'\n— '+o.w:'Nema zabilješki'));};
var csv=function(){
 var r=[['Kartica','Adresa','Zadnja zabilješka','Napisao','Broj zabilješki','Proces']].concat(L.filter(function(o){return o.done;}).map(function(o){return[+o.k,o.a||'',o.err||o.n||'',o.w||'',o.cnt||0,o.pr||''];}));
 var X=function(s){return String(s).replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g,'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');};
 var col=function(i){return'ABCDEFGHIJ'[i];};
 var sh='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>'
  +[12,32,70,24,10,45].map(function(w,i){return'<col min="'+(i+1)+'" max="'+(i+1)+'" width="'+w+'" customWidth="1"/>';}).join('')+'</cols><sheetData>'
  +r.map(function(row,y){return'<row r="'+(y+1)+'">'+row.map(function(v,x){var ref=col(x)+(y+1),st=y?2:1;
   return typeof v=='number'?'<c r="'+ref+'" s="'+st+'"><v>'+v+'</v></c>':'<c r="'+ref+'" s="'+st+'" t="inlineStr"><is><t xml:space="preserve">'+X(v)+'</t></is></c>';}).join('')+'</row>';}).join('')
  +'</sheetData><autoFilter ref="A1:F'+r.length+'"/></worksheet>';
 var F={'[Content_Types].xml':'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>',
  '_rels/.rels':'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
  'xl/workbook.xml':'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Kartice" sheetId="1" r:id="rId1"/></sheets><definedNames><definedName name="_xlnm._FilterDatabase" localSheetId="0" hidden="1">Kartice!$A$1:$F$'+r.length+'</definedName></definedNames></workbook>',
  'xl/_rels/workbook.xml.rels':'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>',
  'xl/styles.xml':'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFE20074"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left/><right/><top/><bottom style="thin"><color rgb="FFDDDDDD"/></bottom><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>',
  'xl/worksheets/sheet1.xml':sh};
 // ZIP (bez kompresije)
 var te=new TextEncoder(),ct=[],c,n,k;for(n=0;n<256;n++){c=n;for(k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;ct[n]=c>>>0;}
 var crc=function(b){var c=-1;for(var i=0;i<b.length;i++)c=ct[(c^b[i])&255]^(c>>>8);return(c^-1)>>>0;};
 var parts=[],cen=[],off=0,cnt=0;
 var hd=function(sz){var b=new Uint8Array(sz);return[b,new DataView(b.buffer)];};
 Object.keys(F).forEach(function(nm){var nb=te.encode(nm),db=te.encode(F[nm]),cr=crc(db),h=hd(30),d=h[1];
  d.setUint32(0,0x04034b50,true);d.setUint16(4,20,true);d.setUint16(6,0x800,true);d.setUint32(14,cr,true);d.setUint32(18,db.length,true);d.setUint32(22,db.length,true);d.setUint16(26,nb.length,true);
  parts.push(h[0],nb,db);var g=hd(46),e=g[1];
  e.setUint32(0,0x02014b50,true);e.setUint16(4,20,true);e.setUint16(6,20,true);e.setUint16(8,0x800,true);e.setUint32(16,cr,true);e.setUint32(20,db.length,true);e.setUint32(24,db.length,true);e.setUint16(28,nb.length,true);e.setUint32(42,off,true);
  cen.push(g[0],nb);off+=30+nb.length+db.length;cnt++;});
 var cs=cen.reduce(function(s,b){return s+b.length;},0),z=hd(22),q=z[1];
 q.setUint32(0,0x06054b50,true);q.setUint16(8,cnt,true);q.setUint16(10,cnt,true);q.setUint32(12,cs,true);q.setUint32(16,off,true);
 var a=D.createElement('a');a.href=URL.createObjectURL(new Blob(parts.concat(cen,[z[0]]),{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
 var dt=new Date();a.download='zabiljeske-kartica-'+dt.getDate()+'-'+(dt.getMonth()+1)+'.xlsx';P.appendChild(a);a.click();a.remove();};
var draw=function(msg){
 P.innerHTML=css+'<button id=pzx class=b style=float:right>Zatvori</button><b style=font-size:18px>Zabilješke kartica</b>'
 +(run?'<p><b>'+es(msg)+'</b><br><button id=pzs class=b>Zaustavi</button></p>'
  :'<textarea id=pzi placeholder="Zalijepi kartice (iz Excela, maila…)">'+''+'</textarea><button id=pzg class="b p">Pokreni</button>'+(L.length?'<button id=pzc class=b>Kopiraj sve</button><button id=pze class=b>Excel</button>':'')+(msg?'<br><small>'+es(msg)+'</small>':''))
 +L.map(function(o,i){return'<div class=r><div><span class=k>'+o.k+'</span>'+'<br>'+es(o.a)
  +(o.done?'<div class=z>'+(o.err?'<span class=e>'+es(o.err)+'</span>':o.n?es(o.n)+'\n— '+es(o.w)+(o.cnt>1?' <small>('+o.cnt+(o.cnt%10>1&&o.cnt%10<5&&(o.cnt%100<12||o.cnt%100>14)?' zabilješke':' zabilješki')+')</small>':''):'Nema zabilješki.')+'</div>':'<br><small>čeka…</small>')
  +'</div><div><button class=b data-c='+i+'>Kopiraj</button></div></div>';}).join('');};
var go=async function(){
 var v=P.querySelector('#pzi').value;S('pz-in',v);var ks=[];(v.match(/\b\d{8}\b/g)||[]).forEach(function(k){if(ks.indexOf(k)<0)ks.push(k);});
 if(!ks.length)return toast('Nema brojeva kartica');
 L=ks.map(function(k){return{k:k};});run=1;stop=0;draw('Spajam se…');
 try{await init();}catch(e){run=0;L=[];return draw(String(e));}
 var t0=Date.now(),next=0,done=0,last=0;
 var worker=async function(){while(!stop&&next<L.length){var o=L[next++];
  try{await card(o);}catch(e){o.err=String(e);}o.done=1;done++;
  if(Date.now()-last>400){last=Date.now();draw(done+' / '+L.length);}}};
 await Promise.all([worker(),worker(),worker(),worker()]);
 run=0;var bad=L.filter(function(o){return o.err;}).length;
 draw((stop?'Zaustavljeno. ':'Gotovo. ')+done+' kartica za '+Math.round((Date.now()-t0)/1000)+' s'+(bad?', '+bad+' s greškom':''));};
P.onclick=function(e){var t=e.target,c=t.closest('[data-c]');
 if(t.id=='pzx'){stop=1;P.remove();}else if(t.id=='pzs'){stop=1;t.textContent='Zaustavljam…';}else if(t.id=='pzg')go();else if(t.id=='pze')csv();
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
