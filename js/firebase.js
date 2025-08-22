<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app-check.js";
import { getAuth, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";

/* ======== FILL THIS WITH YOUR CONFIG ======== */
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  appId: "1:XXXX:web:YYYY"
};
/* ============================================ */

export const app = initializeApp(firebaseConfig);

// (optional but recommended) App Check
try {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider("YOUR_RECAPTCHA_V3_SITE_KEY"),
    isTokenAutoRefreshEnabled: true,
  });
} catch (e) { /* ignore in local */ }

export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
export const db = getFirestore(app);
export const storage = getStorage(app);
</script>
