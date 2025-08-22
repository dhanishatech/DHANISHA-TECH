<script type="module">
import { auth, db } from "./firebase.js";
import { collection, getDocs, query, where, orderBy, addDoc, doc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
const root=document.getElementById("prodList");
function card(id,x){return `<li class="card">${x.coverUrl?`<img src="${x.coverUrl}" style="max-width:100%;border-radius:8px">`:""}<h3>${x.title}</h3><small class="muted">${x.desc||""}</small><br/><b>₹ ${Number(x.price||0).toLocaleString("en-IN")}</b><br/><button class="btn" data-buy="${id}">Buy</button></li>`;}
const snap=await getDocs(query(collection(db,"products"), where("active","==",true), orderBy("createdAt","desc")));
root.innerHTML=snap.empty?"<li class='card'>No products</li>":snap.docs.map(d=>card(d.id,d.data())).join("");
root.querySelectorAll("[data-buy]").forEach(b=>b.addEventListener("click",()=>buy(b.dataset.buy)));
async function buy(productId){
  if(!auth.currentUser){ sessionStorage.setItem("redirectAfterLogin","store.html"); location.href="login.html"; return; }
  const p=await getDoc(doc(db,"products",productId)); if(!p.exists()) return alert("Missing product");
  const ref = await addDoc(collection(db,"orders"), { buyerId:auth.currentUser.uid, productId, amount:p.data().price, currency:"INR", status:"pending", createdAt:serverTimestamp() });
  location.href="orders.html?order="+ref.id;
}
</script>
