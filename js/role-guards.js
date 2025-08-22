<script type="module">
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
const blocks=document.querySelectorAll("[data-role]");
function apply(role){ blocks.forEach(el=>{ const allow=(el.getAttribute("data-role")||"").split(",").map(s=>s.trim()); el.classList.toggle("hidden",!(allow.includes(role)||allow.includes("all"))); }); }
onAuthStateChanged(auth, async (u)=>{ if(!u) return; let role="client"; try{ const s=await getDoc(doc(db,"users",u.uid)); if(s.exists()) role=s.data().role||role; }catch(e){} window.__ROLE__=role; apply(role); });
</script>
