<script type="module">
import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const $=s=>document.querySelector(s);
const loginBtn=$("[data-login-btn]"), profile=$("[data-profile]");
const nameEl=$("[data-profile-name]"), roleChip=$("[data-role-chip]");
const privEls=document.querySelectorAll("[data-private]");

function setPrivate(v){ privEls.forEach(el=>el.classList.toggle("hidden",!v)); }
function loggedOut(){ loginBtn?.classList.remove("hidden"); profile?.classList.add("hidden"); setPrivate(false); }
function loggedIn(name,role){ loginBtn?.classList.add("hidden"); profile?.classList.remove("hidden"); setPrivate(true); nameEl&&(nameEl.textContent=name||"User"); roleChip&&(roleChip.textContent=role||"client"); }

onAuthStateChanged(auth, async (u)=>{
  if(!u){ loggedOut(); return; }
  let role="client", name=u.displayName||u.email||"User";
  try{ const s=await getDoc(doc(db,"users",u.uid)); if(s.exists()){ role=s.data().role||role; name=s.data().name||name; } }catch(e){}
  window.__ROLE__=role; loggedIn(name,role);
});
loginBtn?.addEventListener("click",()=>location.href="login.html");
document.querySelectorAll("[data-logout]").forEach(b=>b.addEventListener("click", async ()=>{
  await signOut(auth); location.href="index.html";
}));
</script>
