<script type="module">
import { db } from "./firebase.js";
import { collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
const root=document.getElementById("offersList"); const role=window.__ROLE__||"client";
const col=collection(db,"offers");
const [s1,s2]=await Promise.all([
  getDocs(query(col, where("role","==",role), where("active","==",true), orderBy("createdAt","desc"))),
  getDocs(query(col, where("role","==","all"),  where("active","==",true), orderBy("createdAt","desc")))
]);
const docs=[...s1.docs,...s2.docs];
root.innerHTML = docs.length? docs.map(d=>{
  const x=d.data(); const price = x.unit==="percent" ? `${x.price}%` : `₹ ${Number(x.price||0).toLocaleString("en-IN")}`;
  return `<li class="card"><b>${x.title}</b><br/><small class="muted">${x.desc||""}</small><br/><b>${price}</b></li>`;
}).join("") : "<li class='card'>No offers</li>";
</script>
