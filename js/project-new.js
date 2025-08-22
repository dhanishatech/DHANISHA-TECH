<script type="module">
import { auth } from "./firebase.js";
const $=s=>document.querySelector(s);
document.getElementById("submit").addEventListener("click", async ()=>{
  const payload={ ptype:$("#ptype").value, budget:$("#budget").value.trim(), days:Number($("#days").value||14), features:($("#features").value||"").split(",").map(s=>s.trim()).filter(Boolean), desc:$("#desc").value.trim() };
  const idToken = await auth.currentUser.getIdToken();
  const url = "https://<YOUR_REGION>-<YOUR_PROJECT>.cloudfunctions.net/createProject";
  const res = await fetch(url,{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ idToken, payload })}).then(r=>r.json());
  if(res.ok) location.href="projects.html"; else alert(res.error||"Failed");
});
</script>
