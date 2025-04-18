
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB3ydz419KcuNRQxdBSTIHfbjgpSK-oOdU",
  authDomain: "esi-2d7b2.firebaseapp.com",
  projectId: "esi-2d7b2",
  storageBucket: "esi-2d7b2.appspot.com",
  messagingSenderId: "348170091277",
  appId: "1:348170091277:web:d0e1f150fe97c4638e4e44",
  measurementId: "G-32610QEXWY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let confirmationResult;

window.onload = () => {
  window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "normal",
    callback: () => console.log("reCAPTCHA solved"),
    "expired-callback": () => alert("reCAPTCHA expired. Reload."),
  });

  recaptchaVerifier.render();

  onAuthStateChanged(auth, (user) => {
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");

    if (user) {
      if (loginBtn) loginBtn.style.display = "none";
      if (logoutBtn) logoutBtn.style.display = "inline-block";
    } else {
      if (loginBtn) loginBtn.style.display = "inline-block";
      if (logoutBtn) logoutBtn.style.display = "none";
    }
  });

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      signOut(auth).then(() => {
        alert("Logged out.");
        window.location.href = "login.html";
      });
    });
  }
};

window.sendOTP = () => {
  const code = document.getElementById("country-code").value;
  const number = document.getElementById("phone-number").value.trim();
  const fullPhone = code + number;

  signInWithPhoneNumber(auth, fullPhone, window.recaptchaVerifier)
    .then((result) => {
      confirmationResult = result;
      alert("OTP sent!");
    })
    .catch((error) => alert(error.message));
};

window.verifyOTP = () => {
  const code = document.getElementById("otp-code").value;
  confirmationResult.confirm(code)
    .then((result) => {
      alert("Login successful!");
      window.location.href = "index.html";
    })
    .catch((error) => alert("OTP error: " + error.message));
};
