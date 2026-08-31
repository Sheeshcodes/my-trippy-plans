/* Batch trip planner — all app logic. Mounted from App.tsx. Copy lives in Q{}. */


const $=s=>document.querySelector(s);
import { BACKEND_URL, SHARE_URL, VOTE_BY } from './config';
const KEY='trip:friends', MEKEY='trip:me';
const DOODLES=['flower','mushroom','bee','rose','grass','tree','tulip'];

/* ---------- questions ---------- */
const Q={
  sure:[['in','In','I’m already imagining it'],['probably','Probably','depends on my manager’s mood'],['lurking','Lurking','will ask for photos later']],
  leave:[['0','None','HR knows my face'],['1','One day','doable'],['2-3','Two–three','my manager likes me'],['week','A week','quitting anyway']],
  vibes:[['beach','Beach','sunburn included'],['hills','Hills','sweater weather']],
  types:[['trek','Trek',''],['party','Party',''],['lazy','Lie down',''],['food','Eat everything',''],['water','Water sports',''],['road','Road trip','']],
  spend:[['5k','₹5k','hostels & character'],['10k','₹10k','a bed and a door'],['15k','₹15k','a view'],['25k','₹25k+','we don’t ask, we book']],
  plus:[['solo','Just me',''],['plus1','Plus one','they’ve been warned']],
};
const SPEND_WORD={'5k':'₹5k','10k':'₹10k','15k':'₹15k','25k':'₹25k+'};
const label=(k,v)=>{const o=Q[k].find(x=>x[0]===v);return o?o[1]:'';};

/* ---------- dates: Sept 1 -> Oct 31 2026, idx 0..60 ---------- */
const D0=new Date(2026,8,1);
const dateOf=i=>new Date(2026,8,1+i);
const idx=(m,d)=>Math.round((new Date(2026,m-1,d)-D0)/864e5);
const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MON=['Sept','Oct'];
const fmt=(i,withDow)=>{const d=dateOf(i);return (withDow?DAYS[d.getDay()]+' ':'')+d.getDate()+' '+MON[d.getMonth()-8];};
const fmtRange=(a,b)=>{
  const da=dateOf(a),db=dateOf(b);
  if(da.getMonth()===db.getMonth()) return DAYS[da.getDay()]+' '+da.getDate()+' – '+DAYS[db.getDay()]+' '+db.getDate()+' '+MON[da.getMonth()-8];
  return fmt(a,true)+' – '+fmt(b,true);
};
const LW=[
  {id:'jan',name:'Janmashtami',start:idx(9,4),end:idx(9,6),hol:idx(9,4),leave:null},
  {id:'gan',name:'Vinayaka Chaturthi',start:idx(9,12),end:idx(9,14),hol:idx(9,12),leave:'leave Mon 14'},
  {id:'gj',name:'Gandhi Jayanti',start:idx(10,2),end:idx(10,4),hol:idx(10,2),leave:null},
  {id:'dus',name:'Dussehra',start:idx(10,17),end:idx(10,20),hol:idx(10,20),leave:'leave Mon 19'},
];
const lwOf=i=>LW.find(w=>i>=w.start&&i<=w.end);
const holOf=i=>LW.find(w=>w.hol===i);

/* ---------- cities ---------- */
const CITIES=[['Bengaluru',12.97,77.59],['Mumbai',19.08,72.88],['Delhi',28.61,77.21],['Gurugram',28.46,77.03],['Noida',28.54,77.39],['Greater Noida',28.47,77.50],['Hyderabad',17.39,78.49],['Chennai',13.08,80.27],['Pune',18.52,73.86],['Kolkata',22.57,88.36],['Ahmedabad',23.02,72.57],['Jaipur',26.91,75.79],['Kochi',9.93,76.27],['Thiruvananthapuram',8.52,76.94],['Goa (Panaji)',15.49,73.83],['Chandigarh',30.73,76.78],['Lucknow',26.85,80.95],['Bhopal',23.26,77.41],['Indore',22.72,75.86],['Nagpur',21.15,79.09],['Ranchi',23.34,85.31],['Bhubaneswar',20.30,85.82],['Guwahati',26.14,91.74],['Patna',25.59,85.14],['Surat',21.17,72.83],['Vadodara',22.31,73.19],['Coimbatore',11.02,76.96],['Mysuru',12.30,76.65],['Mangaluru',12.91,74.86],['Visakhapatnam',17.69,83.22],['Dehradun',30.32,78.03],['Shimla',31.10,77.17],['Srinagar',34.08,74.80],['Raipur',21.25,81.63],['Vijayawada',16.51,80.65],['Madurai',9.93,78.12],['Udaipur',24.58,73.71],['Jodhpur',26.24,73.02],['Amritsar',31.63,74.87],['Kanpur',26.45,80.33],['Varanasi',25.32,83.01],['Agra',27.18,78.01],['Puducherry',11.94,79.83],['Ooty',11.41,76.70],['Shillong',25.58,91.89],['Gangtok',27.33,88.61],['Imphal',24.82,93.94],['Aizawl',23.73,92.72],['Kohima',25.67,94.11],['Agartala',23.83,91.28],['Port Blair',11.62,92.73],['Leh',34.16,77.58],['Dharamshala',32.22,76.32],['Manali',32.24,77.19],['Rishikesh',30.09,78.27],['Nainital',29.38,79.46],['Jamshedpur',22.80,86.20],['Dhanbad',23.80,86.43],['Bokaro',23.67,86.15],['Hazaribagh',23.99,85.36],['Hubballi',15.36,75.12],['Belagavi',15.85,74.50],['Thrissur',10.53,76.21],['Kozhikode',11.26,75.78],['Tiruchirappalli',10.79,78.70],['Salem',11.66,78.15],['Warangal',17.98,79.59],['Nashik',20.00,73.79],['Aurangabad',19.88,75.34],['Kolhapur',16.70,74.24],['Rajkot',22.30,70.80],['Gandhinagar',23.22,72.65],['Ghaziabad',28.67,77.42],['Faridabad',28.41,77.31],['Meerut',28.98,77.71],['Jabalpur',23.18,79.99],['Gwalior',26.22,78.18],['Cuttack',20.46,85.88],['Rourkela',22.26,84.85],['Siliguri',26.73,88.40],['Darjeeling',27.04,88.26],['Durgapur',23.52,87.31],['London',51.51,-0.13],['New York',40.71,-74.01],['San Francisco',37.77,-122.42],['Seattle',47.61,-122.33],['Toronto',43.65,-79.38],['Dubai',25.20,55.27],['Singapore',1.35,103.82],['Sydney',-33.87,151.21],['Melbourne',-37.81,144.96],['Berlin',52.52,13.40],['Amsterdam',52.37,4.90],['Paris',48.86,2.35],['Tokyo',35.68,139.69],['Hong Kong',22.32,114.17],['Kathmandu',27.72,85.32],['Colombo',6.93,79.86],['Dhaka',23.81,90.41],['Doha',25.29,51.53],['Abu Dhabi',24.45,54.38],['Riyadh',24.71,46.68],['Boston',42.36,-71.06],['Austin',30.27,-97.74],['Chicago',41.88,-87.63],['Dublin',53.35,-6.26],['Zurich',47.38,8.54],['Munich',48.14,11.58],['Tirupati',13.63,79.42],['Nellore',14.44,79.99],['Guntur',16.31,80.44],['Kurnool',15.83,78.04],['Kakinada',16.99,82.25],['Rajahmundry',17.00,81.80],['Anantapur',14.68,77.60],['Kadapa',14.47,78.82],['Nizamabad',18.67,78.09],['Karimnagar',18.44,79.13],['Khammam',17.25,80.15],['Vellore',12.92,79.13],['Erode',11.34,77.72],['Tirunelveli',8.71,77.76],['Thanjavur',10.79,79.14],['Thoothukudi',8.76,78.13],['Kanyakumari',8.09,77.54],['Kodaikanal',10.24,77.49],['Yercaud',11.78,78.21],['Rameswaram',9.29,79.31],['Hampi',15.34,76.46],['Chikkamagaluru',13.32,75.77],['Coorg (Madikeri)',12.42,75.74],['Udupi',13.34,74.75],['Gokarna',14.55,74.32],['Karwar',14.81,74.13],['Shivamogga',13.93,75.57],['Davangere',14.46,75.92],['Ballari',15.14,76.92],['Kalaburagi',17.33,76.83],['Vijayapura',16.83,75.71],['Tumakuru',13.34,77.10],['Hassan',13.00,76.10],['Alappuzha',9.49,76.33],['Munnar',10.09,77.06],['Wayanad (Kalpetta)',11.61,76.08],['Kollam',8.89,76.61],['Kannur',11.87,75.37],['Kottayam',9.59,76.52],['Varkala',8.73,76.72],['Lonavala',18.75,73.41],['Mahabaleshwar',17.92,73.66],['Alibaug',18.64,72.87],['Solapur',17.66,75.91],['Satara',17.68,74.02],['Sangli',16.85,74.58],['Ratnagiri',16.99,73.31],['Shirdi',19.77,74.48],['Thane',19.22,72.98],['Navi Mumbai',19.03,73.02],['Amravati',20.93,77.75],['Akola',20.71,77.00],['Chandrapur',19.96,79.30],['Bhavnagar',21.76,72.15],['Jamnagar',22.47,70.06],['Junagadh',21.52,70.46],['Bhuj',23.24,69.67],['Dwarka',22.24,68.97],['Diu',20.71,70.98],['Daman',20.40,72.83],['Silvassa',20.27,73.01],['Mount Abu',24.59,72.71],['Ajmer',26.45,74.64],['Pushkar',26.49,74.55],['Kota',25.21,75.86],['Bikaner',28.02,73.31],['Jaisalmer',26.92,70.91],['Alwar',27.55,76.63],['Bharatpur',27.22,77.49],['Ujjain',23.18,75.78],['Pachmarhi',22.47,78.43],['Khajuraho',24.85,79.92],['Satna',24.60,80.83],['Rewa',24.53,81.30],['Sagar',23.84,78.74],['Ratlam',23.33,75.04],['Bilaspur',22.08,82.15],['Bhilai',21.21,81.38],['Korba',22.35,82.68],['Jagdalpur',19.08,82.02],['Prayagraj',25.44,81.85],['Ayodhya',26.80,82.20],['Gorakhpur',26.76,83.37],['Bareilly',28.37,79.43],['Aligarh',27.90,78.08],['Mathura',27.49,77.67],['Moradabad',28.84,78.78],['Jhansi',25.45,78.57],['Saharanpur',29.97,77.55],['Mussoorie',30.46,78.07],['Haridwar',29.95,78.16],['Auli',30.53,79.57],['Almora',29.60,79.66],['Mukteshwar',29.47,79.65],['Kasauli',30.90,76.97],['Kufri',31.10,77.27],['Dalhousie',32.54,75.97],['McLeod Ganj',32.24,76.32],['Kasol',32.01,77.31],['Kaza (Spiti)',32.23,78.07],['Kullu',31.96,77.11],['Gulmarg',34.05,74.38],['Pahalgam',34.01,75.32],['Sonamarg',34.30,75.29],['Kargil',34.56,76.13],['Jammu',32.73,74.86],['Ludhiana',30.90,75.86],['Jalandhar',31.33,75.58],['Patiala',30.34,76.39],['Mohali',30.70,76.72],['Panipat',29.39,76.96],['Karnal',29.69,76.99],['Hisar',29.15,75.72],['Rohtak',28.90,76.61],['Ambala',30.38,76.78],['Muzaffarpur',26.12,85.39],['Gaya',24.79,85.00],['Bodh Gaya',24.70,84.99],['Bhagalpur',25.24,86.98],['Darbhanga',26.15,85.90],['Deoghar',24.48,86.70],['Netarhat',23.48,84.27],['Giridih',24.19,86.30],['Ramgarh',23.63,85.52],['Daltonganj',24.04,84.07],['Asansol',23.68,86.98],['Howrah',22.59,88.31],['Kharagpur',22.35,87.32],['Digha',21.63,87.51],['Kalimpong',27.06,88.47],['Puri',19.81,85.83],['Konark',19.89,86.10],['Sambalpur',21.47,83.97],['Berhampur',19.31,84.79],['Gopalpur',19.26,84.91],['Tezpur',26.63,92.79],['Dibrugarh',27.48,94.91],['Jorhat',26.75,94.22],['Silchar',24.83,92.78],['Kaziranga',26.58,93.17],['Cherrapunji',25.28,91.72],['Tawang',27.59,91.87],['Itanagar',27.08,93.61],['Ziro',27.55,93.83],['Dimapur',25.91,93.73],['Pelling',27.30,88.24],['Lachung',27.69,88.74],['Havelock (Swaraj Dweep)',12.03,92.98],['Kavaratti',10.57,72.64],['Los Angeles',34.05,-118.24],['San Jose',37.34,-121.89],['Washington DC',38.91,-77.04],['Atlanta',33.75,-84.39],['Dallas',32.78,-96.80],['Houston',29.76,-95.37],['Denver',39.74,-104.99],['Vancouver',49.28,-123.12],['Montreal',45.50,-73.57],['Mexico City',19.43,-99.13],['São Paulo',-23.55,-46.63],['Manchester',53.48,-2.24],['Edinburgh',55.95,-3.19],['Frankfurt',50.11,8.68],['Stockholm',59.33,18.07],['Copenhagen',55.68,12.57],['Oslo',59.91,10.75],['Helsinki',60.17,24.94],['Warsaw',52.23,21.01],['Prague',50.08,14.44],['Vienna',48.21,16.37],['Madrid',40.42,-3.70],['Barcelona',41.39,2.17],['Lisbon',38.72,-9.14],['Rome',41.90,12.50],['Milan',45.46,9.19],['Athens',37.98,23.73],['Istanbul',41.01,28.98],['Tel Aviv',32.08,34.78],['Cairo',30.04,31.24],['Nairobi',-1.29,36.82],['Johannesburg',-26.20,28.05],['Cape Town',-33.93,18.42],['Lagos',6.52,3.38],['Muscat',23.59,58.41],['Kuwait City',29.38,47.98],['Manama',26.23,50.59],['Karachi',24.86,67.01],['Lahore',31.55,74.34],['Islamabad',33.69,73.04],['Bangkok',13.76,100.50],['Kuala Lumpur',3.14,101.69],['Jakarta',-6.21,106.85],['Bali (Denpasar)',-8.67,115.21],['Manila',14.60,120.98],['Ho Chi Minh City',10.82,106.63],['Hanoi',21.03,105.85],['Seoul',37.57,126.98],['Osaka',34.69,135.50],['Shanghai',31.23,121.47],['Beijing',39.90,116.40],['Shenzhen',22.54,114.06],['Taipei',25.03,121.57],['Perth',-31.95,115.86],['Brisbane',-27.47,153.03],['Auckland',-36.85,174.76],['Malé',4.17,73.51],['Thimphu',27.47,89.64],['Pokhara',28.21,83.99]];
const ALIAS={bangalore:'Bengaluru',blr:'Bengaluru',bombay:'Mumbai',madras:'Chennai',calcutta:'Kolkata',trivandrum:'Thiruvananthapuram',cochin:'Kochi',mysore:'Mysuru',mangalore:'Mangaluru',hubli:'Hubballi',belgaum:'Belagavi',trichy:'Tiruchirappalli',pondicherry:'Puducherry',pondy:'Puducherry',vizag:'Visakhapatnam',gurgaon:'Gurugram',allahabad:'Prayagraj',baroda:'Vadodara',poona:'Pune',calicut:'Kozhikode',tuticorin:'Thoothukudi',gulbarga:'Kalaburagi',bijapur:'Vijayapura',bellary:'Ballari',shimoga:'Shivamogga',tumkur:'Tumakuru',chikmagalur:'Chikkamagaluru',coorg:'Coorg (Madikeri)',madikeri:'Coorg (Madikeri)',spiti:'Kaza (Spiti)',wayanad:'Wayanad (Kalpetta)',goa:'Goa (Panaji)',panjim:'Goa (Panaji)',andaman:'Port Blair',bali:'Bali (Denpasar)',dharamsala:'Dharamshala',ncr:'Delhi','new delhi':'Delhi',sf:'San Francisco',nyc:'New York',blore:'Bengaluru',hyd:'Hyderabad',kerala:'Kochi',dilli:'Delhi'};
// labels drawn on the paper — search and pins use the full list above
const MAJOR=new Set(['Bengaluru','Mumbai','Delhi','Hyderabad','Chennai','Pune','Kolkata','Ahmedabad','Jaipur','Kochi','Chandigarh','Lucknow','Bhopal','Indore','Nagpur','Ranchi','Bhubaneswar','Guwahati','Patna','Surat','Coimbatore','Visakhapatnam','Dehradun','Srinagar','Raipur','Goa (Panaji)','Thiruvananthapuram','Amritsar','Varanasi','Mangaluru','Shillong','Port Blair','Leh',
  'London','New York','San Francisco','Toronto','Dubai','Singapore','Sydney','Berlin','Paris','Tokyo','Hong Kong','Kathmandu','Colombo','Dhaka','Doha','Bangkok','Kuala Lumpur','Seoul','Nairobi','Lisbon','Amsterdam','Chicago','Seattle','Melbourne','Karachi','Riyadh','Istanbul']);
const nearest=(lat,lng)=>{let b=null,bd=1e9;for(const c of CITIES){const d=Math.hypot(c[1]-lat,(c[2]-lng)*Math.cos(lat*Math.PI/180));if(d<bd){bd=d;b=c;}}return b?(bd<0.35?b[0]:'near '+b[0]):'somewhere';};

/* ---------- state ---------- */
const blank=()=>({name:'',doodle:'flower',sure:null,lat:null,lng:null,place:'',begin:null,end:null,leave:null,vibe:null,types:[],spend:null,plus:null,need:'',rec:null,recText:'',ts:0});
let me=blank();
let friends={}, mem={};
let hasBackend=!!BACKEND_URL, hasStore=!!(window.storage&&window.storage.get);
let lastPlanted=null,pendingPlace=null;

const hash=s=>{let h=2166136261;for(const ch of s){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return (h>>>0);};
const keyOf=n=>n.trim().toLowerCase();
const DOODLE_OVERRIDES={pratik:'rose'}; // name (lowercased) -> doodle
const doodleFor=n=>DOODLE_OVERRIDES[keyOf(n)]||DOODLES[hash(keyOf(n)||'x')%DOODLES.length];const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const all=()=>Object.values(friends);
const active=()=>all().filter(f=>f.sure!=='lurking');          // lurkers are counted, not planned around
const voters=()=>active().filter(f=>f.begin!=null&&f.end!=null);
const inR=(v,a,b)=>typeof v==='number'&&isFinite(v)&&v>=a&&v<=b;
const okOpt=(k,v)=>Q[k].some(o=>o[0]===v)?v:null;
function sanitize(src){                                          // never trust what comes back from storage
  const out={};
  Object.entries(src||{}).forEach(([k,f])=>{
    if(!f||typeof f!=='object'||!f.name)return;
    const name=String(f.name).slice(0,24).trim();if(!name)return;
    const r={name,doodle:DOODLE_OVERRIDES[keyOf(name)]||(DOODLES.includes(f.doodle)?f.doodle:doodleFor(name)),sure:okOpt('sure',f.sure),      lat:inR(f.lat,-85,85)?f.lat:null,lng:inR(f.lng,-180,180)?f.lng:null,place:String(f.place||'').slice(0,60),
      begin:inR(f.begin,0,60)?Math.round(f.begin):null,end:inR(f.end,0,60)?Math.round(f.end):null,
      leave:okOpt('leave',f.leave),vibe:okOpt('vibes',f.vibe),types:(Array.isArray(f.types)?f.types:[]).filter(t=>okOpt('types',t)).slice(0,2),
      spend:okOpt('spend',f.spend),plus:okOpt('plus',f.plus),need:String(f.need||'').slice(0,60),rec:(f.rec==='yes'||f.rec==='no')?f.rec:null,recText:String(f.recText||'').slice(0,80),ts:isFinite(f.ts)?+f.ts:Date.now(),device:String(f.device||'')};
    if(r.lat==null||r.lng==null){r.lat=null;r.lng=null;}
    if(r.begin!=null&&r.end!=null&&r.end<r.begin){const t=r.begin;r.begin=r.end;r.end=t;}
    if(r.begin==null||r.end==null){r.begin=null;r.end=null;}
    out[keyOf(name)]=r;
  });
  return out;
}
let device='';try{device=localStorage.getItem('trip:device')||'';if(!device){device=Math.random().toString(36).slice(2,10);localStorage.setItem('trip:device',device);}}catch(e){device='';}
const others=()=>all().filter(f=>keyOf(f.name)!==keyOf(me.name));
const buzz=p=>{try{if(navigator.vibrate)navigator.vibrate(p||8);}catch(e){}};
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),2200);}
function steps(){$('#s1').classList.toggle('on',!!me.name.trim()&&!!me.sure);$('#s2').classList.toggle('on',me.lat!=null);$('#s3').classList.toggle('on',me.begin!=null&&me.end!=null);$('#s4').classList.toggle('on',!!friends[keyOf(me.name)]);}

/* ---------- storage: backend > artifact storage > memory ---------- */
async function apiGet(){const r=await fetch(BACKEND_URL+'?action=list&t='+Date.now(),{cache:'no-store'});const j=await r.json();return j.friends||{};}
async function apiPost(body){
  const txt=JSON.stringify(body);
  try{const r=await fetch(BACKEND_URL,{method:'POST',body:txt,headers:{'Content-Type':'text/plain;charset=utf-8'}});const j=await r.json();return j.ok!==false;}
  catch(e){ try{await fetch(BACKEND_URL,{method:'POST',mode:'no-cors',body:txt,headers:{'Content-Type':'text/plain;charset=utf-8'}});return true;}catch(e2){return false;} }
}
async function loadFriends(){
  if(hasBackend){try{return sanitize(await apiGet());}catch(e){return friends;}}
  if(!hasStore) return mem;
  try{const r=await window.storage.get(KEY,true);return sanitize(r&&r.value?JSON.parse(r.value):{});}catch(e){return {};}
}
async function writeAll(f){
  if(!hasStore){mem=f;return f;}
  try{const r=await window.storage.set(KEY,JSON.stringify(f),true);return r?f:null;}catch(e){return null;}
}
async function saveRecord(rec){
  if(hasBackend){const ok=await apiPost({action:'save',rec});if(!ok)return null;await new Promise(r=>setTimeout(r,600));return await loadFriends();}
  for(let attempt=0;attempt<2;attempt++){
    const f=await loadFriends();f[keyOf(rec.name)]=rec;const w=await writeAll(f);if(!w)return null;
    await new Promise(r=>setTimeout(r,300));
    const check=await loadFriends();if(check[keyOf(rec.name)]&&check[keyOf(rec.name)].ts===rec.ts)return check;  // survived any concurrent write
  }
  return null;
}
async function removeRecord(k){
  if(hasBackend){const ok=await apiPost({action:'remove',key:k});if(!ok)return null;await new Promise(r=>setTimeout(r,600));return await loadFriends();}
  const f=await loadFriends();delete f[k];return writeAll(f);
}
async function loadMe(){
  try{const v=localStorage.getItem(MEKEY);if(v)return JSON.parse(v);}catch(e){}
  if(!hasStore) return null;
  try{const r=await window.storage.get(MEKEY,false);return r&&r.value?JSON.parse(r.value):null;}catch(e){return null;}
}
async function saveMeLocal(){
  const v=JSON.stringify({name:me.name});
  try{localStorage.setItem(MEKEY,v);}catch(e){}
  if(!hasStore) return; try{await window.storage.set(MEKEY,v,false);}catch(e){}
}

/* ---------- option chips ---------- */
function renderOpts(key,multi){
  const el=$('#'+key);
  const field=key==='vibes'?'vibe':key;const counts={};all().forEach(f=>{const v=f[field];(Array.isArray(v)?v:[v]).forEach(x=>{if(x)counts[x]=(counts[x]||0)+1;});});
  el.innerHTML=Q[key].map(([v,l,sub])=>{
    const on=multi?me[key].includes(v):me[key]===v;
    const big=key==='vibes';
    if(big)return `<button type="button" class="opt big ${on?'on':''}" data-v="${v}" aria-pressed="${on}"><figure class="ill" data-slot="${v}"></figure><div class="big-lbl"><b>${l}</b><span>${sub}</span>${counts[v]?`<i>${counts[v]}</i>`:''}</div></button>`;
    return `<button type="button" class="opt ${on?'on':''} ${sub?'':'solo'} ${key==='sure'&&v==='in'?'in':''}" data-v="${v}" aria-pressed="${on}"><b>${l}</b>${sub?`<span>${sub}</span>`:''}${counts[v]?`<i>${counts[v]}</i>`:''}</button>`;
  }).join('');
  mountIll(el);
  el.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{
    const v=b.dataset.v;
    if(multi){const a=me[key];const i=a.indexOf(v);if(i>=0)a.splice(i,1);else{a.push(v);if(a.length>2)a.shift();}}
    else me[key]=me[key]===v?null:v;
    renderOpts(key,multi);steps();if(key==='leave')renderCal();else checklist();buzz();
    if(key==='sure'){const c=$('#who');c.classList.remove('glow');if(me.sure==='in'){void c.offsetWidth;c.classList.add('glow');buzz([12,30,12]);}}
  });
}
function renderAllOpts(){renderOpts('sure');renderOpts('leave');renderOpts('vibes');renderOpts('types',true);renderOpts('spend');renderOpts('plus');}
// 'vibes' key maps to me.vibe for storage
Object.defineProperty(me,'vibes',{get(){return this.vibe;},set(v){this.vibe=v;},enumerable:false,configurable:true});

/* ---------- illustration slots (HiggsField assets go here) ---------- */
// ▼ paste asset URLs (mp4 / gif / png) per slot id. empty = designed placeholder
const A='assets/';
const ILLUS={"intro": "/assets/ill-01-intro.mp4", "beach": "/assets/ill-02-beach.mp4", "hills": "/assets/ill-03-hills.mp4", "bloom": "/assets/ill-04-bloom.mp4", "empty": "/assets/ill-05-empty.mp4", "map": "/assets/ill-06-map.mp4", "wallet": "/assets/ill-09-saving.mp4", "wish": "/assets/ill-08-wish.mp4", "saving": "/assets/ill-09-saving.mp4", "report": "/assets/ill-10-report.mp4"};
const POSTER={"intro": "/assets/ill-01-intro-poster.jpg", "beach": "/assets/ill-02-beach-poster.jpg", "hills": "/assets/ill-03-hills-poster.jpg", "bloom": "/assets/ill-04-bloom-poster.jpg", "report": "/assets/ill-10-report-poster.jpg", "empty": "/assets/ill-05-empty-poster.jpg", "map": "/assets/ill-06-map-poster.jpg", "wallet": "/assets/ill-09-saving-poster.jpg", "wish": "/assets/ill-08-wish-poster.jpg"};
const REDUCED=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const REPORT=/[?&]report\b/.test(location.search);
const SLOTS={
  intro:{tag:'ILL-01 · intro · 3:2 · loop 4s',blob:'radial-gradient(60% 55% at 45% 62%,#FF3B3B 0%,#FF63A8 38%,rgba(255,99,168,0) 72%)',line:'M40 150c30-80 90-90 120-30s70 60 110-10 60-60 90-10',dots:'M310 60c8-10 22-6 18 6s-20 12-18 0zM350 40h.5'},
  beach:{tag:'ILL-02 · beach · 4:3 · loop',blob:'radial-gradient(70% 45% at 50% 78%,#FF3B3B 0%,#FF63A8 40%,rgba(255,99,168,0) 75%)',line:'M20 120c20-14 40-14 60 0s40 14 60 0 40-14 60 0M30 140c20-14 40-14 60 0s40 14 60 0',dots:'M170 40a18 18 0 1 0 .1 0zM140 20l6 6M200 20l-6 6'},
  hills:{tag:'ILL-03 · hills · 4:3 · loop',blob:'radial-gradient(55% 60% at 60% 45%,#FF3B3B 0%,#FF63A8 42%,rgba(255,99,168,0) 76%)',line:'M10 150l50-70 30 36 45-70 65 104M95 44l-6 12 8 4 6-6 6 6',dots:'M170 30c6-8 16-4 12 4s-14 8-12-4z'},
  bloom:{tag:'ILL-04 · gratification · 16:9 · plays once 2.5s, then loop idle',blob:'radial-gradient(45% 70% at 50% 70%,#FF3B3B 0%,#FF63A8 45%,rgba(255,99,168,0) 78%)',line:'M180 150c-10-40 10-60 30-90M180 150c20-30 60-40 80-70',dots:'M255 55c10-10 22-4 16 6s-20 10-16-6zM295 80c8-8 18-2 12 6s-16 8-12-6z'},
  empty:{tag:'ILL-05 · empty garden · 1:1 · static',blob:'radial-gradient(55% 45% at 50% 70%,#FF63A8 0%,#FFB3D2 45%,rgba(255,179,210,0) 76%)',line:'M120 200c-10-30-10-80 0-100M120 200c10-30 10-80 0-100M100 100h40',dots:''},
  map:{tag:'ILL-06 · section mark · 1:1 · static',blob:'radial-gradient(50% 50% at 50% 50%,#FF63A8 0%,rgba(255,99,168,0) 70%)',line:'M30 40c10-30 40-30 40 0 0 20-20 30-20 40 0-10-20-20-20-40z',dots:''},
  wallet:{tag:'ILL-07 · section mark · 1:1 · static',blob:'radial-gradient(50% 50% at 50% 50%,#FF63A8 0%,rgba(255,99,168,0) 70%)',line:'M15 30h50v30H15zM15 42h50M50 48h10',dots:''},
  wish:{tag:'ILL-08 · section mark · 1:1 · static',blob:'radial-gradient(50% 50% at 50% 50%,#FF63A8 0%,rgba(255,99,168,0) 70%)',line:'M20 60c0-30 20-40 40-30-20 5-30 20-40 30zM20 60l30-30',dots:''},
  report:{tag:'ILL-10 · report / share · 16:9 · loop 6s',blob:'radial-gradient(70% 60% at 50% 70%,#8C86F0 0%,#D9D6F5 45%,rgba(217,214,245,0) 75%)',line:'M20 160c20-30 30-30 40 0M70 165c15-40 30-40 45 0M130 160c10-20 30-20 40 0M190 168c12-30 28-30 40 0M245 160c15-25 35-25 50 0M310 165c10-20 25-20 35 0',dots:'M60 60c10-14 26-6 18 8s-24 6-18-8z'},
  saving:{tag:'ILL-09 · saving · 1:1 · loop 1s',blob:'radial-gradient(50% 50% at 50% 50%,#FF3B3B 0%,rgba(255,99,168,0) 70%)',line:'M20 50h40l-5 20H25zM40 50v-25c0-8 12-8 12 0',dots:''},
};
const io=('IntersectionObserver' in window)?new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;if(e.isIntersecting){v.play().catch(()=>{});}else v.pause();}),{rootMargin:'120px 0px'}):null;
function lazyPlay(v){if(io)io.observe(v);else v.play().catch(()=>{});}
function mountIll(root,restart){
  (root||document).querySelectorAll('.ill[data-slot]').forEach(el=>{
    const id=el.dataset.slot;const url=ILLUS[id];const sp=SLOTS[id]||SLOTS.map;
    if(el.dataset.mounted&&!restart)return;el.dataset.mounted='1';
    if(url){
      const once=id==='bloom';
      if(/^data:video|\.(mp4|webm|mov)(\?|$)/i.test(url)){
        const v=document.createElement('video');
        v.muted=true; v.defaultMuted=true; v.playsInline=true; v.setAttribute('muted',''); v.setAttribute('playsinline',''); v.setAttribute('webkit-playsinline','');
        v.preload='auto'; v.loop=!once; if(POSTER[id])v.poster=POSTER[id];
        const src=document.createElement('source'); src.src=url; src.type='video/mp4'; v.appendChild(src);
        el.innerHTML=''; el.appendChild(v);
        v.addEventListener('error',()=>{if(POSTER[id])el.innerHTML=`<img src="${POSTER[id]}" alt="">`;},{once:true});
        if(once)v.addEventListener('ended',()=>{try{v.currentTime=Math.max(0,v.duration-0.05);}catch(e){} v.play().catch(()=>{});});
        let kicked=false;
        const kick=()=>{const pr=v.play();if(pr&&pr.then)pr.then(()=>{kicked=true;}).catch(()=>{});};
        v.addEventListener('loadeddata',kick,{once:true});
        v.addEventListener('canplay',kick,{once:true});
        if(io)io.observe(v); else kick();
        setTimeout(kick,300);
        const onTap=()=>{if(!kicked)kick();};
        window.addEventListener('pointerdown',onTap,{once:true,passive:true});
        window.addEventListener('touchstart',onTap,{once:true,passive:true});
      }else el.innerHTML=`<img src="${url}" alt="" loading="lazy">`;
    }else{
      el.innerHTML=`<div class="blob" style="background:${sp.blob}"></div><div class="grain"></div><svg class="line" viewBox="0 0 380 200" preserveAspectRatio="xMidYMid meet"><path d="${sp.line}"/><path d="${sp.dots}"/></svg><span class="tag">${sp.tag}</span>`;
    }
  });
}

/* ---------- place recommendation ---------- */
const REC=[['yes','Yes, I’m the tour guide'],['no','I’m open to options']];
function renderRec(){
  const n=all().filter(f=>f.rec==='yes').length;
  $('#rec').innerHTML=REC.map(([v,l])=>`<button type="button" class="opt ${me.rec===v?'on':''}" data-v="${v}" aria-pressed="${me.rec===v}"><b>${l}</b>${v==='yes'&&n?`<i>${n}</i>`:''}</button>`).join('');
  $('#rec').querySelectorAll('.opt').forEach(b=>b.onclick=()=>{me.rec=me.rec===b.dataset.v?null:b.dataset.v;$('#recBox').style.display=me.rec==='yes'?'':'none';renderRec();buzz();if(me.rec!=='yes')me.recText='';});
}

/* ---------- name doodle ---------- */
let mineKey=null; // the record this device planted
function nameCheck(){
  const k=keyOf(me.name);const el=$('#nameNote');
  if(!k||!friends[k]||k===mineKey){el.innerHTML='';return;}
  const f=friends[k];
  const theirs=f.device&&device&&f.device!==device;
  el.innerHTML=`There’s already a <b>${esc(f.name)}</b> here${f.place?' ('+esc(f.place)+')':''}. ${theirs?'Names can’t repeat — add a surname initial.':'That you? Use “Not you? Start a fresh form” below, or add a surname initial.'}`;
}
function renderDoodles(){
  const n=me.name.trim();
  me.doodle=n?doodleFor(n):'flower';
  $('#meDoodle').innerHTML=n?`<use href="#d-${me.doodle}"/>`:'';
  $('#whoHint').textContent=n?`Your name made you a ${me.doodle}. No refunds.`:'Pet name or full name — both work. Your name picks your doodle.';
}

/* ---------- doodle map ---------- */
const MW=360,MH=340,INDIA={lat0:7,lat1:35,lng0:68,lng1:96};
let view={...INDIA},drag=null;
function fixAspect(v){
  const mid=(v.lat0+v.lat1)/2,c=Math.max(.2,Math.cos(mid*Math.PI/180));
  let dlat=v.lat1-v.lat0,dlng=v.lng1-v.lng0,want=MW/MH;
  if(dlng*c/dlat>want){const nd=dlng*c/want,cl=(v.lat0+v.lat1)/2;v.lat0=cl-nd/2;v.lat1=cl+nd/2;}
  else{const nd=dlat*want/c,cl=(v.lng0+v.lng1)/2;v.lng0=cl-nd/2;v.lng1=cl+nd/2;}
  return v;
}
function fitView(){
  const pts=others().filter(f=>f.lat!=null).map(f=>[f.lat,f.lng]);
  if(me.lat!=null)pts.push([me.lat,me.lng]);
  const inIndia=pts.every(p=>p[0]>INDIA.lat0&&p[0]<INDIA.lat1&&p[1]>INDIA.lng0&&p[1]<INDIA.lng1);
  if(!pts.length||inIndia){view=fixAspect({...INDIA});return;}
  let lat0=Math.min(INDIA.lat0,...pts.map(p=>p[0])),lat1=Math.max(INDIA.lat1,...pts.map(p=>p[0]));
  let lng0=Math.min(INDIA.lng0,...pts.map(p=>p[1])),lng1=Math.max(INDIA.lng1,...pts.map(p=>p[1]));
  const pl=(lat1-lat0)*.12+3,pg=(lng1-lng0)*.12+3;
  view=fixAspect({lat0:Math.max(-80,lat0-pl),lat1:Math.min(84,lat1+pl),lng0:lng0-pg,lng1:lng1+pg});
}
const proj=(lat,lng)=>[(lng-view.lng0)/(view.lng1-view.lng0)*MW,(view.lat1-lat)/(view.lat1-view.lat0)*MH];
const unproj=(x,y)=>[view.lat1-y/MH*(view.lat1-view.lat0),view.lng0+x/MW*(view.lng1-view.lng0)];
function pinSvg(f,cls){
  const [x,y]=proj(f.lat,f.lng);
  const lbl=f.place?`${f.name} · ${f.place}`:f.name;
  return `<g class="pin ${cls}" transform="translate(${x.toFixed(1)},${y.toFixed(1)})"><use href="#d-pin" x="-9" y="-24" width="18" height="24"/><text y="13">${esc(lbl)}</text></g>`;
}
function renderMap(){
  let s='';
  const placed=[];
  for(const c of CITIES){
    if(!MAJOR.has(c[0]))continue;
    if(c[1]<view.lat0||c[1]>view.lat1||c[2]<view.lng0||c[2]>view.lng1)continue;
    const [x,y]=proj(c[1],c[2]);
    const near=placed.find(p=>Math.abs(p.x-x)<14&&Math.abs(p.y-y)<14);
    if(near){if(near.names.length<3)near.names.push(c[0]);continue;}
    if(placed.some(p=>Math.abs(p.x-x)<38&&Math.abs(p.y-y)<11))continue;
    placed.push({x,y,names:[c[0]]});
    if(placed.length>=40)break;
  }
  placed.forEach(p=>{s+=`<circle class="cdot" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="1.4"/><text class="city" x="${(p.x+4).toFixed(1)}" y="${(p.y+4).toFixed(1)}">${p.names.join(' · ')}</text>`;});
  s+=`<g class="compass"><circle cx="336" cy="26" r="10"/><path d="M336 16v20M326 26h20"/><text x="336" y="12">N</text></g>`;
  others().forEach(f=>{if(f.lat!=null)s+=pinSvg(f,'other');});
  if(me.lat!=null)s+=pinSvg({name:me.name.trim()||'me',place:me.place,lat:me.lat,lng:me.lng},'me');
  $('#map').innerHTML=s;
}
function svgPt(e){const r=$('#map').getBoundingClientRect();return [(e.clientX-r.left)/r.width*MW,(e.clientY-r.top)/r.height*MH];}
function initMap(){
  const m=$('#map');
  m.addEventListener('pointerdown',e=>{const [x,y]=svgPt(e);drag={x,y,moved:false,onMe:!!e.target.closest('.pin.me')};m.setPointerCapture(e.pointerId);});
  m.addEventListener('pointermove',e=>{
    if(!drag)return;const [x,y]=svgPt(e);
    if(Math.hypot(x-drag.x,y-drag.y)>3)drag.moved=true;
    if(drag.onMe&&drag.moved){const [lat,lng]=unproj(x,y);me.lat=lat;me.lng=lng;me.place=nearest(lat,lng);renderMap();showPin();}
  });
  m.addEventListener('pointerup',e=>{
    if(!drag)return;const d=drag;drag=null;
    if(!d.moved&&!d.onMe){const [lat,lng]=unproj(d.x,d.y);const pl=pendingPlace||nearest(lat,lng);if(pendingPlace){pendingPlace=null;$('#results').innerHTML='';}setPin(lat,lng,pl,false);}
  });
  m.addEventListener('pointercancel',()=>{drag=null;});
  fitView();renderMap();
}
function setPin(lat,lng,place,refit){me.lat=lat;me.lng=lng;me.place=place;if(refit)fitView();renderMap();showPin();steps();checklist();}
function showPin(){$('#mypin').textContent=me.lat!=null?`that's me → ${me.place}`:'';}

/* ---------- search ---------- */
function lev(a,b){const m=a.length,n=b.length;if(!m)return n;if(!n)return m;let prev=[...Array(n+1).keys()];for(let i=1;i<=m;i++){const cur=[i];for(let j=1;j<=n;j++)cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));prev=cur;}return prev[n];}
function localSearch(q){
  q=q.toLowerCase().trim();
  const names=new Set();
  for(const [a,n] of Object.entries(ALIAS))if(a.startsWith(q)||q.startsWith(a))names.add(n);
  let hits=CITIES.filter(c=>names.has(c[0])||c[0].toLowerCase().includes(q));
  if(!hits.length&&q.length>=4){
    const tol=q.length>6?2:1;
    for(const [a,n] of Object.entries(ALIAS))if(lev(a,q)<=tol)names.add(n);
    hits=CITIES.filter(c=>names.has(c[0])||lev(c[0].toLowerCase().split(' ')[0],q)<=tol);
  }
  hits.sort((a,b)=>{const sa=a[0].toLowerCase().startsWith(q)?0:1,sb=b[0].toLowerCase().startsWith(q)?0:1;return sa-sb;});
  return hits.slice(0,6).map(c=>({name:c[0],sub:'',lat:c[1],lng:c[2]}));
}
async function search(){
  const q=$('#q').value.trim();if(!q)return;
  let res=localSearch(q);
  renderResults(res, res.length?'':'looking…');
  try{
    const ctl=new AbortController();const t=setTimeout(()=>ctl.abort(),5000);
    const r=await fetch('https://nominatim.openstreetmap.org/search?format=json&limit=5&q='+encodeURIComponent(q),{signal:ctl.signal,headers:{'Accept':'application/json'}});
    clearTimeout(t);
    const j=await r.json();
    const online=j.map(x=>{const parts=x.display_name.split(', ');return {name:parts[0],sub:parts.slice(1,3).join(', '),lat:+x.lat,lng:+x.lon};});
    const seen=new Set(res.map(x=>x.name.toLowerCase()));
    res=res.concat(online.filter(x=>!seen.has(x.name.toLowerCase())));
  }catch(e){}
  if(!res.length){pendingPlace=q;renderResults([],`“${esc(q)}” isn’t on my list. Tap the paper roughly where it is and I’ll label your pin “${esc(q)}”. Geography is a group effort.`);}
  else{pendingPlace=null;renderResults(res,'');}
}
function renderResults(list,msg){
  $('#results').innerHTML=list.map((x,i)=>`<button type="button" data-i="${i}"><b>${esc(x.name)}</b>${x.sub?`<span>${esc(x.sub)}</span>`:''}</button>`).join('')+(msg?`<div class="hint" style="margin-top:6px">${msg}</div>`:'');
  $('#results').querySelectorAll('button').forEach(b=>b.onclick=()=>{const x=list[+b.dataset.i];pendingPlace=null;setPin(x.lat,x.lng,x.name,true);$('#results').innerHTML='';$('#q').value=x.name;$('#q').blur();});
}

/* ---------- calendar ---------- */
function pickDay(i){
  if(me.begin==null||(me.begin!=null&&me.end!=null)){me.begin=i;me.end=null;}
  else if(i<me.begin){me.begin=i;}
  else me.end=i;
  renderCal();
}
function chipCount(w){return voters().filter(f=>f.begin<=w.start&&f.end>=w.end).length;}
function renderChips(){
  const tot=voters().length;
  $('#chips').innerHTML=LW.map(w=>{
    const on=me.begin===w.start&&me.end===w.end;
    return `<button type="button" class="chip ${on?'on':''}" data-id="${w.id}" aria-pressed="${on}">
      <div><b>${w.name}</b><span>${fmtRange(w.start,w.end)} · ${w.end-w.start+1} days${(()=>{const d=Math.ceil((dateOf(w.start)-Date.now())/864e5);return d<0?' · gone':d<21?` · in ${d} days`:'';})()}</span></div>
      <div class="r">${w.leave?`<em>+1 ${w.leave}</em>`:''}${tot?`<span class="cnt">${chipCount(w)}/${tot}</span>`:''}</div></button>`;
  }).join('');
  $('#chips').querySelectorAll('.chip').forEach(b=>b.onclick=()=>{const w=LW.find(x=>x.id===b.dataset.id);me.begin=w.start;me.end=w.end;renderCal();});
}
function renderCal(){
  let html='';
  [[8,30],[9,31]].forEach(([m,n],mi)=>{
    html+=`<h3>${['September','October'][mi]}</h3><div class="grid">`+['M','T','W','T','F','S','S'].map(d=>`<div class="dow">${d}</div>`).join('');
    const first=(new Date(2026,m,1).getDay()+6)%7;
    for(let k=0;k<first;k++)html+='<div></div>';
    for(let d=1;d<=n;d++){
      const i=idx(m+1,d);
      const cls=['day'];
      if(lwOf(i))cls.push('lw');if(holOf(i))cls.push('hol');
      if(me.begin!=null&&me.end!=null&&i>me.begin&&i<me.end)cls.push('in');
      if(i===me.begin||i===me.end)cls.push('edge');
      html+=`<button type="button" class="${cls.join(' ')}" data-i="${i}" aria-label="${fmt(i,true)}${holOf(i)?' '+holOf(i).name:''}">${d}</button>`;
    }
    html+='</div>';
  });
  $('#cal').innerHTML=html;
  $('#cal').querySelectorAll('.day').forEach(b=>b.onclick=()=>pickDay(+b.dataset.i));
  const r=$('#range');
  if(me.begin!=null&&me.end!=null){const n=me.end-me.begin+1;r.innerHTML=`${fmtRange(me.begin,me.end)} <small>${n} day${n>1?'s':''} · your vote</small>`;}
  else if(me.begin!=null) r.innerHTML=`from ${fmt(me.begin,true)} <small>now tap the last day</small>`;
  else r.innerHTML='';
  if(me.begin!=null&&me.end!=null){
    const wd=[];for(let i=me.begin;i<=me.end;i++){const d=dateOf(i).getDay();if(d>=1&&d<=5&&!holOf(i))wd.push(i);}
    if(wd.length){const lim={'0':0,'1':1,'2-3':3,'week':5}[me.leave];const over=me.leave!=null&&wd.length>lim;
      r.querySelector('small').insertAdjacentHTML('beforeend',` · needs ${wd.length} leave day${wd.length>1?'s':''} (${wd.slice(0,3).map(i=>fmt(i,true)).join(', ')}${wd.length>3?'…':''})${over?' — more than you said HR would sign':''}`);}
  }
  checklist();
  renderChips();steps();
}

/* ---------- garden ---------- */
function renderGarden(){
  const list=all().sort((a,b)=>a.ts-b.ts);
  const cols=5,slot=72,rowH=88;
  const rows=Math.ceil((list.length+1)/cols);
  const H=rows*rowH+16;
  const g=$('#garden');g.setAttribute('viewBox',`0 0 360 ${H}`);
  let s='';
  list.forEach((f,k)=>{
    const h=hash(f.name);
    const col=k%cols,row=Math.floor(k/cols);
    const x=col*slot+12+((h%29)-14)*0.9;
    const y=row*rowH+8+((h>>5)%23)-11;
    const w=46,ht=58;
    const isNew=lastPlanted&&keyOf(f.name)===lastPlanted;
    s+=`<g class="${isNew?'grow':''}"><use class="doodle" href="#d-${DOODLES.includes(f.doodle)?f.doodle:'flower'}" x="${x}" y="${y}" width="${w}" height="${ht}"/><text x="${x+w/2}" y="${y+ht+12}">${esc(f.name)}</text></g>`;
    if(isNew){
      const cx=x+w/2,cy=y+ht/2;
      s+=`<g class="spark">`+[0,60,120,180,240,300].map(a=>{const r=a*Math.PI/180;return `<path d="M${cx+Math.cos(r)*34} ${cy+Math.sin(r)*34}l${Math.cos(r)*8} ${Math.sin(r)*8}"/>`;}).join('')+`</g>`;
    }
  });
  const k=list.length,col=k%cols,row=Math.floor(k/cols);
  const px=col*slot+35,py=row*rowH+44;
  s+=`<circle class="plus" cx="${px}" cy="${py}" r="14"/><path class="plus" style="stroke-dasharray:none" d="M${px-5} ${py}h10M${px} ${py-5}v10"/>`;
  g.innerHTML=s;
  $('#gardenHint').textContent=list.length?`${list.length} planted. ${list.length<5?'It’s a start.':list.length<12?'This is more than the group ever agreed on.':'Book something before this energy dies.'}`:'Nobody’s planted yet. Be the first. Be the legend.';
  $('#gardenEmpty').style.display=list.length?'none':'';
}

/* ---------- results ---------- */
function computeCounts(){
  const cnt=new Array(61).fill(0);
  voters().forEach(f=>{for(let i=f.begin;i<=f.end;i++)if(i>=0&&i<61)cnt[i]++;});
  return {cnt,tot:voters().length};
}
function bestWindow(cnt){
  const mx=Math.max(...cnt);if(mx===0)return null;
  let best=null,st=-1;
  for(let i=0;i<=61;i++){
    if(i<61&&cnt[i]===mx){if(st<0)st=i;}
    else if(st>=0){const len=i-st;if(!best||len>best.len)best={a:st,b:i-1,len,n:mx};st=-1;}
  }
  return best;
}
function dist(key){const c={};active().forEach(f=>{const v=f[key];if(v)c[v]=(c[v]||0)+1;});return Q[key].filter(o=>c[o[0]]).map(o=>`${o[1]} ${c[o[0]]}`).join(' · ');}
function mode(key,multi){
  const c={};active().forEach(f=>{const v=f[key];(Array.isArray(v)?v:[v]).forEach(x=>{if(x)c[x]=(c[x]||0)+1;});});
  const e=Object.entries(c).sort((a,b)=>b[1]-a[1]);
  return multi?e.slice(0,2):e[0]||null;
}
function leading(){
  const parts=[];
  const cs=LW.map(w=>[w,chipCount(w)]);const mx=Math.max(...cs.map(c=>c[1]));
  if(mx>0){
    let top=cs.filter(c=>c[1]===mx).map(c=>c[0]);
    if(top.length>1){const {cnt}=computeCounts();const b=bestWindow(cnt);const inB=b?top.filter(w=>w.start>=b.a&&w.end<=b.b):[];if(inB.length===1)top=inB;}
    parts.push(top.length===1?top[0].name:top.map(w=>w.name).join(' / ')+' (tied)');
  }
  const vb=active().filter(f=>f.vibe==='beach').length,vh=active().filter(f=>f.vibe==='hills').length;
  if(vb||vh)parts.push(vb===vh?'beach / hills (tied)':vb>vh?'beach':'hills');
  return parts.join(', ');
}
function renderCount(){
  const n=all().length;
  if(!n){$('#count').innerHTML='';$('#count').style.display='none';return;}
  const i=all().filter(f=>f.sure==='in').length,p=all().filter(f=>f.sure==='probably').length;
  const lead=leading();
  const heads=all().sort((a,b)=>b.ts-a.ts).slice(0,3).map(f=>`<svg class="d-svg"><use href="#d-${f.doodle}"/></svg>`).join('');
  const lurk=n-i-p;
  $('#count').innerHTML=`<div class="strip-txt"><b>${n} filled already</b> — ${i} in, ${p} probably, ${lurk} lurking${lead?` · leaning towards the week of <b>${esc(lead)}</b>`:''}</div><div class="strip-heads">${heads}</div>`;  $('#count').style.display='';
}
function renderRes(){
  const list=all();const R=$('#res');
  if(!list.length){R.innerHTML='';return;}
  const {cnt,tot}=computeCounts();const b=bestWindow(cnt);
  let h='';
  if(tot){
    h+='<div><h3>Who’s free — Sept, then Oct</h3>';
    [[0,30],[30,31]].forEach(([o,n])=>{h+='<div class="strip-days">';for(let d=0;d<31;d++){if(d>=n){h+='<span></span>';continue;}const i=o+d;h+=`<i class="${lwOf(i)?'lw':''}" style="opacity:${(cnt[i]/tot*0.92+0.04).toFixed(2)}" title="${fmt(i,true)}: ${cnt[i]} free"></i>`;}h+='</div>';});
    h+='</div>';
  }
  const act=active();
  const vb=act.filter(f=>f.vibe==='beach').length,vh=act.filter(f=>f.vibe==='hills').length;
  const sp=mode('spend'),ty=mode('types',true),lv=mode('leave');
  const plus=act.filter(f=>f.plus==='plus1').length;
  const ins=list.filter(f=>f.sure==='in').length,prob=list.filter(f=>f.sure==='probably').length;
  h+='<div class="facts">';
  if(b)h+=`<div class="fact wide"><b>${fmtRange(b.a,b.b)}</b><span>${b.n} of ${tot} free all ${b.len} day${b.len>1?'s':''}. This is the window. Book it before someone’s cousin gets married.</span></div>`;
  h+=`<div class="fact"><b>${ins} in${prob?` +${prob} maybe`:''}</b><span>headcount · rooms for ~${ins+plus}${prob?`–${ins+prob+plus}`:''}</span></div>`;
  if(vb||vh)h+=`<div class="fact"><b>${vb===vh?'tied':(vb>vh?'beach':'hills')}</b><span>beach ${vb} · hills ${vh}${list.length>act.length?' · lurkers not counted':''}</span></div>`;
  if(sp)h+=`<div class="fact"><b>${label('spend',sp[0])} a head</b><span>most common · ${dist('spend')}</span></div>`;
  if(ty.length)h+=`<div class="fact"><b>${ty.map(t=>label('types',t[0])).join(' + ')}</b><span>the mood, democratically</span></div>`;
  if(lv)h+=`<div class="fact"><b>${label('leave',lv[0])}</b><span>leave most can take · ${dist('leave')}</span></div>`;
  if(plus)h+=`<div class="fact"><b>${plus} plus-one${plus>1?'s':''}</b><span>bringing someone</span></div>`;
  h+='</div>';
  const recs=list.filter(f=>f.rec==='yes'&&f.recText&&f.recText.trim());
  if(recs.length)h+='<div><h3>Tour guides — places on the table</h3><div class="wish">'+recs.map(f=>`<div>${esc(f.recText)}<span>— ${esc(f.name)} volunteers</span></div>`).join('')+'</div></div>';
  const wishes=list.filter(f=>f.need&&f.need.trim());
  if(wishes.length)h+='<div><h3>This trip needs</h3><div class="wish">'+wishes.map(f=>`<div>${esc(f.need)}<span>— ${esc(f.name)}</span></div>`).join('')+'</div></div>';
  h+='<div><h3>Everyone</h3><div class="people">'+list.sort((a,b)=>a.ts-b.ts).map(f=>{
    const bits=[f.place?esc(f.place):'no pin',f.begin!=null&&f.end!=null?fmtRange(f.begin,f.end):'no dates'];
    const chips=[];if(f.vibe)chips.push(esc(f.vibe));if(f.leave)chips.push(label('leave',f.leave)+' leave');if(f.plus==='plus1')chips.push('+1');
    return `<div class="prow"><svg><use href="#d-${DOODLES.includes(f.doodle)?f.doodle:'flower'}"/></svg><div class="pmain"><div class="pname">${esc(f.name)}<span class="tag ${f.sure==='in'?'in':''}">${f.sure?label('sure',f.sure):'?'}</span></div><div class="pmeta">${bits.join(' · ')}</div>${chips.length?`<div class="pchips">${chips.map(c=>`<em>${c}</em>`).join('')}</div>`:''}</div></div>`;
  }).join('')+'</div></div>';
  R.innerHTML=h;
}
function renderAll(){renderGarden();renderRes();renderCount();if(REPORT)renderReport();fitView();renderMap();renderChips();renderAllOpts();steps();const mine=!!friends[keyOf(me.name)];$('#remove').style.display=mine?'inline':'none';$('#notme').style.display=mine?'inline':'none';const ai=$('#aiPanel');if(ai)ai.style.display=active().length>1?'':'none';}

/* ---------- checklist ---------- */
function missing(){
  const m=[];
  if(!me.name.trim())m.push('name');if(!me.sure)m.push('how sure');
  if(me.sure==='lurking')return m; // lurkers just watch — nothing else required
  if(me.lat==null)m.push('pin');if(me.begin==null||me.end==null)m.push('dates');
  if(!me.leave)m.push('leave');if(!me.vibe)m.push('beach/hills');if(!me.types.length)m.push('mood');
  if(!me.spend)m.push('budget');if(!me.plus)m.push('plus-one');
  if(!me.rec)m.push('a place in mind');else if(me.rec==='yes'&&!$('#recText').value.trim())m.push('your recommendation');
  return m;
}
const REQUIRED_FULL=['name','how sure','pin','dates','leave','beach/hills','mood','budget','plus-one','a place in mind'];
const totalQ=()=>me.sure==='lurking'?2:REQUIRED_FULL.length;

function checklist(){
  const T=totalQ();const m=missing();const done=T-m.length;const pct=Math.round(done/T*100);
  $('#progPct').textContent=pct+'%';
  $('#barTxt').textContent=m.length?`${done} of ${T} · ${m[0]} next`:'All done';
  $('#progTxt').innerHTML=m.length?`<b>${done} of ${T}</b> — still blank: ${m.join(', ')}.${m.length<=2?' It’s a form, not a mystery.':''}`:(me.sure==='lurking'?`<b>Lurker mode.</b> That’s allowed. Plant it.`:`<b>All ${T}.</b> Look at you. Now plant it.`);
  $('#progressCard').classList.toggle('done',!m.length);
  renderHeadline();
}
function renderHeadline(){
  if(REPORT){renderReport();return;}
  return; // static title by design
  const n=me.name.trim();const h=$('#headline');
  if(!n){h.innerHTML=`Hello 👋 stranger. <em>Sixty seconds</em>, then someone finally books something.`;return;}
  const bits=[];
  if(me.place)bits.push(`from <em>${esc(me.place.replace(/^near /,'near '))}</em>`);
  if(me.vibe)bits.push(`in for <em>${me.vibe}</em>`);
  if(me.begin!=null&&me.end!=null){const w=LW.find(w=>w.start===me.begin&&w.end===me.end);bits.push(`<em>${w?w.name:fmtRange(me.begin,me.end)}</em>`);}
  if(me.spend)bits.push(`<em>${SPEND_WORD[me.spend]}</em> a head`);
  if(me.plus==='plus1')bits.push(`<em>plus one</em>`);
  const doodle=`<svg class="inl d-svg"><use href="#d-${me.doodle}"/></svg>`;
  if(!bits.length){h.innerHTML=`Hello 👋 ${esc(n)} ${doodle} — ${me.sure==='lurking'?'lurking is allowed, but the photos will hurt.':me.sure==='probably'?'“probably” is how every good trip starts.':'let’s find out where and when.'}`;return;}
  const last=bits.pop();
  h.innerHTML=`Hello 👋 ${esc(n)} ${doodle}, ${bits.length?bits.join(', ')+' and ':''}${last}.${missing().length?'':' Plant it.'}`;
}

/* ---------- save ---------- */
function ordinal(n){const s=['th','st','nd','rd'],v=n%100;return n+(s[(v-20)%10]||s[v]||s[0]);}
async function save(){
  const name=$('#name').value.trim();
  if(!name){toast('A name would help. Any name.');$('#name').focus();return;}
  me.name=name;
  const k=keyOf(name);const prev=friends[k];
  if(prev&&k!==mineKey){toast('That name’s taken. Add a surname initial.');$('#name').focus();$('#name').scrollIntoView({behavior:'smooth',block:'center'});return;}
  const need=(el,msg,target)=>{if(el)return false;toast(msg);$(target).scrollIntoView({behavior:'smooth',block:'center'});return true;};
  if(need(me.sure,'How sure are you? Lurking counts.','#sure'))return;
  if(me.sure!=='lurking'){
    if(need(me.lat!=null,'Drop a pin — where are you coming from?','#map'))return;
    if(me.begin!=null&&me.end==null){toast('You picked a start. Trips have ends too.');$('#cal').scrollIntoView({behavior:'smooth',block:'center'});return;}
    if(need(me.begin!=null&&me.end!=null,'Pick the dates you could do.','#chips'))return;
    if(need(me.leave,'How much leave can you take?','#leave'))return;
    if(need(me.vibe,'Salt or altitude? Pick one.','#vibes'))return;
    if(need(me.types.length,'Pick the mood.','#types'))return;
    if(need(me.spend,'Pick a comfortable spend.','#spend'))return;
    if(need(me.plus,'Coming as?','#plus'))return;
    if(need(me.rec,'Got a place in mind? Yes or no.','#rec'))return;
    if(me.rec==='yes'&&need($('#recText').value.trim(),'Tell us the place you’d recommend.','#recText'))return;
  }
  const btn=$('#save');btn.disabled=true;btn.innerHTML=`<video class="saving-ill" autoplay muted loop playsinline src="${ILLUS.saving}"></video>Planting…`;

  const rec={name,doodle:doodleFor(name),sure:me.sure,lat:me.lat,lng:me.lng,place:me.place,begin:me.begin,end:me.end,leave:me.leave,vibe:me.vibe,types:me.types.slice(),spend:me.spend,plus:me.plus,need:$('#need').value.trim(),rec:me.rec,recText:me.rec==='yes'?$('#recText').value.trim():'',ts:prev?prev.ts:Date.now(),device};
  const fresh=await saveRecord(rec);
  btn.disabled=false;btn.textContent=prev?'Update my answers':'Plant me in';
  if(!fresh){toast('Didn’t save. The internet blinked. Try again.');return;}
  if(!fresh[k])fresh[k]=rec;
  friends=fresh;lastPlanted=k;mineKey=k;buzz([20,40,20]);
  await saveMeLocal();nameCheck();
  renderAll();
  const list=all().sort((a,b)=>a.ts-b.ts);const pos=list.findIndex(f=>keyOf(f.name)===k)+1;
  const oth=others().sort((a,b)=>b.ts-a.ts).map(f=>f.name);
  let who='';
  if(oth.length===0)who='You’re first. Go poke the group before this feels lonely.';
  else if(oth.length<=3)who=oth.join(', ')+(oth.length>1?' are':' is')+' here too.';
  else who=oth.slice(0,2).join(', ')+` and ${oth.length-2} others are here.`;
  const lead=leading();
  $('#doneTitle').innerHTML=prev?`Updated, ${esc(name)}. Indecision is a form of planning.`:`You’re in the pot, ${esc(name)}. <em>${ordinal(pos)}</em> to plant.`;
  $('#doneSub').textContent=who+(lead?` It’s leaning ${lead}${oth.length>=4?' — the group has never agreed on anything this fast.':'.'}`:'');
  $('#done').style.display='';mountIll($('#done'),true);
  $('#done').scrollIntoView({behavior:'smooth',block:'start'});
  setTimeout(()=>{lastPlanted=null;},2000);
}
async function removeMe(){
  const k=keyOf(me.name);if(!friends[k])return;
  const fresh=await removeRecord(k);
  if(fresh){friends=fresh;$('#done').style.display='none';$('#save').textContent='Plant me in';renderAll();toast('Pulled you out. The pot will miss you.');}
}

/* ---------- summary + nudge ---------- */
function summary(){
  const list=all();const {cnt,tot}=computeCounts();const b=bestWindow(cnt);
  const ins=list.filter(f=>f.sure==='in').length,prob=list.filter(f=>f.sure==='probably').length;
  const places={};list.forEach(f=>{if(f.place){const p=f.place.replace(/^near /,'');places[p]=(places[p]||0)+1;}});
  const L=['batch trip · sept/oct 2026',`${list.length} in the garden${(ins||prob)?` — ${ins} in, ${prob} probably`:''}`];
  if(b)L.push(`best window: ${fmtRange(b.a,b.b)} (${b.n} of ${tot} free)`);
  if(tot)L.push('weekends: '+LW.map(w=>`${w.name} ${chipCount(w)}/${tot}`).join(' · '));
  const vb=active().filter(f=>f.vibe==='beach').length,vh=active().filter(f=>f.vibe==='hills').length;
  if(vb||vh)L.push(`beach ${vb} · hills ${vh}`);
  const ty=mode('types',true);if(ty.length)L.push('mood: '+ty.map(t=>label('types',t[0])).join(' + '));
  const sp=mode('spend');if(sp)L.push(`budget most said: ${label('spend',sp[0])} a head`);
  const plus=active().filter(f=>f.plus==='plus1').length;if(plus)L.push(`${plus} bringing a plus-one`);
  if(Object.keys(places).length)L.push('where we are: '+Object.entries(places).sort((a,b)=>b[1]-a[1]).map(([p,n])=>n>1?`${p} ×${n}`:p).join(', '));
  const w=list.filter(f=>f.need&&f.need.trim());if(w.length)L.push('this trip needs: '+w.map(f=>`"${f.need.trim()}"`).join(', '));
  const rc=list.filter(f=>f.rec==='yes'&&f.recText&&f.recText.trim());if(rc.length)L.push('place ideas: '+rc.map(f=>`${f.name}: ${f.recText.trim()}`).join(' · '));
  const missing=list.filter(f=>f.begin==null||f.end==null).map(f=>f.name);if(missing.length)L.push('still to pick dates: '+missing.join(', '));
  return L.join('\n');
}
function aiPrompt(){
  const list=all();const act=active();const {cnt,tot}=computeCounts();const b=bestWindow(cnt);
  // aggregates
  const homes={};act.forEach(f=>{if(f.place){const p=f.place.replace(/^near /,'');homes[p]=(homes[p]||0)+1;}});
  const homeStr=Object.entries(homes).sort((a,b)=>b[1]-a[1]).map(([p,n])=>n>1?`${p} (${n})`:p).join(', ')||'not shared';
  const vb=act.filter(f=>f.vibe==='beach').length,vh=act.filter(f=>f.vibe==='hills').length;
  const vibe=vb===vh?'split evenly between beach and hills':vb>vh?`leaning beach (${vb} vs ${vh})`:`leaning hills (${vh} vs ${vb})`;
  const ty=mode('types',true).map(t=>label('types',t[0]));
  const sp=mode('spend');const budget=sp?`${label('spend',sp[0])} per head (stay + food + local travel, excluding the journey to get there)`:'not agreed yet';
  const len=b?`${b.len} day${b.len>1?'s':''}`:'a long weekend';
  const when=b?`${fmtRange(b.a,b.b)} works for ${b.n} of ${tot}`:'still being decided';
  const wishes=list.filter(f=>f.need&&f.need.trim()).map(f=>f.need.trim());
  const ideas=list.filter(f=>f.rec==='yes'&&f.recText&&f.recText.trim()).map(f=>`${f.recText.trim()} (from ${f.name})`);
  const leave=mode('leave');const leaveStr=leave?label('leave',leave[0]):'varies';

  const L=[];
  L.push('You are a sharp, opinionated travel planner. A group of friends is planning a trip together and here is what they, collectively, want. Use it to recommend where they should actually go.');
  L.push('');
  L.push('THE GROUP');
  const watchers=list.length-act.length;
  const who=act.length===1?'person':'people';
  L.push(watchers
    ? `- ${act.length} ${who} travelling (plus ${watchers} ${watchers===1?'who is':'who are'} just watching — plan for the ${act.length}).`
    : `- ${act.length} ${who} travelling.`);
  L.push(`- Coming from: ${homeStr}. Pick destinations that are reasonably fair to reach for most of them, not just the biggest city.`);
  L.push(`- Vibe: ${vibe}.`);
  if(ty.length)L.push(`- What they want to do: ${ty.join(' and ')}.`);
  L.push(`- Budget: ${budget}.`);
  L.push(`- Leave most can take: ${leaveStr}. Trip length: about ${len}.`);
  L.push(`- Dates: ${when}.`);
  if(wishes.length)L.push(`- This trip needs (their words): ${wishes.map(w=>`"${w}"`).join(', ')}.`);
  if(ideas.length)L.push(`- Places some already suggested: ${ideas.join('; ')}. Consider these but don't be limited by them.`);
  L.push('');
  L.push('WHAT TO GIVE BACK');
  L.push('1. THREE popular picks — crowd-pleasers that fit the vibe, budget and travel fairness above. For each: one line on why it fits THIS group specifically, a rough per-head stay-cost band, and 2–3 things to do that match their mood.');
  L.push('2. THREE underrated picks — lesser-known places that fit even better, same detail. Bias toward these; the group can find the obvious ones themselves.');
  L.push('3. For your single best pick, a rough day-by-day sketch for the trip length above.');
  L.push('4. Be honest about trade-offs (long travel for some, monsoon, peak-season pricing) — do not oversell.');
  L.push('');
  L.push('THEN — GOOGLE MY MAPS (if you are Gemini or can browse):');
  L.push('Lay your 6 picks as pins on a Google My Maps. For each pin add a short note with the reason and the stay-cost band. Give me the steps to open it, or the map link if you can create one. If you cannot make a map, output the 6 places as a simple list of "Name — one-line note" I can paste into Google My Maps myself.');
  L.push('');
  L.push('Keep it tight and skimmable. No preamble. Start with the underrated picks if they are genuinely better.');
  return L.join('\n');
}
function nudge(){
  const list=all();const lead=leading();
  const names=list.slice(0,3).map(f=>f.name);
  return `${list.length} of us have planted (${names.join(', ')}${list.length>3?' + more':''})${lead?`, and it’s leaning ${lead}`:''}. Takes a minute — less than you spend choosing what to order. ${SHARE_URL||(/^https?:/.test(location.href)?location.href.split('#')[0]:'(link)')}`;
}
function csv(){
  const cols=['name','sure','place','lat','lng','begin','end','begin_date','end_date','leave','vibe','types','spend','plus','need','rec','recText','ts'];
  const q=v=>'"'+String(v==null?'':v).replace(/"/g,'""')+'"';
  const rows=all().sort((a,b)=>a.ts-b.ts).map(f=>[f.name,f.sure,f.place,f.lat,f.lng,f.begin,f.end,f.begin!=null?fmt(f.begin,true)+' 2026':'',f.end!=null?fmt(f.end,true)+' 2026':'',f.leave,f.vibe,(f.types||[]).join('|'),f.spend,f.plus,f.need,f.rec||'',f.recText||'',new Date(f.ts).toISOString()].map(q).join(','));
  const text=[cols.join(',')].concat(rows).join('\n');
  try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'text/csv'}));a.download='batch-trip-answers.csv';document.body.appendChild(a);a.click();a.remove();}
  catch(e){prompt('copy this:',text);}
}
function resetForm(){me=blank();$('#recBox').style.display='none';$('#recText').value='';$('#recCount').textContent='80';Object.defineProperty(me,'vibes',{get(){return this.vibe;},set(v){this.vibe=v;},enumerable:false,configurable:true});mineKey=null;$('#name').value='';$('#need').value='';$('#needCount').textContent='60';$('#q').value='';$('#results').innerHTML='';$('#done').style.display='none';$('#save').textContent='Plant me in';renderDoodles();nameCheck();renderCal();renderRec();renderAll();try{localStorage.removeItem(MEKEY);}catch(e){}window.scrollTo({top:0,behavior:'smooth'});}
function openLLM(which){
  const text=aiPrompt();
  copyText(text,'Prompt copied — paste it into the chat that opens.');
  const url={gemini:'https://gemini.google.com/app',chatgpt:'https://chat.openai.com/',claude:'https://claude.ai/new'}[which]||'https://gemini.google.com/app';
  setTimeout(()=>{try{window.open(url,'_blank','noopener');}catch(e){}},250);
}
async function copyText(t,msg){try{await navigator.clipboard.writeText(t);toast(msg);}catch(e){prompt('copy this:',t);}}

/* ---------- boot ---------- */
function renderReport(){
  const n=all().length,i=all().filter(f=>f.sure==='in').length,p=all().filter(f=>f.sure==='probably').length;
  const lead=leading();const {cnt,tot}=computeCounts();const b=bestWindow(cnt);
  $('#headline').innerHTML=n?`<em>${n}</em> planted — ${i} in${p?`, ${p} probably`:''}.${lead?` Leaning <em>${esc(lead)}</em>.`:''}${b?` Best window <em>${fmtRange(b.a,b.b)}</em>, ${b.n} of ${tot} free.`:''}`:'Nobody has planted yet. The report is a blank page and a dream.';
}
async function boot(){
  if(REPORT){document.body.classList.add('report');const h=document.querySelector('.hero .ill');h.dataset.slot='report';delete h.dataset.mounted;}
  renderDoodles();initMap();renderCal();renderAllOpts();renderRec();mountIll();
  if(!hasBackend&&!hasStore){$('#storeWarn').innerHTML='<div class="warn">No backend connected — answers stay on this phone. Add the Apps Script URL (backend.gs) or open the shared link.</div>';}
  $('#name').addEventListener('input',()=>{me.name=$('#name').value;renderDoodles();nameCheck();if(me.lat!=null)renderMap();steps();checklist();});
  $('#need').addEventListener('input',()=>{$('#needCount').textContent=60-$('#need').value.length;});
  $('#recText').addEventListener('input',()=>{$('#recCount').textContent=80-$('#recText').value.length;me.recText=$('#recText').value;checklist();});
  $('#go').onclick=search;
  $('#q').addEventListener('input',()=>{const q=$('#q').value.trim();if(q.length<2){$('#results').innerHTML='';return;}renderResults(localSearch(q),'');});
  $('#q').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();search();}});
  $('#save').onclick=save;$('#barBtn').onclick=save;$('#remove').onclick=removeMe;
  // sticky bar: visible between the hero and the real button, never in report mode
  if(!REPORT&&'IntersectionObserver' in window){
    let heroOut=false,btnIn=false,doneIn=false;
    const upd=()=>$('#bar').classList.toggle('on',heroOut&&!btnIn&&!doneIn);
    new IntersectionObserver(es=>{heroOut=!es[0].isIntersecting&&es[0].boundingClientRect.top<0;upd();}).observe(document.querySelector('.hero'));
    new IntersectionObserver(es=>{btnIn=es[0].isIntersecting;upd();},{rootMargin:'0px 0px 40px 0px'}).observe($('#save'));
    new IntersectionObserver(es=>{doneIn=es[0].isIntersecting||es[0].boundingClientRect.top<0;upd();}).observe($('#done'));
  }$('#csv').onclick=csv;$('#notme').onclick=resetForm;
  $('#need').addEventListener('input',checklist);
  $('#copy').onclick=()=>copyText(summary(),'Copied. Paste it in the group.');
  $('#nudge').onclick=()=>copyText(nudge(),'Copied. Send it to the quiet ones.');
  const cp=$('#copyPrompt');if(cp)cp.onclick=()=>copyText(aiPrompt(),'Prompt copied. Paste it into any AI chat.');
  const gg=$('#openGemini');if(gg)gg.onclick=()=>openLLM('gemini');
  const gc=$('#openClaude');if(gc)gc.onclick=()=>openLLM('claude');
  const gp=$('#openGPT');if(gp)gp.onclick=()=>openLLM('chatgpt');
  $('#waUpdate').onclick=()=>copyText(`I am done filling as ${me.name.trim()}! now you're next ;)`,'Copied. Paste it in WhatsApp.');
  friends=await loadFriends();
  const saved=await loadMe();
  let myKey=(saved&&saved.name&&friends[keyOf(saved.name)])?keyOf(saved.name):null;
  if(!myKey&&device){ // same browser, but the local note got lost: match on this browser's id
    const hit=Object.keys(friends).find(k=>friends[k]&&friends[k].device===device);
    if(hit)myKey=hit;
  }
  if(myKey){
    const f=friends[myKey];mineKey=myKey;

    me.name=f.name;me.sure=f.sure||null;me.begin=f.begin;me.end=f.end;me.leave=f.leave||null;me.vibe=f.vibe||null;me.types=Array.isArray(f.types)?f.types.slice():[];me.spend=f.spend||null;me.plus=f.plus||null;me.rec=f.rec||null;me.recText=f.recText||'';
    $('#name').value=f.name;$('#need').value=f.need||'';$('#needCount').textContent=60-$('#need').value.length;$('#recText').value=f.recText||'';$('#recCount').textContent=80-(f.recText||'').length;$('#recBox').style.display=f.rec==='yes'?'':'none';renderRec();
    renderDoodles();
    if(f.lat!=null)setPin(f.lat,f.lng,f.place,true);
    $('#save').textContent='Update my answers';
    renderCal();if(me.sure==='in')$('#who').classList.add('glow');
    saveMeLocal();

  }
  renderAll();checklist();
  if(REPORT)mountIll(document.querySelector('.hero'),true);
  document.documentElement.style.setProperty('--grain','url("data:image/svg+xml,'+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`)+'")');
  setInterval(async()=>{const f=await loadFriends();if(JSON.stringify(f)!==JSON.stringify(friends)){friends=f;renderAll();}},20000);
  document.addEventListener('visibilitychange',async()=>{if(!document.hidden){friends=await loadFriends();renderAll();}});
}

let booted=false;
export function mountPlanner(){ if(booted) return; booted=true; boot(); }
