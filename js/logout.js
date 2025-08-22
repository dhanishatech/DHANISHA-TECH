<script type="module">
import { auth } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
document.querySelectorAll("[data-logout]").forEach(b=>b.addEventListener("click", async ()=>{
  await signOut(auth); location.href="index.html";
}));
</script>
