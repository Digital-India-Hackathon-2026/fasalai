// ---------- in-memory data store ----------
const farmers = {
  ravi_kumar: {pass:'1234', name:'Ravi Kumar', age:42, land:4.5, landtype:'Owned', crop:'Cotton', irrig:'Borewell', years:3, income:180000, debt:20000, family:5, consent:true},
  lakshmi_d:  {pass:'1234', name:'Lakshmi D', age:29, land:1.2, landtype:'Leased', crop:'Vegetables', irrig:'Rain-fed', years:1, income:60000, debt:5000, family:3, consent:true},
  suresh_n:   {pass:'1234', name:'Suresh N', age:51, land:3.0, landtype:'Owned', crop:'Paddy', irrig:'Canal', years:3, income:120000, debt:95000, family:6, consent:true},
};
const lenders = { lender1: {pass:'1234'} };
let currentFarmerUser = null;
let pendingConsent = true;

function switchTab(role){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('tab-farmer').classList.toggle('active', role==='farmer');
  document.getElementById('tab-lender').classList.toggle('active', role==='lender');
  if(role==='farmer') document.getElementById('farmer-login').classList.add('active');
  else document.getElementById('lender-login').classList.add('active');
}

function fillFarmer(u){
  document.getElementById('f-user').value=u;
  document.getElementById('f-pass').value='1234';
}

function farmerLogin(){
  const u=document.getElementById('f-user').value.trim();
  const p=document.getElementById('f-pass').value.trim();
  const rec=farmers[u];
  if(!rec || rec.pass!==p){ alert('No matching farmer account. Try a demo username, or create a new profile.'); return; }
  currentFarmerUser=u;
  renderDashboard(rec);
}

function showFarmerForm(prefill){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('farmer-form').classList.add('active');
}

function toggleConsent(){
  pendingConsent=!pendingConsent;
  document.getElementById('consent-switch').classList.toggle('on', pendingConsent);
}

function submitProfile(){
  const name=document.getElementById('p-name').value.trim() || 'New farmer';
  const username = name.toLowerCase().replace(/\s+/g,'_') + '_' + Math.floor(Math.random()*90+10);
  const rec = {
    pass:'1234',
    name,
    age:+document.getElementById('p-age').value || 30,
    land:+document.getElementById('p-land').value || 1,
    landtype:document.getElementById('p-landtype').value,
    crop:document.getElementById('p-crop').value || 'Mixed',
    irrig:document.getElementById('p-irrig').value,
    years:+document.getElementById('p-years').value,
    income:+document.getElementById('p-income').value || 50000,
    debt:+document.getElementById('p-debt').value || 0,
    family:+document.getElementById('p-family').value || 4,
    consent: pendingConsent
  };
  farmers[username]=rec;
  currentFarmerUser=username;
  renderDashboard(rec);
  setTimeout(()=>alert('Profile created. Your new username is "'+username+'" — a lender can look you up with this.'), 200);
}

// ---------- simple scoring simulation (stand-in for XGBoost + SHAP) ----------
function computeScore(r){
  let score = 50;
  const factors = [];

  // income stability
  const incomeContribution = Math.min(20, (r.income/200000)*20);
  score += incomeContribution;
  factors.push({label:'Income level', value: incomeContribution, note: r.income>=120000?'stable income supports repayment':'modest income, limited buffer'});

  // land ownership
  const landContribution = r.landtype==='Owned' ? 10 : -4;
  score += landContribution;
  factors.push({label:'Land ownership', value: landContribution, note: r.landtype==='Owned'?'owned land, no lease risk':'leased land, less collateral security'});

  // debt burden
  const debtRatio = r.income>0 ? r.debt/r.income : 1;
  const debtContribution = -Math.min(22, debtRatio*30);
  score += debtContribution;
  factors.push({label:'Existing debt', value: debtContribution, note: debtRatio>0.4?'high debt relative to income':'manageable debt load'});

  // history length (confidence proxy + small score effect)
  const historyContribution = (r.years/3)*12;
  score += historyContribution;
  factors.push({label:'Income history depth', value: historyContribution, note: r.years>=3?'3 years of consistent record':'limited track record, using public data as fallback'});

  // irrigation reliability
  const irrigMap = {Canal:8, Borewell:6, 'Rain-fed':-3, None:-8};
  const irrigContribution = irrigMap[r.irrig] ?? 0;
  score += irrigContribution;
  factors.push({label:'Irrigation reliability', value: irrigContribution, note: irrigContribution>=6?'reliable water source lowers crop-failure risk':'weather-dependent, higher yield risk'});

  score = Math.max(5, Math.min(95, Math.round(score)));
  const confidence = r.years>=3 ? 'High' : r.years===2 ? 'Medium' : 'Low — supplemented with public data';
  const tier = score>=70 ? {label:'Low risk', cls:'good'} : score>=45 ? {label:'Medium risk', cls:'mid'} : {label:'High risk', cls:'bad'};
  const loanLow = Math.round((r.income*0.15 + score*300)/1000)*1000;
  const loanHigh = Math.round((r.income*0.35 + score*600)/1000)*1000;

  factors.sort((a,b)=>Math.abs(b.value)-Math.abs(a.value));
  return {score, confidence, tier, factors, loanLow, loanHigh};
}

function silo(label, pct, color){
  return `<div>
    <div class="silo"><div class="fill" style="height:${pct}%; background:${color};"></div></div>
    <div class="silo-label">${label}</div>
  </div>`;
}

function factorRow(f){
  const pct = Math.min(100, Math.abs(f.value)/22*100);
  const color = f.value>=0 ? 'var(--good)' : 'var(--bad)';
  return `<div class="factor">
    <span style="min-width:170px;">${f.label}</span>
    <div class="bar-bg"><div class="bar-fill" style="width:${pct}%; background:${color};"></div></div>
    <span style="font-family:'IBM Plex Mono',monospace; font-size:12px; min-width:80px; text-align:right; color:${f.value>=0?'var(--good)':'var(--bad)'}">${f.value>=0?'+':''}${f.value.toFixed(1)}</span>
  </div>`;
}

function renderDashboard(r){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('farmer-dash').classList.add('active');
  const res = computeScore(r);
  document.getElementById('fd-score').textContent = res.score;
  document.getElementById('fd-tag').className = 'tag '+res.tier.cls;
  document.getElementById('fd-tag').textContent = res.tier.label;
  document.getElementById('fd-conf').textContent = res.confidence;
  document.getElementById('fd-cold-note').style.display = r.years<3 ? 'block':'none';

  const color = res.tier.cls==='good'?'var(--good)':res.tier.cls==='mid'?'var(--mid)':'var(--bad)';
  document.getElementById('fd-silo-row').innerHTML =
    silo('Credit score', res.score, color) +
    silo('Income stability', Math.min(100,(r.income/200000)*100), 'var(--wheat)') +
    silo('Debt load', Math.min(100,(r.debt/(r.income||1))*100), 'var(--bad)');

  document.getElementById('fd-factors').innerHTML = res.factors.map(factorRow).join('');

  const tips = [];
  if(r.irrig==='Rain-fed'||r.irrig==='None') tips.push('Adding a reliable irrigation source would reduce your weather-risk exposure.');
  if(r.debt/(r.income||1) > 0.3) tips.push('Reducing existing debt relative to income will raise your score meaningfully.');
  if(r.years<3) tips.push('Recording more seasons of income history will move you off the government-data fallback.');
  if(r.landtype!=='Owned') tips.push('Owned land carries more weight than leased land in the scoring model.');
  if(tips.length===0) tips.push('Your profile is strong — maintaining consistent yearly records will keep it that way.');
  document.getElementById('fd-tips').innerHTML = tips.map(t=>'<li>'+t+'</li>').join('');
}

// ---------- lender side ----------
function lenderLogin(){
  const u=document.getElementById('l-user').value.trim();
  const p=document.getElementById('l-pass').value.trim();
  const rec=lenders[u];
  if(!rec || rec.pass!==p){ alert('Use demo login: lender1 / 1234'); return; }
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('lender-search').classList.add('active');
}

function lenderSearch(){
  const u=document.getElementById('l-search').value.trim();
  const r=farmers[u];
  const out=document.getElementById('l-result');
  if(!r){ out.innerHTML='<div class="card empty">No farmer found with that username.</div>'; return; }
  if(!r.consent){ out.innerHTML='<div class="card empty">This farmer has not made their score visible to lenders.</div>'; return; }

  const res=computeScore(r);
  const color = res.tier.cls==='good'?'var(--good)':res.tier.cls==='mid'?'var(--mid)':'var(--bad)';
  out.innerHTML = `
    <div class="card">
      <div class="eyebrow">Farmer</div>
      <h2 style="font-size:20px;">${u}</h2>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;margin-top:10px;">
        <div><div class="score-num">${res.score}</div><span class="tag ${res.tier.cls}">${res.tier.label}</span></div>
        <div style="text-align:right;">
          <div class="eyebrow">Confidence</div>
          <div style="font-family:'IBM Plex Mono',monospace;font-size:14px;">${res.confidence}</div>
        </div>
      </div>
      <div class="note">Suggested loan range: ₹${res.loanLow.toLocaleString('en-IN')} – ₹${res.loanHigh.toLocaleString('en-IN')}</div>
    </div>
    <div class="card">
      <h3 style="font-size:16px;margin-bottom:14px;">Top factors behind this score</h3>
      ${res.factors.slice(0,4).map(factorRow).join('')}
      <p class="hint">Raw personal fields (exact income, age, land size) are masked — only score, confidence, and factors are shared, per farmer consent settings.</p>
    </div>
    <div class="card">
      <h3 style="font-size:16px;margin-bottom:10px;">Log loan outcome</h3>
      <p class="hint" style="margin-top:0;">Recording the outcome after loan closure feeds the retraining pipeline.</p>
      <button class="btn" onclick="logOutcome('repaid')">Mark as repaid</button>
      <button class="btn ghost" onclick="logOutcome('defaulted')" style="margin-left:8px;">Mark as defaulted</button>
      <div id="outcome-msg" class="note" style="display:none;"></div>
    </div>
  `;
}

function logOutcome(status){
  const msg=document.getElementById('outcome-msg');
  msg.style.display='block';
  msg.textContent = 'Outcome "'+status+'" logged — queued for the next model retraining cycle.';
}
