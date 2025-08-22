<script type="module">
import { auth, db } from "./firebase.js";
import { collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
const root=document.getElementById("jobsList");
function card(id,p){return `<li class="card"><h3>${p.title}</h3><small class="muted">${p.desc||""}</small><br/><small>Budget: ₹${(p.budgetMin||0).toLocaleString("en-IN")}–₹${(p.budgetMax||0).toLocaleString("en-IN")} • Days: ${p.days}</small><br/><small>Skills: ${(p.features||[]).join(", ")||"—"}</small><div class="mt"><button class="btn" data-apply="${id}">Apply</button></div></li>`;}
const snap=await getDocs(query(collection(db,"projects"), where("status","in",["intake","screening"]), orderBy("createdAt","desc")));
root.innerHTML=snap.empty?"<li class='card'>No open projects</li>":snap.docs.map(d=>card(d.id,d.data())).join("");
root.querySelectorAll("[data-apply]").forEach(b=>b.addEventListener("click", ()=>apply(b.dataset.apply)));
async function apply(projectId){ const cover=prompt("Write a short cover letter"); if(cover===null) return; const idToken=await auth.currentUser.getIdToken(); const url="https://<YOUR_REGION>-<YOUR_PROJECT>.cloudfunctions.net/applyToProject"; const res=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({idToken, projectId, cover})}).then(r=>r.json()); if(res.ok) alert("Applied!"); else alert(res.error||"Failed"); }
</script>
