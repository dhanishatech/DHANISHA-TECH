<script type="module">
import { auth, db } from "./firebase.js";
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
const list=document.getElementById("orderList");
function row(x,prodTitle){ return `<li class="card"><b>${prodTitle||x.productId}</b> — ₹ ${Number(x.amount||0).toLocaleString("en-IN")} • <b>${x.status}</b><br/>${x.status==="paid"&&x.downloadUrl?`<a class="btn" href="${x.downloadUrl}" target="_blank">Download</a>`:"<small class='muted'>Waiting for payment confirmation</small>"}</li>`;}
onSnapshot(query(collection(db,"orders"), where("buyerId","==",auth.currentUser.uid), orderBy("createdAt","desc")), async snap=>{
  if(snap.empty){ list.innerHTML="<li>No orders</li>"; return; }
  const html = await Promise.all(snap.docs.map(async d=>{ const x=d.data(); const p=await getDoc(doc(db,"products",x.productId)); return row(x, p.exists()?p.data().title:null); }));
  list.innerHTML = html.join("");
});
</script>
