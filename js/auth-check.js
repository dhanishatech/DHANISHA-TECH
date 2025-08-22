<script type="module">
import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
onAuthStateChanged(auth,(u)=>{ if(!u){ sessionStorage.setItem("redirectAfterLogin", location.pathname); location.href="login.html"; }});
</script>
