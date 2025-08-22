<script type="module">
import { auth, db, storage } from "./firebase.js";
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";
const sel=document.getElementById("projectSel"), file=document.getElementById("file"), btn=document.getElementById("upload"), list=document.getElementById("deliveries");
let role=window.__ROLE__||"client";
async function loadProjects(){ let q; if(role==="client") q=query(collection(db,"projects"), where("clientId","==",auth.currentUser.uid), orderBy("createdAt","desc")); else if(role==="freelancer") q=query(collection(db,"projects"), where("assignedFreelancers","array-contains",auth.currentUser.uid), orderBy("createdAt","desc")); else q=query(collection(db,"projects"), orderBy("createdAt","desc"));
  const snap=await getDocs(q); sel.innerHTML=snap.empty?"<option value=''>No projects</option>":snap.docs.map(d=>`<option value="${d.id}" data-client="${d.data().clientId}">${d.data().title}</option>`).join("");
}
async function loadDeliveries(){ let q; if(role==="client") q=query(collection(db,"deliveries"), where("clientId","==",auth.currentUser.uid), orderBy("createdAt","desc")); else if(role==="freelancer") q=query(collection(db,"deliveries"), where("uploaderId","==",auth.currentUser.uid), orderBy("createdAt","desc")); else q=query(collection(db,"deliveries"), orderBy("createdAt","desc"));
  const snap=await getDocs(q); list.innerHTML = snap.empty?"<li>No files</li>":snap.docs.map(d=>{ const x=d.data(); return `<li class="card"><b>${x.fileName}</b> — <small class="muted">Project: ${x.projectTitle||x.projectId}</small><br/><a class="btn" href="${x.downloadUrl}" target="_blank">Download</a></li>`; }).join("");
}
btn?.addEventListener("click", async ()=>{ if(role!=="freelancer") return alert("Only freelancers can upload."); const pid=sel.value; if(!pid) return alert("Select project"); const f=file.files[0]; if(!f) return alert("Choose a file");
  const clientId=sel.options[sel.selectedIndex].dataset.client; const path=`project-deliveries/${pid}/${Date.now()}_${f.name}`; const r=ref(storage,path);
  await uploadBytes(r,f,{ customMetadata:{ projectId:pid, clientId, uploaderId:auth.currentUser.uid } });
  const url=await getDownloadURL(r);
  await addDoc(collection(db,"deliveries"), { projectId:pid, clientId, uploaderId:auth.currentUser.uid, fileName:f.name, storagePath:path, downloadUrl:url, createdAt:serverTimestamp() });
  file.value=""; loadDeliveries();
});
(async()=>{ await loadProjects(); await loadDeliveries(); })();
</script>
