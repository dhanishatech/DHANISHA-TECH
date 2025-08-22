<script type="module">
import { auth, db } from "./firebase.js";
import { collection, query, where, orderBy, getDocs, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
const root=document.getElementById("projects");
let role=window.__ROLE__||"client";
function chip(t,done){ const c=done?"#00b894":"#ddd"; return `<span style="display:inline-block;padding:2px 8px;border:1px solid ${c};border-radius:999px;margin:2px">${t}</span>`;}
function card(id,p){ const ms=(p.milestones||[]).map((m,i)=>chip(`${i+1}. ${m.title}`, m.status==="done")).join(""); const who=(p.assignedFreelancers||[]).join(", ")||"—";
  return `<div class="card"><h3>${p.title}</h3><small class="muted">${p.desc||""}</small><br/><small>Budget: ₹${(p.budgetMin||0).toLocaleString("en-IN")}–₹${(p.budgetMax||0).toLocaleString("en-IN")} • Days: ${p.days}</small><br/><small>Status: <b>${p.status}</b> • Assignees: ${who}</small><div class="mt">${ms}</div><div class="mt"><a class="btn-outline" href="uploads.html">Files</a> ${role==="admin"?`<button class="btn" data-advance="${id}">Advance Milestone</button>`:""}</div></div>`;}
async function load(){ role=window.__ROLE__||"client"; let q; if(role==="admin") q=query(collection(db,"projects"), orderBy("createdAt","desc")); else if(role==="client") q=query(collection(db,"projects"), where("clientId","==",auth.currentUser.uid), orderBy("createdAt","desc")); else q=query(collection(db,"projects"), where("assignedFreelancers","array-contains",auth.currentUser.uid), orderBy("createdAt","desc"));
  const snap=await getDocs(q); root.innerHTML=snap.empty?`<div class="card">No projects</div>`:snap.docs.map(d=>card(d.id,d.data())).join("");
  root.querySelectorAll("[data-advance]").forEach(btn=>btn.addEventListener("click", async ()=>{ const id=btn.dataset.advance; const s=await getDoc(doc(db,"projects",id)); if(!s.exists()) return; const p=s.data(); const ms=(p.milestones||[]).map(x=>({...x})); const i=ms.findIndex(m=>m.status!=="done"); if(i>=0) ms[i].status="done"; await updateDoc(doc(db,"projects",id), { milestones:ms }); load(); }));
}
load();
</script>
