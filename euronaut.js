(() => {
'use strict';
const $ = id => document.getElementById(id);
const els = {
  currentCountry:$('current-country'), currentCapital:$('current-capital'), totalDistance:$('total-distance'),
  visitedCount:$('visited-count'), sceneCountry:$('scene-country'), sceneStatus:$('scene-status'),
  canvas:$('scene-canvas'), progress:$('journey-progress'), briefing:$('briefing'), game:$('game-panel'),
  summary:$('summary-panel'), dailyDate:$('daily-date'), briefingStart:$('briefing-start'),
  turn:$('turn-label'), category:$('question-category'), prompt:$('question-prompt'), hint:$('question-hint'),
  form:$('answer-form'), input:$('answer-input'), message:$('answer-message'), feedback:$('feedback-panel'),
  feedbackKicker:$('feedback-kicker'), feedbackTitle:$('feedback-title'), feedbackRoute:$('feedback-route'),
  feedbackDistance:$('feedback-distance'), feedbackBadge:$('feedback-badge'), feedbackDetail:$('feedback-detail'),
  continue:$('continue-btn'), finalDistance:$('final-distance'), finalCountries:$('final-countries'),
  recap:$('journey-recap'), modal:$('how-modal')
};
let data, countries, templates, current, visited, usedQuestions, categoryCounts, turn, totalKm, history, currentQuestion, rng, dailySeed, animFrame=0;

const BADGES = [
  {min:0,max:499,label:'LOCAL EXPLORER',className:'Local Explorer'},
  {min:500,max:1499,label:'REGIONAL VOYAGER',className:'Regional Voyager'},
  {min:1500,max:2999,label:'CONTINENTAL TRAVELLER',className:'Continental Traveller'},
  {min:3000,max:5999,label:'GRAND VOYAGER',className:'Grand Voyager'},
  {min:6000,max:Infinity,label:'LEGENDARY EXPEDITION',className:'Legendary Expedition'}
];
const norm = value => String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,' ').trim();
function hashString(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function seeded(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
function shuffle(items, random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function distanceKm(a,b){const rad=x=>x*Math.PI/180;const dLat=rad(b.lat-a.lat),dLon=rad(b.lon-a.lon);const h=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLon/2)**2;return 6371.0088*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h))}
function badgeFor(km){return BADGES.find(b=>km>=b.min&&km<=b.max)||BADGES[0]}
function allNames(c){return [c.name,...(c.aliases||[])].map(norm)}
function countryMatchesTag(c,question){const required=question.tags||[question.tag];return required.every(tag=>(c.tags||[]).includes(tag))}
function eligibleAnswers(question){
  return countries.filter(c=>c.id!==current.id&&!visited.has(c.id)&&countryMatchesTag(c,question));
}
function chooseQuestion(){
  const pool=templates.filter(q=>!usedQuestions.has(q.id)).map(q=>({q,answers:eligibleAnswers(q)})).filter(x=>x.answers.length>0);
  if(!pool.length)return null;
  // Favor category variety without imposing a rigid category rotation.
  const minCount=Math.min(...pool.map(x=>categoryCounts[x.q.category]||0));
  const varietyPool=pool.filter(x=>(categoryCounts[x.q.category]||0)<=minCount+1);
  const candidates=varietyPool.length?varietyPool:pool;
  const pick=candidates[Math.floor(rng()*candidates.length)];
  usedQuestions.add(pick.q.id);categoryCounts[pick.q.category]=(categoryCounts[pick.q.category]||0)+1;
  return {...pick.q, validIds:new Set(pick.answers.map(c=>c.id)), answerCount:pick.answers.length};
}
function startDailyRun(){
  const date=new Date();const dateKey=[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
  dailySeed=dateKey; rng=seeded(hashString('euronaut-'+dateKey));
  visited=new Set();usedQuestions=new Set();categoryCounts={};turn=0;totalKm=0;history=[];
  // Deterministic daily start, shared by everyone using the same date.
  const startPool=countries.filter(c=>c.status==='sovereign'&&!['Kazakhstan'].includes(c.name));
  current=startPool[Math.floor(rng()*startPool.length)];visited.add(current.id);
  $('daily-date').textContent=dateKey.toUpperCase();$('briefing-start').textContent=current.name;
  els.currentCountry.textContent=current.name;els.currentCapital.textContent=current.capital;els.totalDistance.textContent='0 km';
  els.visitedCount.textContent='1';els.sceneCountry.textContent=current.name.toUpperCase();els.sceneStatus.textContent='READY FOR DEPARTURE';
  $('scene-country').textContent=current.name.toUpperCase();
  renderProgress();drawScene(current);
  els.summary.classList.add('hidden');els.game.classList.add('hidden');els.briefing.classList.remove('hidden');
}
function renderProgress(){
  els.progress.innerHTML='';
  for(let i=0;i<7;i++){
    const d=document.createElement('div');d.className='progress-step'+(i<history.length?(history[i].correct?' done':' missed'):'');
    d.title=`Journey ${i+1}`;els.progress.appendChild(d);
  }
}
function beginGame(){els.briefing.classList.add('hidden');els.summary.classList.add('hidden');els.game.classList.remove('hidden');turn=0;nextQuestion()}
function nextQuestion(){
  if(turn>=7){finishRun();return}
  currentQuestion=chooseQuestion();
  if(!currentQuestion){finishRun();return}
  els.turn.textContent=`JOURNEY ${turn+1} / 7`;
  els.category.textContent=currentQuestion.category.toUpperCase();
  els.prompt.textContent=currentQuestion.prompt;
  els.hint.textContent=`Choose any valid European country or territory you have not visited. ${currentQuestion.answerCount} possible destinations remain.`;
  els.input.value='';els.input.disabled=false;els.form.querySelector('button').disabled=false;
  els.message.textContent='One attempt. Choose your destination wisely.';
  els.message.className='text-sm mt-3 min-h-5 text-inkMuted';
  els.feedback.classList.add('hidden');
  setTimeout(()=>els.input.focus(),60);
}
function findAnswer(raw){
  const key=norm(raw);if(!key)return null;
  const matches=countries.filter(c=>currentQuestion.validIds.has(c.id)&&allNames(c).includes(key));
  return matches.length===1?matches[0]:null;
}
function submitAnswer(e){
  e.preventDefault();if(els.input.disabled)return;
  const raw=els.input.value.trim();if(!raw)return;
  const destination=findAnswer(raw);
  els.input.disabled=true;els.form.querySelector('button').disabled=true;
  if(!destination){
    history.push({turn:turn+1,correct:false,from:current.name,prompt:currentQuestion.prompt,answer:raw});
    els.message.textContent='Not a valid answer for this question. No travel this time.';
    els.message.className='text-sm mt-3 min-h-5 text-[#A33F2D] font-bold';
    showFeedback(false,null,0);
  }else{
    const origin=current;const km=Math.round(distanceKm(origin,destination));
    const badge=badgeFor(km);totalKm+=km;current=destination;visited.add(destination.id);
    history.push({turn:turn+1,correct:true,from:origin.name,to:destination.name,km,badge:badge.label,prompt:currentQuestion.prompt});
    els.currentCountry.textContent=current.name;els.currentCapital.textContent=current.capital;
    els.totalDistance.textContent=`${totalKm.toLocaleString('en-US')} km`;els.visitedCount.textContent=String(visited.size);
    els.sceneCountry.textContent=current.name.toUpperCase();els.sceneStatus.textContent=`IN TRANSIT · ${km.toLocaleString('en-US')} KM`;
    drawScene(current);
    showFeedback(true,destination,km,badge,origin);
  }
  turn++;renderProgress();
}
function showFeedback(correct,destination,km,badge,origin){
  els.feedback.classList.remove('hidden');
  if(correct){
    els.feedbackKicker.textContent='ARRIVAL CONFIRMED';
    els.feedbackTitle.textContent=destination.name;
    els.feedbackRoute.textContent=`${origin.name} → ${destination.name}`;
    els.feedbackDistance.textContent=`${km.toLocaleString('en-US')} km`;
    els.feedbackBadge.textContent=badge.label;
    els.feedbackDetail.textContent=`You travelled between ${origin.capital} and ${destination.capital}. Your total expedition distance is ${totalKm.toLocaleString('en-US')} km.`;
  }else{
    els.feedbackKicker.textContent='NO DEPARTURE';
    els.feedbackTitle.textContent='Journey missed';
    els.feedbackRoute.textContent=`Still in ${current.name}`;
    els.feedbackDistance.textContent='+0 km';
    els.feedbackBadge.textContent='NO BADGE';
    els.feedbackDetail.textContent='The machine stays where it is. A new question will be waiting for you.';
  }
  els.continue.textContent=turn>=7?'View expedition results →':`Next question · ${turn+1}/7 →`;
}
function finishRun(){
  els.game.classList.add('hidden');els.summary.classList.remove('hidden');
  els.finalDistance.textContent=`${totalKm.toLocaleString('en-US')} km`;
  els.finalCountries.textContent=`${visited.size} places visited · ${history.filter(x=>x.correct).length} successful journeys out of 7`;
  els.recap.innerHTML='';
  history.forEach(item=>{
    const row=document.createElement('div');row.className='bg-paper border border-ink rounded-lg p-3 flex flex-wrap justify-between gap-2 items-center';
    const left=document.createElement('div');
    const title=document.createElement('div');title.className='font-bold text-sm';title.textContent=item.correct?`${item.from} → ${item.to}`:`Journey ${item.turn} · No travel`;
    const sub=document.createElement('div');sub.className='text-xs text-inkMuted mt-1';sub.textContent=item.prompt;
    left.append(title,sub);
    const right=document.createElement('div');right.className='mono text-sm font-bold text-right';right.textContent=item.correct?`${item.km.toLocaleString('en-US')} km`: 'MISS';
    if(item.correct){const b=document.createElement('div');b.className='text-[10px] text-inkMuted';b.textContent=item.badge;right.appendChild(b)}
    row.append(left,right);els.recap.appendChild(row);
  });
  renderProgress();els.sceneStatus.textContent='EXPEDITION COMPLETE';
}
function drawScene(country){
  const canvas=els.canvas,ctx=canvas.getContext('2d');const W=640,H=240;
  const tags=country.tags||[];
  let sky='#B7D0D4',far='#8FA7A0',ground='#708C69',accent='#D6B77A',water=false;
  if(tags.includes('nordic')||tags.includes('arctic')||tags.includes('island')){sky='#B8D2D9';far='#A5B9B7';ground='#718E86';accent='#E7E5D9'}
  if(tags.includes('mediterranean')){sky='#E9BFA0';far='#C88C69';ground='#81936B';accent='#F1D69A'}
  if(tags.includes('baltic_sea')||tags.includes('atlantic')||tags.includes('north_atlantic')||tags.includes('coastal'))water=true;
  if(tags.includes('caucasus')||tags.includes('alps')||tags.includes('pyrenees')){far='#84959A';ground='#667C6D';accent='#E2E0D4'}
  ctx.clearRect(0,0,W,H);ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  // low-resolution pixel-art cloud clusters
  for(let i=0;i<8;i++){const x=(i*97+hashString(country.id)%73)%W,y=25+(i%3)*19;ctx.fillStyle='#F2E9D8';ctx.fillRect(x,y,42,8);ctx.fillRect(x+10,y-7,22,8);ctx.fillRect(x+34,y+4,16,5)}
  // distant silhouette
  ctx.fillStyle=far;
  for(let x=0;x<W;x+=32){let h=25+((hashString(country.id+x)%55));ctx.fillRect(x,125-h,32,h+40)}
  if(tags.includes('alps')||tags.includes('caucasus')||tags.includes('pyrenees')||tags.includes('nordic')){
    ctx.fillStyle=accent;
    for(let x=0;x<W;x+=80){ctx.beginPath();ctx.moveTo(x,135);ctx.lineTo(x+38,65+(x%3)*6);ctx.lineTo(x+80,135);ctx.fill();ctx.fillStyle='#F2EDE1';ctx.beginPath();ctx.moveTo(x+25,91);ctx.lineTo(x+38,65+(x%3)*6);ctx.lineTo(x+51,91);ctx.fill();ctx.fillStyle=accent}
  }
  ctx.fillStyle=water?'#6F9DA4':ground;ctx.fillRect(0,150,W,90);
  if(water){ctx.fillStyle='#9EC0C0';for(let i=0;i<18;i++)ctx.fillRect((i*43+animFrame*0.25)%W,174+(i%4)*12,22,3)}
  // foreground pixel grass/stone
  for(let i=0;i<50;i++){ctx.fillStyle=i%2?'#526D54':'#9A9B69';ctx.fillRect((i*29+11)%W,190+(i%5)*8,5,4)}
  // iconic simple local building silhouette (visual motif varies by tags)
  const bx=470,by=143;ctx.fillStyle=tags.includes('mediterranean')?'#F3E7CE':'#8C684C';
  ctx.fillRect(bx,by,72,48);ctx.fillStyle='#5A4A3E';ctx.fillRect(bx+8,by+18,12,30);ctx.fillRect(bx+48,by+18,12,30);
  ctx.fillStyle=tags.includes('mediterranean')?'#B65D48':'#684D3C';ctx.fillRect(bx-5,by-8,82,12);
  ctx.fillStyle='#342F29';ctx.fillRect(bx+29,by+26,14,22);
  // Traveller's machine, kept as the recurring visual anchor
  const mx=animFrame%160;ctx.fillStyle='#3D4746';ctx.fillRect(95+mx,154,110,24);ctx.fillStyle='#C18A43';ctx.fillRect(112+mx,143,64,18);
  ctx.fillStyle='#DCE2D6';ctx.fillRect(127+mx,147,34,10);ctx.fillStyle='#343A38';ctx.fillRect(104+mx,178,18,9);ctx.fillRect(177+mx,178,18,9);
  ctx.fillStyle='#B85A2A';ctx.fillRect(84+mx,160,13,8);ctx.fillRect(205+mx,160,10,8);
  ctx.fillStyle='#E7C77F';ctx.fillRect(143+mx,137,7,7);
}
function animate(){animFrame+=0.35;if(els.canvas&&current)drawScene(current);requestAnimationFrame(animate)}
function setup(){
  $('start-btn').addEventListener('click',beginGame);
  els.form.addEventListener('submit',submitAnswer);
  els.continue.addEventListener('click',nextQuestion);
  $('new-run-btn').addEventListener('click',startDailyRun);
  $('replay-btn').addEventListener('click',startDailyRun);
  $('how-btn').addEventListener('click',()=>els.modal.classList.remove('hidden'));
  $('close-how').addEventListener('click',()=>els.modal.classList.add('hidden'));
  els.modal.addEventListener('click',e=>{if(e.target===els.modal)els.modal.classList.add('hidden')});
  $('share-btn').addEventListener('click',async()=>{
    const text=`EURONAUT ${dailySeed}: ${totalKm.toLocaleString('en-US')} km travelled across ${visited.size} places.`;
    try{await navigator.clipboard.writeText(text);$('share-btn').textContent='Copied!'}catch{$('share-btn').textContent=text}
  });
}
async function init(){
  const response=await fetch('europe-data.json');if(!response.ok)throw new Error('Could not load europe-data.json');
  data=await response.json();countries=data.countries;templates=data.questionTemplates;
  setup();startDailyRun();requestAnimationFrame(animate);
}
init().catch(err=>{console.error(err);document.body.insertAdjacentHTML('beforeend','<p style="padding:20px;color:#a33">Euronaut data could not load. Run this project through a local web server, not by opening index.html directly.</p>')});
})();