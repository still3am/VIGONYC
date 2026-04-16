import { useState, useEffect, useRef, useCallback } from "react";

const T = {
  bg:"#080808",surface:"#0E0E0E",surfaceAlt:"#141414",surfaceHover:"#1A1A1A",
  border:"#1E1E1E",borderLight:"#2C2C2C",
  accent:"#C8FF00",accentDim:"rgba(200,255,0,0.12)",
  text:"#EFEFEF",textMuted:"#606060",textFaint:"#2E2E2E",
  success:"#00E87A",warning:"#FFB300",error:"#FF3535",late:"#FF6B35",info:"#4DA6FF",
  purple:"#A78BFA",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
.vs-wrap *,.vs-wrap *::before,.vs-wrap *::after{box-sizing:border-box}
.vs-wrap{background:${T.bg};color:${T.text};font-family:'Syne',sans-serif;-webkit-font-smoothing:antialiased;min-height:100vh}
.vs-wrap input,.vs-wrap select,.vs-wrap textarea{font-family:'Syne',sans-serif;color:${T.text}}

@keyframes vs-fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes vs-fadeIn{from{opacity:0}to{opacity:1}}
@keyframes vs-slideR{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
@keyframes vs-scaleIn{from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)}}
@keyframes vs-pulse{0%,100%{opacity:1}50%{opacity:0.25}}
@keyframes vs-ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes vs-blink{0%,100%{opacity:1}49%{opacity:1}50%{opacity:0}99%{opacity:0}}

.vs-fu{animation:vs-fadeUp 0.38s ease both}
.vs-fi{animation:vs-fadeIn 0.25s ease both}
.vs-si{animation:vs-scaleIn 0.28s ease both}

.vbtn{background:${T.accent};color:#000;border:none;padding:10px 20px;font-family:'Syne',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;transition:all 0.15s;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;flex-shrink:0}
.vbtn:hover{background:#D4FF1A;transform:translateY(-1px);box-shadow:0 6px 20px rgba(200,255,0,0.18)}
.vbtn:active{transform:none;box-shadow:none}
.vbtn:disabled{background:${T.textFaint};color:${T.textMuted};cursor:not-allowed;transform:none;box-shadow:none}
.vbtn.sm{padding:6px 12px;font-size:10px}
.vbtn.xs{padding:4px 9px;font-size:9px;letter-spacing:0.07em}
.vbtn.warn{background:${T.late};color:#fff}.vbtn.warn:hover{background:#FF8050}
.vbtn.err{background:${T.error};color:#fff}.vbtn.err:hover{background:#FF5555}
.vbtn.info{background:${T.info};color:#000}.vbtn.info:hover{background:#6DBBFF}

.vg{background:transparent;color:${T.text};border:1px solid ${T.border};padding:8px 16px;font-family:'Syne',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;transition:all 0.15s;white-space:nowrap;display:inline-flex;align-items:center;gap:6px}
.vg:hover{border-color:${T.accent};color:${T.accent}}
.vg.sm{padding:5px 10px;font-size:10px}
.vg.xs{padding:3px 8px;font-size:9px}
.vg.danger{border-color:${T.error};color:${T.error}}.vg.danger:hover{background:rgba(255,53,53,0.06)}
.vg.active{border-color:${T.accent};color:${T.accent};background:rgba(200,255,0,0.06)}

.vin{background:${T.surfaceAlt};border:1px solid ${T.border};color:${T.text};padding:8px 11px;font-family:'Syne',sans-serif;font-size:12px;width:100%;outline:none;transition:border-color 0.18s}
.vin:focus{border-color:${T.accent}}
.vin::placeholder{color:${T.textFaint}}
.vin.sm{padding:5px 9px;font-size:11px}
.vin.err{border-color:${T.error}!important}

.vsel{background:${T.surfaceAlt};border:1px solid ${T.border};color:${T.text};padding:8px 30px 8px 11px;font-family:'Syne',sans-serif;font-size:12px;outline:none;cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23555' fill='none' stroke-width='1.5'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;transition:border-color 0.18s}
.vsel:focus{border-color:${T.accent}}

.vs-card{background:${T.surface};border:1px solid ${T.border}}

.badge{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;font-family:'DM Mono',monospace;font-size:9px;font-weight:500;letter-spacing:0.05em;text-transform:uppercase;white-space:nowrap;flex-shrink:0}
.b-paid{background:rgba(0,232,122,0.08);color:${T.success};border:1px solid rgba(0,232,122,0.18)}
.b-pending{background:rgba(255,179,0,0.09);color:${T.warning};border:1px solid rgba(255,179,0,0.2)}
.b-late{background:rgba(255,107,53,0.09);color:${T.late};border:1px solid rgba(255,107,53,0.2)}
.b-defaulted{background:rgba(255,53,53,0.09);color:${T.error};border:1px solid rgba(255,53,53,0.2)}
.b-shipped{background:rgba(200,255,0,0.07);color:${T.accent};border:1px solid rgba(200,255,0,0.16)}
.b-processing{background:rgba(77,166,255,0.07);color:${T.info};border:1px solid rgba(77,166,255,0.18)}
.b-blocked{background:rgba(255,53,53,0.09);color:${T.error};border:1px solid rgba(255,53,53,0.2)}
.b-active{background:rgba(200,255,0,0.07);color:${T.accent};border:1px solid rgba(200,255,0,0.16)}

.vs-tbl{width:100%;border-collapse:collapse}
.vs-tbl th{font-family:'DM Mono',monospace;font-size:9px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:${T.textMuted};padding:8px 12px;text-align:left;border-bottom:1px solid ${T.border};white-space:nowrap;background:${T.surfaceAlt}}
.vs-tbl th.sort{cursor:pointer;user-select:none}.vs-tbl th.sort:hover{color:${T.text}}
.vs-tbl td{padding:11px 12px;font-size:12px;border-bottom:1px solid ${T.border};vertical-align:middle}
.vs-tbl tbody tr{transition:background 0.12s;cursor:pointer}
.vs-tbl tbody tr:hover td{background:${T.surfaceHover}}
.vs-tbl tbody tr.sel td{background:rgba(200,255,0,0.025);border-left:2px solid ${T.accent}}
.vs-tbl tbody tr.checked td{background:rgba(200,255,0,0.04)}
.vs-tbl tbody tr:last-child td{border-bottom:none}

.vs-ntab{background:none;border:none;color:${T.textMuted};font-family:'Syne',sans-serif;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;padding:9px 14px;border-bottom:2px solid transparent;transition:all 0.12s;white-space:nowrap;flex-shrink:0}
.vs-ntab:hover{color:${T.text}}
.vs-ntab.on{color:${T.accent};border-bottom-color:${T.accent}}

.vs-live-dot{width:6px;height:6px;border-radius:50%;background:${T.success};animation:vs-pulse 2s infinite}

.vs-mbar-wrap{display:flex;align-items:flex-end;gap:2px;height:26px;flex-shrink:0}
.vs-mbar{border-radius:1px;width:4px}

.vs-rchip{display:inline-flex;align-items:center;gap:2px;padding:2px 6px;font-family:'DM Mono',monospace;font-size:8px;letter-spacing:0.04em;margin:1px;border-radius:1px}
.vs-rc-s{background:rgba(200,255,0,0.08);color:${T.accent};border:1px solid rgba(200,255,0,0.18)}
.vs-rc-u{background:${T.surfaceAlt};color:${T.textFaint};border:1px solid ${T.border}}
.vs-rc-m{background:rgba(255,107,53,0.08);color:${T.late};border:1px solid rgba(255,107,53,0.18)}

.vs-arow{display:flex;gap:10px;padding:9px 0;border-bottom:1px solid ${T.border};align-items:flex-start}
.vs-arow:last-child{border-bottom:none}

.vs-ticker-wrap{overflow:hidden;white-space:nowrap;border-bottom:1px solid ${T.border};background:rgba(200,255,0,0.02)}
.vs-ticker-inner{display:inline-flex;gap:0;animation:vs-ticker 40s linear infinite}
.vs-ticker-inner:hover{animation-play-state:paused}
.vs-tick-item{display:inline-flex;align-items:center;gap:8px;padding:6px 24px;border-right:1px solid ${T.border};font-family:'DM Mono',monospace;font-size:10px;color:${T.textMuted};white-space:nowrap}

.vs-tog{width:36px;height:19px;border-radius:10px;cursor:pointer;position:relative;transition:background 0.18s;flex-shrink:0;border:none}
.vs-tog-knob{position:absolute;top:2px;width:15px;height:15px;border-radius:50%;transition:left 0.18s}

.vs-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid ${T.border}}
.vs-row:last-child{border-bottom:none}

.vs-note{padding:9px 12px;border-bottom:1px solid ${T.border};font-size:12px;line-height:1.55}
.vs-note:last-child{border-bottom:none}

.vs-chk{width:14px;height:14px;border:1px solid ${T.border};cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.12s}
.vs-chk.on{background:${T.accent};border-color:${T.accent}}

.vs-tile{background:${T.surface};border:1px solid ${T.border};padding:18px;transition:border-color 0.15s}
.vs-tile:hover{border-color:${T.borderLight}}

.vs-tl-line{position:absolute;left:15px;top:0;bottom:0;width:1px;background:${T.border}}
.vs-tl-dot{position:absolute;left:10px;width:11px;height:11px;border-radius:50%;border:2px solid ${T.bg};z-index:1}
`;

/* ── Helpers ──────────────────────────────────────────────────────── */
const fmt      = n => `$${Number(n).toFixed(2)}`;
const fmtK     = n => n>=1000?`$${(n/1000).toFixed(1)}k`:fmt(n);
const fmtDate  = d => new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
const fmtShort = d => new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric"});
const fmtTime  = d => new Date(d).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
const fmtFull  = d => `${fmtDate(d)} ${fmtTime(d)}`;
const addDays  = (d,n)=>{ const r=new Date(d); r.setDate(r.getDate()+n); return r; };
const daysUntil= d => Math.ceil((new Date(d)-new Date())/(1000*60*60*24));
const genId    = () => Math.random().toString(36).substr(2,9);
const NOW      = new Date();
const clamp    = (v,mn,mx) => Math.max(mn,Math.min(mx,v));

/* ── Seed data ────────────────────────────────────────────────────── */
const SEED_ORDERS = [
  {id:genId(),orderId:"VS-A9F3K2",customer:"Jordan Riley",email:"jordan@email.com",phone:"(555) 210-4400",
   billingAddr:"220 Oak Ave, Atlanta, GA 30301",shippingAddr:"220 Oak Ave, Atlanta, GA 30301",
   idType:"Driver's License",idLast4:"7821",orderTotal:285,payment1:142.5,payment2:142.5,
   payment1Status:"paid",payment2Status:"paid",payment1Date:addDays(NOW,-18),payment2Date:addDays(NOW,-4),
   dueDate:addDays(NOW,-4),lateFee:false,lateFeePaid:false,fulfillmentStatus:"shipped",flagged:false,
   createdAt:addDays(NOW,-18),notes:[{id:genId(),text:"Customer confirmed delivery.",at:addDays(NOW,-2)}],
   reminders:[{type:"3-day",sent:true,sentAt:addDays(NOW,-7)},{type:"1-day",sent:true,sentAt:addDays(NOW,-5)},{type:"due-day",sent:true,sentAt:addDays(NOW,-4)}]},
  {id:genId(),orderId:"VS-B2M7X1",customer:"Amara Okafor",email:"amara@mail.com",phone:"(555) 318-9922",
   billingAddr:"48 Elm St, Houston, TX 77002",shippingAddr:"48 Elm St, Houston, TX 77002",
   idType:"State ID",idLast4:"3344",orderTotal:210,payment1:105,payment2:105,
   payment1Status:"paid",payment2Status:"pending",payment1Date:addDays(NOW,-5),payment2Date:null,
   dueDate:addDays(NOW,9),lateFee:false,lateFeePaid:false,fulfillmentStatus:"shipped",flagged:false,
   createdAt:addDays(NOW,-5),notes:[],
   reminders:[{type:"3-day",sent:false,sentAt:null}]},
  {id:genId(),orderId:"VS-C5R8P0",customer:"Devon Walsh",email:"devon@inbox.com",phone:"(555) 407-5511",
   billingAddr:"910 Pine Rd, Chicago, IL 60601",shippingAddr:"910 Pine Rd, Chicago, IL 60601",
   idType:"Passport",idLast4:"9012",orderTotal:320,payment1:160,payment2:160,
   payment1Status:"paid",payment2Status:"late",payment1Date:addDays(NOW,-16),payment2Date:null,
   dueDate:addDays(NOW,-2),lateFee:true,lateFeePaid:false,fulfillmentStatus:"shipped",flagged:true,
   createdAt:addDays(NOW,-16),notes:[{id:genId(),text:"Customer unresponsive — escalate Friday.",at:addDays(NOW,-1)}],
   reminders:[{type:"3-day",sent:true,sentAt:addDays(NOW,-5)},{type:"1-day",sent:true,sentAt:addDays(NOW,-3)},{type:"due-day",sent:true,sentAt:addDays(NOW,-2)},{type:"missed",sent:true,sentAt:addDays(NOW,-1)}]},
  {id:genId(),orderId:"VS-D1N4Q7",customer:"Priya Sharma",email:"priya@webmail.com",phone:"(555) 623-7788",
   billingAddr:"15 Sunset Blvd, LA, CA 90028",shippingAddr:"15 Sunset Blvd, LA, CA 90028",
   idType:"Driver's License",idLast4:"5566",orderTotal:175,payment1:87.5,payment2:87.5,
   payment1Status:"paid",payment2Status:"defaulted",payment1Date:addDays(NOW,-30),payment2Date:null,
   dueDate:addDays(NOW,-16),lateFee:true,lateFeePaid:false,fulfillmentStatus:"shipped",flagged:false,
   createdAt:addDays(NOW,-30),notes:[{id:genId(),text:"Referred to collections.",at:addDays(NOW,-10)}],
   reminders:[{type:"3-day",sent:true,sentAt:addDays(NOW,-19)},{type:"1-day",sent:true,sentAt:addDays(NOW,-17)},{type:"due-day",sent:true,sentAt:addDays(NOW,-16)},{type:"missed",sent:true,sentAt:addDays(NOW,-15)},{type:"collection",sent:true,sentAt:addDays(NOW,-10)}]},
  {id:genId(),orderId:"VS-E7T2V5",customer:"Marcus Bell",email:"mbell@outlook.com",phone:"(555) 774-3320",
   billingAddr:"33 Commerce Dr, Miami, FL 33101",shippingAddr:"33 Commerce Dr, Miami, FL 33101",
   idType:"Military ID",idLast4:"8877",orderTotal:395,payment1:197.5,payment2:197.5,
   payment1Status:"paid",payment2Status:"pending",payment1Date:addDays(NOW,-2),payment2Date:null,
   dueDate:addDays(NOW,12),lateFee:false,lateFeePaid:false,fulfillmentStatus:"processing",flagged:false,
   createdAt:addDays(NOW,-2),notes:[],reminders:[]},
];

const SEED_ACTIVITY = [
  {id:genId(),type:"payment",icon:"💳",text:"P2 received — Jordan Riley (VS-A9F3K2) · $142.50",at:addDays(NOW,-4),color:T.success},
  {id:genId(),type:"reminder",icon:"📩",text:"Missed payment notice → Devon Walsh (VS-C5R8P0)",at:addDays(NOW,-1),color:T.warning},
  {id:genId(),type:"late_fee",icon:"⚠️",text:"$3.00 late fee applied — Devon Walsh (VS-C5R8P0)",at:addDays(NOW,-1),color:T.late},
  {id:genId(),type:"order",icon:"🛍️",text:"New order — Marcus Bell (VS-E7T2V5) · $395",at:addDays(NOW,-2),color:T.accent},
  {id:genId(),type:"shipped",icon:"📦",text:"VS-B2M7X1 marked shipped — Amara Okafor",at:addDays(NOW,-5),color:T.info},
  {id:genId(),type:"collection",icon:"⚖️",text:"VS-D1N4Q7 referred to collections — Priya Sharma",at:addDays(NOW,-10),color:T.error},
];

/* ── Micro components ─────────────────────────────────────────────── */
const VsBadge = ({status}) => {
  const M={paid:["b-paid","● Paid"],pending:["b-pending","○ Pending"],late:["b-late","! Late"],
    defaulted:["b-defaulted","✕ Default"],shipped:["b-shipped","↑ Shipped"],
    processing:["b-processing","⟳ Processing"],blocked:["b-blocked","⊘ Blocked"],
    active:["b-active","● Active"]};
  const [c,l]=M[status]||["b-processing",status];
  return <span className={`badge ${c}`}>{l}</span>;
};

const Spark = ({data,color=T.accent,h=26}) => {
  const mx=Math.max(...data,1);
  return <div className="vs-mbar-wrap" style={{height:h}}>
    {data.map((v,i)=><div key={i} className="vs-mbar" style={{height:`${clamp((v/mx)*100,6,100)}%`,background:i===data.length-1?color:`${color}38`}}/>)}
  </div>;
};

const Ring = ({pct,size=52,color=T.accent,thick=3}) => {
  const r=(size-thick*2)/2,circ=2*Math.PI*r;
  return <svg width={size} height={size} style={{flexShrink:0}}>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.border} strokeWidth={thick}/>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={thick}
      strokeDasharray={circ} strokeDashoffset={circ*(1-clamp(pct,0,100)/100)}
      strokeLinecap="round" style={{transform:"rotate(-90deg)",transformOrigin:"50% 50%",transition:"stroke-dashoffset 1s ease"}}/>
    <text x={size/2} y={size/2+4} textAnchor="middle" fill={T.text} fontSize={10} fontFamily="DM Mono" fontWeight="500">{pct}%</text>
  </svg>;
};

const LiveBadge = () => (
  <div style={{display:"flex",alignItems:"center",gap:5,padding:"3px 9px",background:"rgba(0,232,122,0.06)",border:"1px solid rgba(0,232,122,0.16)"}}>
    <div className="vs-live-dot"/><span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:T.success,letterSpacing:"0.07em"}}>LIVE</span>
  </div>
);

const Toggle = ({on,onChange}) => (
  <button className="vs-tog" onClick={onChange} style={{background:on?T.accent:T.border}}>
    <div className="vs-tog-knob" style={{left:on?19:2,background:on?"#000":"#555"}}/>
  </button>
);

const VsLabel = ({t,err}) => (
  <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:err?T.error:T.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:5}}>
    {t}{err&&<span style={{marginLeft:4,fontWeight:400}}>— {err}</span>}
  </div>
);

function LineChart({data,color=T.accent,h=80}) {
  const mn=Math.min(...data)*0.95,mx=Math.max(...data)*1.05||1;
  const px=(v,i)=>[(i/(data.length-1))*100,(1-(v-mn)/(mx-mn))*100];
  const pts=data.map((v,i)=>px(v,i));
  const path="M"+pts.map(([x,y])=>`${x},${y}`).join(" L");
  const fillPath=path+` L${pts[pts.length-1][0]},100 L0,100 Z`;
  return (
    <svg viewBox="0 0 100 100" style={{width:"100%",height:h,overflow:"visible"}} preserveAspectRatio="none">
      <defs><linearGradient id="vs-chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.18"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
      <path d={fillPath} fill="url(#vs-chartFill)"/>
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke"/>
      {pts.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="2.5" fill={i===pts.length-1?color:T.surfaceAlt} stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke"/>)}
    </svg>
  );
}

function Countdown({due}) {
  const days=daysUntil(due);
  if(days>0) return <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:days<=3?T.late:T.textMuted}}>{days}d left</span>;
  if(days===0) return <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:T.warning,animation:"vs-blink 2s infinite"}}>DUE TODAY</span>;
  return <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:T.error}}>{Math.abs(days)}d overdue</span>;
}

function riskScore(customer) {
  let score=0;
  customer.orders.forEach(o=>{
    if(o.payment2Status==="defaulted")score+=50;
    else if(o.payment2Status==="late")score+=30;
    else if(o.payment2Status==="pending"&&new Date(o.dueDate)<NOW)score+=20;
  });
  if(score>=50)return{level:"high",label:"High Risk",color:T.error};
  if(score>=20)return{level:"medium",label:"Med Risk",color:T.warning};
  return{level:"low",label:"Low Risk",color:T.success};
}

/* ── Pages ────────────────────────────────────────────────────────── */
function PageOverview({orders,stats,activity}) {
  const revWeekly=[420,680,510,920,1140,880,1360,Math.round(stats.revenue)];
  const ordWeekly=[1,2,1,3,3,2,4,stats.total];
  const tiles=[
    {l:"Total Orders",v:stats.total,s:"All time",c:T.text,spark:ordWeekly,sc:T.accent},
    {l:"Pending P2",v:stats.pending,s:"Awaiting payment",c:T.warning,spark:[2,3,2,4,3,5,4,stats.pending],sc:T.warning},
    {l:"Late",v:stats.late,s:"Past due",c:T.late,spark:[0,0,1,0,1,1,0,stats.late],sc:T.late},
    {l:"Defaulted",v:stats.defaulted,s:"Collections",c:T.error,spark:[0,0,0,1,0,1,0,stats.defaulted],sc:T.error},
    {l:"Revenue",v:fmtK(stats.revenue),s:"P1 + P2",c:T.success,spark:revWeekly.map(v=>v/100|0),sc:T.success},
    {l:"Outstanding",v:fmtK(stats.outstanding),s:"P2 owed",c:T.warning,spark:[8,6,9,7,10,8,11,stats.outstanding/20|0],sc:T.warning},
  ];
  return <div className="vs-fu">
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10,marginBottom:20}}>
      {tiles.map((s,i)=>(
        <div key={i} className="vs-tile" style={{animation:`vs-fadeUp ${0.08+i*0.06}s ease both`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:9}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:T.textMuted,letterSpacing:"0.11em",textTransform:"uppercase"}}>{s.l}</div>
            <Spark data={s.spark} color={s.sc}/>
          </div>
          <div style={{fontFamily:typeof s.v==="number"?"'Syne',sans-serif":"'DM Mono',monospace",fontSize:24,fontWeight:800,color:s.c,letterSpacing:"-0.02em",marginBottom:2}}>{s.v}</div>
          <div style={{fontSize:10,color:T.textMuted}}>{s.s}</div>
        </div>
      ))}
    </div>
    <div className="vs-card" style={{padding:"18px",marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div><div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:T.textMuted,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:3}}>Revenue Trend — Last 8 Weeks</div><div style={{fontFamily:"'DM Mono',monospace",fontSize:22,fontWeight:700,color:T.success}}>{fmtK(stats.revenue)}</div></div>
      </div>
      <div style={{height:90}}><LineChart data={revWeekly} color={T.success} h={90}/></div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
        {["W-8","W-7","W-6","W-5","W-4","W-3","W-2","Now"].map(w=><div key={w} style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:T.textFaint}}>{w}</div>)}
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:14,marginBottom:14}}>
      <div className="vs-card">
        <div style={{padding:"12px 18px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontWeight:700,fontSize:12}}>Recent Orders</div>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:T.textMuted}}>{orders.length} total</div>
        </div>
        <table className="vs-tbl"><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>P2</th><th>Countdown</th></tr></thead>
          <tbody>{orders.slice(0,5).map(o=>(
            <tr key={o.id}>
              <td><span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:T.accent}}>{o.orderId}</span>{o.flagged&&<span style={{marginLeft:5,color:T.warning,fontSize:10}}>⚑</span>}</td>
              <td><div style={{fontWeight:600,fontSize:11}}>{o.customer}</div></td>
              <td><span style={{fontFamily:"'DM Mono',monospace",fontSize:11}}>{fmt(o.orderTotal)}</span></td>
              <td><VsBadge status={o.payment2Status}/></td>
              <td>{o.payment2Status!=="paid"?<Countdown due={o.dueDate}/>:<span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:T.success}}>Completed</span>}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <div className="vs-card" style={{padding:"18px"}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:T.textMuted,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:12}}>P2 Collection Rate</div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <Ring pct={stats.collectionRate} color={T.success} size={56}/>
            <div><div style={{fontSize:20,fontWeight:800,color:T.success}}>{orders.filter(o=>o.payment2Status==="paid").length}<span style={{fontSize:12,color:T.textMuted,fontWeight:400}}>/{stats.total}</span></div><div style={{fontSize:10,color:T.textMuted}}>collected</div></div>
          </div>
        </div>
        <div className="vs-card" style={{padding:"18px"}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:T.textMuted,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:12}}>Status Breakdown</div>
          {[{l:"Paid",count:orders.filter(o=>o.payment2Status==="paid").length,c:T.success},{l:"Pending",count:stats.pending,c:T.warning},{l:"Late",count:stats.late,c:T.late},{l:"Defaulted",count:stats.defaulted,c:T.error}].map((x,i)=>(
            <div key={i} style={{marginBottom:9}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:10,color:T.textMuted}}>{x.l}</span><span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:x.c}}>{x.count}</span></div>
              <div style={{height:2,background:T.border,borderRadius:1,overflow:"hidden"}}><div style={{height:"100%",background:x.c,width:`${stats.total?Math.round((x.count/stats.total)*100):0}%`,borderRadius:1,transition:"width 1s ease"}}/></div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="vs-card">
      <div style={{padding:"12px 18px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontWeight:700,fontSize:12}}>Activity Feed</div><LiveBadge/></div>
      <div style={{padding:"0 18px"}}>
        {activity.slice(0,6).map((a,i)=>(
          <div key={i} className="vs-arow">
            <div style={{width:28,height:28,background:T.surfaceAlt,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,minWidth:28,flexShrink:0}}>{a.icon}</div>
            <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,lineHeight:1.5,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.text}</div><div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:T.textMuted,marginTop:2}}>{fmtFull(a.at)}</div></div>
            <div style={{width:5,height:5,background:a.color,borderRadius:"50%",minWidth:5,marginTop:6,flexShrink:0}}/>
          </div>
        ))}
      </div>
    </div>
  </div>;
}

function PageOrders({orders,upd,addLog}) {
  const [tab,setTab]=useState("all");
  const [q,setQ]=useState("");
  const [sort,setSort]=useState({f:"createdAt",d:"desc"});
  const [sel,setSel]=useState(null);
  const [checked,setChecked]=useState(new Set());
  const [note,setNote]=useState("");
  const [bulkMsg,setBulkMsg]=useState("");
  const ts=f=>setSort(s=>({f,d:s.f===f&&s.d==="asc"?"desc":"asc"}));
  const SI=({f})=><span style={{fontSize:8,color:sort.f===f?T.accent:T.textFaint,marginLeft:2}}>{sort.f===f?(sort.d==="asc"?"↑":"↓"):"↕"}</span>;
  const tabCounts={all:orders.length,pending:orders.filter(o=>o.payment2Status==="pending").length,late:orders.filter(o=>["late","defaulted"].includes(o.payment2Status)).length,paid:orders.filter(o=>o.payment2Status==="paid").length,flagged:orders.filter(o=>o.flagged).length};
  const rows=[...orders].sort((a,b)=>{
    let av=a[sort.f],bv=b[sort.f];
    if(sort.f==="orderTotal")av=+av,bv=+bv;
    if(sort.f.includes("Date")||sort.f==="dueDate"||sort.f==="createdAt")av=new Date(av),bv=new Date(bv);
    return (av<bv?-1:av>bv?1:0)*(sort.d==="asc"?1:-1);
  }).filter(o=>{
    const mt=tab==="all"?true:tab==="pending"?o.payment2Status==="pending":tab==="late"?["late","defaulted"].includes(o.payment2Status):tab==="paid"?o.payment2Status==="paid":o.flagged;
    return mt&&(!q||[o.customer,o.orderId,o.email].some(x=>x.toLowerCase().includes(q.toLowerCase())));
  });
  const selO=sel?orders.find(o=>o.id===sel.id)||sel:null;
  const act=(id,action)=>{
    const o=orders.find(x=>x.id===id);
    if(action==="p2paid"){upd(id,{payment2Status:"paid"});addLog({type:"payment",icon:"💳",text:`P2 marked paid — ${o?.orderId}`,color:T.success});}
    else if(action==="shipped"){upd(id,{fulfillmentStatus:"shipped"});addLog({type:"shipped",icon:"📦",text:`${o?.orderId} marked shipped`,color:T.info});}
    else if(action==="default"){upd(id,{payment2Status:"defaulted",lateFee:true});addLog({type:"collection",icon:"⚖️",text:`${o?.orderId} marked defaulted`,color:T.error});}
    else if(action==="remind"){addLog({type:"reminder",icon:"📩",text:`Manual reminder → ${o?.customer}`,color:T.warning});}
    else if(action==="flag"){upd(id,{flagged:!o?.flagged});addLog({type:"note",icon:"⚑",text:`${o?.orderId} ${o?.flagged?"unflagged":"flagged"}`,color:T.warning});}
    setSel(null);
  };
  const addNote=id=>{
    if(!note.trim())return;
    const n={id:genId(),text:note,at:new Date()};
    const o=orders.find(x=>x.id===id);
    upd(id,{notes:[...(o?.notes||[]),n]});
    setSel(p=>p?{...p,notes:[...(p.notes||[]),n]}:p);
    setNote("");
    addLog({type:"note",icon:"📝",text:`Note on ${selO?.orderId}`,color:T.info});
  };
  const toggleCheck=id=>setChecked(s=>{const n=new Set(s);n.has(id)?n.delete(id):n.add(id);return n;});
  const checkAll=()=>setChecked(s=>s.size===rows.length?new Set():new Set(rows.map(r=>r.id)));
  const bulkAct=action=>{checked.forEach(id=>act(id,action));setChecked(new Set());setBulkMsg(`${action} applied to ${checked.size} order(s)`);setTimeout(()=>setBulkMsg(""),2500);};
  return <div className="vs-fu">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
      <div style={{display:"flex",borderBottom:`1px solid ${T.border}`,overflowX:"auto"}}>
        {[["all","All"],["pending","Pending"],["late","Late/Default"],["paid","Paid"],["flagged","⚑ Flagged"]].map(([v,l])=>(
          <button key={v} className={`vs-ntab ${tab===v?"on":""}`} onClick={()=>setTab(v)}>
            {l} <span style={{marginLeft:3,fontFamily:"'DM Mono',monospace",fontSize:8,color:tab===v?T.accent:T.textFaint}}>{tabCounts[v]}</span>
          </button>
        ))}
      </div>
      <input className="vin sm" style={{width:180}} placeholder="Search…" value={q} onChange={e=>setQ(e.target.value)}/>
    </div>
    {checked.size>0&&(
      <div className="vs-fi" style={{background:"rgba(200,255,0,0.05)",border:`1px solid rgba(200,255,0,0.18)`,padding:"8px 14px",display:"flex",alignItems:"center",gap:10,marginBottom:10,flexWrap:"wrap"}}>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:T.accent}}>{checked.size} selected</span>
        <button className="vbtn xs" onClick={()=>bulkAct("remind")}>📩 Send Reminders</button>
        <button className="vbtn xs warn" onClick={()=>bulkAct("flag")}>⚑ Flag</button>
        <button className="vbtn xs err" onClick={()=>bulkAct("default")}>✕ Default All</button>
        <button className="vg xs" onClick={()=>setChecked(new Set())} style={{marginLeft:"auto"}}>Clear</button>
      </div>
    )}
    {bulkMsg&&<div className="vs-fi" style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:T.success,marginBottom:8}}>✓ {bulkMsg}</div>}
    <div className="vs-card" style={{overflow:"auto",marginBottom:12}}>
      <table className="vs-tbl">
        <thead><tr>
          <th style={{width:32}}><div className={`vs-chk ${checked.size===rows.length&&rows.length>0?"on":""}`} onClick={checkAll}>{checked.size===rows.length&&rows.length>0&&<svg width="8" height="6" viewBox="0 0 8 6"><path d="M1 3l2 2L7 1" stroke="#000" strokeWidth="1.5" fill="none"/></svg>}</div></th>
          <th className="sort" onClick={()=>ts("orderId")}>Order <SI f="orderId"/></th>
          <th className="sort" onClick={()=>ts("customer")}>Customer <SI f="customer"/></th>
          <th className="sort" onClick={()=>ts("orderTotal")}>Total <SI f="orderTotal"/></th>
          <th>P1</th><th>P2</th>
          <th className="sort" onClick={()=>ts("dueDate")}>Due <SI f="dueDate"/></th>
          <th>Countdown</th><th>Fee</th><th>Reminders</th><th>Ship</th>
        </tr></thead>
        <tbody>{rows.map(o=>(
          <tr key={o.id} onClick={()=>setSel(selO?.id===o.id?null:o)} className={`${selO?.id===o.id?"sel":""} ${checked.has(o.id)?"checked":""}`}>
            <td onClick={e=>{e.stopPropagation();toggleCheck(o.id);}}><div className={`vs-chk ${checked.has(o.id)?"on":""}`}>{checked.has(o.id)&&<svg width="8" height="6" viewBox="0 0 8 6"><path d="M1 3l2 2L7 1" stroke="#000" strokeWidth="1.5" fill="none"/></svg>}</div></td>
            <td><span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:T.accent}}>{o.orderId}</span>{o.flagged&&<span style={{marginLeft:4,color:T.warning,fontSize:10}}>⚑</span>}</td>
            <td><div style={{fontWeight:600,fontSize:11}}>{o.customer}</div><div style={{fontSize:9,color:T.textMuted}}>{o.email}</div></td>
            <td><span style={{fontFamily:"'DM Mono',monospace",fontSize:11}}>{fmt(o.orderTotal)}</span></td>
            <td><VsBadge status={o.payment1Status}/></td>
            <td><VsBadge status={o.payment2Status}/></td>
            <td><span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:new Date(o.dueDate)<NOW&&o.payment2Status!=="paid"?T.error:T.textMuted}}>{fmtShort(o.dueDate)}</span></td>
            <td>{o.payment2Status!=="paid"?<Countdown due={o.dueDate}/>:<span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:T.success}}>Done</span>}</td>
            <td>{o.lateFee?<span style={{color:T.late,fontFamily:"'DM Mono',monospace",fontSize:10}}>+$3</span>:<span style={{color:T.textFaint}}>—</span>}</td>
            <td><div style={{display:"flex",flexWrap:"wrap",gap:1}}>{o.reminders.length===0?<span style={{fontSize:9,color:T.textFaint}}>None</span>:o.reminders.map((r,i)=><span key={i} className={`vs-rchip ${r.sent?"vs-rc-s":r.type==="missed"?"vs-rc-m":"vs-rc-u"}`}>{r.sent?"✓":"○"}{r.type==="3-day"?"3d":r.type==="1-day"?"1d":r.type==="due-day"?"Due":r.type==="missed"?"Miss":"Col"}</span>)}</div></td>
            <td><VsBadge status={o.fulfillmentStatus}/></td>
          </tr>
        ))}</tbody>
      </table>
      {rows.length===0&&<div style={{padding:"36px",textAlign:"center",color:T.textMuted,fontFamily:"'DM Mono',monospace",fontSize:10}}>No orders match filters</div>}
    </div>
    {selO&&<div className="vs-si vs-card" style={{padding:"20px",borderLeft:`2px solid ${T.accent}`,marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div><div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:T.accent,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:3}}>Order Detail</div><div style={{fontWeight:800,fontSize:18}}>{selO.orderId}</div><div style={{fontSize:11,color:T.textMuted,marginTop:2}}>Created {fmtFull(selO.createdAt)}</div></div>
        <div style={{display:"flex",gap:6}}><button className="vg xs" onClick={()=>act(selO.id,"flag")}>{selO.flagged?"⚑ Unflag":"⚑ Flag"}</button><button onClick={()=>setSel(null)} style={{background:"none",border:"none",color:T.textMuted,fontSize:20,cursor:"pointer",lineHeight:1,padding:4}}>×</button></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:12,marginBottom:16,padding:"14px",background:T.surfaceAlt,border:`1px solid ${T.border}`}}>
        {[{l:"Name",v:selO.customer},{l:"Email",v:selO.email},{l:"Phone",v:selO.phone},{l:"ID",v:`${selO.idType} ****${selO.idLast4}`},{l:"Billing",v:selO.billingAddr},{l:"Shipping",v:selO.shippingAddr}].map((x,i)=>(
          <div key={i}><div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:T.textMuted,letterSpacing:"0.09em",textTransform:"uppercase",marginBottom:3}}>{x.l}</div><div style={{fontSize:11,lineHeight:1.4,wordBreak:"break-word"}}>{x.v}</div></div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:8,marginBottom:16}}>
        {[{l:"Order Total",v:fmt(selO.orderTotal),c:T.text},{l:"Payment 1",v:fmt(selO.payment1),c:T.success,st:selO.payment1Status},{l:"Payment 2",v:fmt(selO.payment2+(selO.lateFee?3:0)),c:selO.payment2Status==="paid"?T.success:selO.payment2Status==="late"?T.late:T.warning,st:selO.payment2Status,note:selO.lateFee&&!selO.lateFeePaid?"+$3 late fee":null},{l:"P2 Due",v:fmtDate(selO.dueDate),c:new Date(selO.dueDate)<NOW&&selO.payment2Status!=="paid"?T.error:T.textMuted}].map((x,i)=>(
          <div key={i} style={{background:T.surfaceAlt,border:`1px solid ${T.border}`,padding:"10px 12px"}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:T.textMuted,letterSpacing:"0.09em",textTransform:"uppercase",marginBottom:5}}>{x.l}</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:14,fontWeight:600,color:x.c,marginBottom:x.st?4:0}}>{x.v}</div>
            {x.st&&<VsBadge status={x.st}/>}
            {x.note&&<div style={{fontSize:9,color:T.late,marginTop:3,fontFamily:"'DM Mono',monospace"}}>{x.note}</div>}
          </div>
        ))}
      </div>
      <div style={{marginBottom:16}}>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:T.textMuted,letterSpacing:"0.09em",textTransform:"uppercase",marginBottom:8}}>Reminder Log</div>
        {selO.reminders.length===0?<div style={{fontSize:11,color:T.textFaint}}>No reminders sent yet.</div>:
          <div style={{background:T.surfaceAlt,border:`1px solid ${T.border}`}}>
            {selO.reminders.map((r,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 12px",borderBottom:i<selO.reminders.length-1?`1px solid ${T.border}`:"none"}}>
                <span style={{color:r.sent?T.success:T.textFaint,fontSize:10}}>{r.sent?"●":"○"}</span>
                <span style={{flex:1,fontSize:11,color:r.sent?T.text:T.textMuted}}>{{
                  "3-day":"3-day reminder","1-day":"1-day reminder","due-day":"Due date reminder",
                  "missed":"Missed payment notice","collection":"Collections notice"
                }[r.type]||r.type}</span>
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:T.textMuted}}>{r.sentAt?fmtDate(r.sentAt):"—"}</span>
              </div>
            ))}
          </div>
        }
      </div>
      <div style={{marginBottom:16}}>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:T.textMuted,letterSpacing:"0.09em",textTransform:"uppercase",marginBottom:8}}>Internal Notes</div>
        {(selO.notes||[]).length===0&&<div style={{fontSize:11,color:T.textFaint,marginBottom:8}}>No notes.</div>}
        <div style={{background:T.surfaceAlt,border:`1px solid ${T.border}`,marginBottom:8}}>
          {(selO.notes||[]).map((n,i)=>(
            <div key={i} className="vs-note"><div style={{marginBottom:3}}>{n.text}</div><div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:T.textMuted}}>{fmtFull(n.at)}</div></div>
          ))}
        </div>
        <div style={{display:"flex",gap:7}}><input className="vin sm" placeholder="Add note… (Enter)" style={{flex:1}} value={note} onChange={e=>setNote(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addNote(selO.id)}/><button className="vbtn sm" onClick={()=>addNote(selO.id)} disabled={!note.trim()}>Add</button></div>
      </div>
      <div style={{display:"flex",gap:7,flexWrap:"wrap",paddingTop:12,borderTop:`1px solid ${T.border}`}}>
        {selO.payment2Status==="pending"&&<button className="vbtn sm" onClick={()=>act(selO.id,"p2paid")}>✓ Mark P2 Paid</button>}
        {selO.payment2Status==="late"&&<button className="vbtn warn sm" onClick={()=>act(selO.id,"p2paid")}>✓ P2 Paid + Clear Fee</button>}
        {selO.fulfillmentStatus==="processing"&&<button className="vbtn sm" onClick={()=>act(selO.id,"shipped")}>📦 Mark Shipped</button>}
        <button className="vg sm" onClick={()=>act(selO.id,"remind")}>📩 Send Reminder</button>
        {!["defaulted","paid"].includes(selO.payment2Status)&&<button className="vg sm danger" onClick={()=>act(selO.id,"default")}>⚠ Mark Defaulted</button>}
      </div>
    </div>}
  </div>;
}

function PageActivity({activity}) {
  const [filter,setFilter]=useState("all");
  const [q,setQ]=useState("");
  const types=["all","payment","order","reminder","shipped","late_fee","collection","note"];
  const TC={payment:T.success,order:T.accent,reminder:T.warning,shipped:T.info,late_fee:T.late,collection:T.error,note:T.textMuted};
  const list=activity.filter(a=>(filter==="all"||a.type===filter)&&(!q||a.text.toLowerCase().includes(q.toLowerCase())));
  const grouped=[];
  let lastDay="";
  list.forEach(a=>{
    const day=fmtDate(a.at);
    if(day!==lastDay){grouped.push({type:"day",label:day});lastDay=day;}
    grouped.push({type:"event",event:a});
  });
  return <div className="vs-fu">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
      <div><h3 style={{fontWeight:700,fontSize:15}}>Activity Log</h3><p style={{fontSize:11,color:T.textMuted,marginTop:2}}>{activity.length} total events</p></div>
      <input className="vin sm" style={{width:200}} placeholder="Search events…" value={q} onChange={e=>setQ(e.target.value)}/>
    </div>
    <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:16}}>
      {types.map(t=>(
        <button key={t} onClick={()=>setFilter(t)} style={{background:filter===t?"rgba(200,255,0,0.08)":T.surfaceAlt,border:`1px solid ${filter===t?"rgba(200,255,0,0.25)":T.border}`,color:filter===t?T.accent:T.textMuted,padding:"4px 10px",fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:"0.07em",textTransform:"uppercase",cursor:"pointer",transition:"all 0.12s"}}>
          {t==="all"?`all (${activity.length})`:`${t} (${activity.filter(a=>a.type===t).length})`}
        </button>
      ))}
    </div>
    {list.length===0&&<div className="vs-card" style={{padding:"40px",textAlign:"center",color:T.textMuted,fontFamily:"'DM Mono',monospace",fontSize:10}}>No events match filters</div>}
    <div style={{position:"relative",paddingLeft:32}}>
      <div className="vs-tl-line"/>
      {grouped.map((g,i)=>(
        g.type==="day"?
          <div key={i} style={{position:"relative",marginBottom:8,marginTop:i>0?16:0}}>
            <div className="vs-tl-dot" style={{background:T.border,top:2}}/>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:T.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",paddingLeft:4}}>{g.label}</div>
          </div>:
          <div key={i} className="vs-card" style={{marginBottom:6,padding:"11px 14px",display:"flex",gap:10,alignItems:"flex-start",position:"relative"}}>
            <div className="vs-tl-dot" style={{background:TC[g.event.type]||T.accent,top:14,left:-22}}/>
            <div style={{width:28,height:28,background:T.surfaceAlt,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,minWidth:28,flexShrink:0}}>{g.event.icon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,lineHeight:1.5}}>{g.event.text}</div>
              <div style={{display:"flex",gap:8,alignItems:"center",marginTop:4,flexWrap:"wrap"}}>
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:T.textMuted}}>{fmtTime(g.event.at)}</span>
                <span style={{padding:"1px 6px",background:`${TC[g.event.type]||T.accent}12`,border:`1px solid ${TC[g.event.type]||T.accent}28`,fontFamily:"'DM Mono',monospace",fontSize:8,color:TC[g.event.type]||T.accent,letterSpacing:"0.07em",textTransform:"uppercase"}}>{g.event.type}</span>
              </div>
            </div>
            <div style={{width:5,height:5,background:g.event.color||T.accent,borderRadius:"50%",flexShrink:0,marginTop:6}}/>
          </div>
      ))}
    </div>
  </div>;
}

function PageSettings() {
  const [s,setS]=useState({minOrder:150,lateFee:3,grace:1,term:14,blockDefault:true,autoRemind:true,r3:true,r1:true,rDue:true,rMiss:true,channel:"both",brand:"VIGOSPLIT",email:"support@vigosplit.com",webhookUrl:"",webhookEnabled:false,notifyOnDefault:true,notifyOnLate:true,notifyOnNewOrder:false});
  const [saved,setSaved]=useState(false);
  const set=(k,v)=>setS(x=>({...x,[k]:v}));
  const save=()=>{setSaved(true);setTimeout(()=>setSaved(false),2500);};
  const Sec=({title,children})=>(<div className="vs-card" style={{padding:"20px",marginBottom:12,borderTop:`2px solid ${T.accent}`}}><div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:T.accent,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:14,fontWeight:500}}>{title}</div>{children}</div>);
  const Row=({label,sub,children})=>(<div className="vs-row"><div><div style={{fontSize:12,fontWeight:600}}>{label}</div>{sub&&<div style={{fontSize:10,color:T.textMuted,marginTop:2}}>{sub}</div>}</div>{children}</div>);
  const Tog=({k})=><Toggle on={s[k]} onChange={()=>set(k,!s[k])}/>;
  const Num=({k,pre,suf,w=70})=><div style={{display:"flex",alignItems:"center",gap:5}}>{pre&&<span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:T.textMuted}}>{pre}</span>}<input className="vin sm" type="number" style={{width:w,textAlign:"right"}} value={s[k]} onChange={e=>set(k,e.target.value)}/>{suf&&<span style={{fontSize:11,color:T.textMuted}}>{suf}</span>}</div>;
  return <div className="vs-fu">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <div><h3 style={{fontWeight:700,fontSize:15}}>Settings</h3><p style={{fontSize:11,color:T.textMuted,marginTop:2}}>Configure VIGOSPLIT rules</p></div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        {saved&&<span className="vs-fi" style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:T.success}}>✓ Saved</span>}
        <button className="vbtn sm" onClick={save}>Save Changes</button>
      </div>
    </div>
    <Sec title="Payment Rules">
      <Row label="Minimum Order" sub="Required minimum to qualify for VIGOSPLIT"><Num k="minOrder" pre="$"/></Row>
      <Row label="Late Fee" sub="Applied when Payment 2 is missed"><Num k="lateFee" pre="$"/></Row>
      <Row label="Grace Period"><Num k="grace" suf="days" w={60}/></Row>
      <Row label="Payment Term"><Num k="term" suf="days" w={60}/></Row>
    </Sec>
    <Sec title="Customer Rules">
      <Row label="Block Defaulted Customers" sub="Prevent reuse after default"><Tog k="blockDefault"/></Row>
      <Row label="Automated Reminders"><Tog k="autoRemind"/></Row>
    </Sec>
    <Sec title="Reminder Schedule">
      <Row label="3-Day Reminder"><Tog k="r3"/></Row>
      <Row label="1-Day Reminder"><Tog k="r1"/></Row>
      <Row label="Due Date Alert"><Tog k="rDue"/></Row>
      <Row label="Missed Payment Notice"><Tog k="rMiss"/></Row>
      <Row label="Delivery Channel"><select className="vsel" value={s.channel} onChange={e=>set("channel",e.target.value)}><option value="email">Email only</option><option value="sms">SMS only</option><option value="both">Email + SMS</option></select></Row>
    </Sec>
    <Sec title="Brand">
      <Row label="Brand Name"><input className="vin sm" style={{width:180}} value={s.brand} onChange={e=>set("brand",e.target.value)}/></Row>
      <Row label="Support Email"><input className="vin sm" style={{width:220}} value={s.email} onChange={e=>set("email",e.target.value)}/></Row>
    </Sec>
  </div>;
}

/* ── Main export ──────────────────────────────────────────────────── */
const VS_PAGES=[
  {id:"overview",icon:"▤",label:"Overview"},
  {id:"orders",icon:"◈",label:"Orders"},
  {id:"activity",icon:"◌",label:"Activity"},
  {id:"settings",icon:"⊞",label:"Settings"},
];

export default function AdminVigoSplit() {
  const [page,setPage]=useState("overview");
  const [orders,setOrders]=useState(SEED_ORDERS);
  const [activity,setActivity]=useState(SEED_ACTIVITY);
  const [clock,setClock]=useState(new Date());

  useEffect(()=>{const t=setInterval(()=>setClock(new Date()),1000);return()=>clearInterval(t);},[]);

  const addLog=useCallback((entry)=>setActivity(p=>[{id:genId(),at:new Date(),...entry},...p]),[]);
  const upd=useCallback((id,patch)=>setOrders(p=>p.map(o=>{
    if(o.id!==id)return o;
    const u={...o,...patch};
    if(patch.payment2Status==="paid"){u.payment2Date=new Date();u.lateFee=false;u.lateFeePaid=true;}
    return u;
  })),[]);

  const stats={
    total:orders.length,
    pending:orders.filter(o=>o.payment2Status==="pending").length,
    late:orders.filter(o=>o.payment2Status==="late").length,
    defaulted:orders.filter(o=>o.payment2Status==="defaulted").length,
    revenue:orders.reduce((s,o)=>s+o.payment1,0)+orders.filter(o=>o.payment2Status==="paid").reduce((s,o)=>s+o.payment2,0),
    outstanding:orders.filter(o=>o.payment2Status!=="paid").reduce((s,o)=>s+o.payment2+(o.lateFee?3:0),0),
    lateFees:orders.filter(o=>o.lateFee).length*3,
    collectionRate:orders.length?Math.round((orders.filter(o=>o.payment2Status==="paid").length/orders.length)*100):0,
  };

  const lateN=orders.filter(o=>o.payment2Status==="late").length;
  const tickerItems=[
    {icon:"💳",text:`Revenue: ${fmtK(stats.revenue)}`},{icon:"⚡",text:`${stats.pending} pending P2`},
    {icon:"⚠️",text:lateN>0?`${lateN} overdue`:"No overdue"},{icon:"📦",text:`${orders.filter(o=>o.fulfillmentStatus==="processing").length} processing`},
    {icon:"⊘",text:`${stats.defaulted} defaulted`},{icon:"💰",text:`${fmtK(stats.outstanding)} outstanding`},
  ];

  return (
    <div className="vs-wrap">
      <style>{CSS}</style>

      {/* Inner layout — full width within admin's content area */}
      <div style={{display:"flex",height:"calc(100vh - 60px)",overflow:"hidden",background:T.bg}}>
        {/* VIGOSPLIT sidebar */}
        <div style={{width:180,minWidth:180,background:T.surface,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",flexShrink:0}}>
          <div style={{padding:"14px 16px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
            <div style={{fontWeight:800,fontSize:13,letterSpacing:"0.05em"}}>VIGO<span style={{color:T.accent}}>SPLIT</span></div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:T.textMuted,letterSpacing:"0.08em",textTransform:"uppercase",marginTop:2}}>Admin Module</div>
          </div>
          <nav style={{flex:1,paddingTop:4,overflowY:"auto"}}>
            {VS_PAGES.map(p=>(
              <button key={p.id} onClick={()=>setPage(p.id)} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 16px",cursor:"pointer",transition:"all 0.12s",borderLeft:`2px solid ${page===p.id?T.accent:"transparent"}`,color:page===p.id?T.accent:T.textMuted,fontSize:11,fontWeight:600,background:page===p.id?"rgba(200,255,0,0.04)":"none",border:"none",borderLeftWidth:2,borderLeftStyle:"solid",borderLeftColor:page===p.id?T.accent:"transparent",width:"100%",fontFamily:"'Syne',sans-serif",whiteSpace:"nowrap",letterSpacing:"0.01em",textAlign:"left"}}>
                <span style={{fontSize:11,minWidth:14,textAlign:"center",flexShrink:0}}>{p.icon}</span>
                <span>{p.label}</span>
                {p.id==="orders"&&lateN>0&&<span style={{marginLeft:"auto",background:T.late,color:"#fff",borderRadius:9,padding:"1px 5px",fontSize:8,fontFamily:"'DM Mono',monospace",fontWeight:700,flexShrink:0}}>{lateN}</span>}
              </button>
            ))}
          </nav>
          <div style={{borderTop:`1px solid ${T.border}`,padding:"10px 16px",flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:5}}><div className="vs-live-dot"/><span style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:T.success,letterSpacing:"0.07em"}}>LIVE</span></div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:T.accent,marginTop:4}}>{clock.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</div>
          </div>
        </div>

        {/* Content */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
          {/* Ticker */}
          <div className="vs-ticker-wrap" style={{flexShrink:0}}>
            <div className="vs-ticker-inner">
              {[...tickerItems,...tickerItems].map((t,i)=>(
                <div key={i} className="vs-tick-item"><span style={{color:T.accent,marginRight:4}}>{t.icon}</span>{t.text}</div>
              ))}
            </div>
          </div>
          {/* Page */}
          <div style={{flex:1,overflowY:"auto",padding:"20px 24px 60px",background:T.bg}}>
            {page==="overview"&&<PageOverview orders={orders} stats={stats} activity={activity}/>}
            {page==="orders"&&<PageOrders orders={orders} upd={upd} addLog={addLog}/>}
            {page==="activity"&&<PageActivity activity={activity}/>}
            {page==="settings"&&<PageSettings/>}
          </div>
        </div>
      </div>
    </div>
  );
}