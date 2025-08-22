<script type="module">
import { auth, db } from "./firebase.js";
import { GoogleAuthProvider, signInWithPopup, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

async function bootstrap(user){
  const ref=doc(db,"users",user.uid); const snap=await getDoc(ref);
  if(!snap.exists()) await setDoc(ref,{ uid:user.uid, email:user.email, name:user.displayName||"", role:"client", createdAt:serverTimestamp() });
  location.href = sessionStorage.getItem("redirectAfterLogin") || "dashboard.html";
}

document.querySelector("[data-google-login]")?.addEventListener("click", async ()=>{
  const { user } = await signInWithPopup(auth, new GoogleAuthProvider()); await bootstrap(user);
});

const settings = { url: location.origin + "/dashboard.html", handleCodeInApp: true };
document.querySelector("[data-email-link]")?.addEventListener("click", async ()=>{
  const email = prompt("Enter your email"); if(!email) return;
  await sendSignInLinkToEmail(auth, email, settings);
  localStorage.setItem("emailForSignIn", email);
  alert("Login link sent to email.");
});

if (isSignInWithEmailLink(auth, location.href)) {
  const email = localStorage.getItem("emailForSignIn") || prompt("Confirm your email");
  const { user } = await signInWithEmailLink(auth, email, location.href);
  await bootstrap(user);
}
</script>
