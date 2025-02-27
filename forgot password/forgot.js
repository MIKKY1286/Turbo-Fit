// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyAt8l4aBhsjfigqhPupfC6Y6eE2Nyh-pGI",
    authDomain: "snaporia-207ae.firebaseapp.com",
    projectId: "snaporia-207ae",
    storageBucket: "snaporia-207ae.firebasestorage.app",
    messagingSenderId: "676150553528",
    appId: "1:676150553528:web:07db9745e13f30df8c7d4d",
    measurementId: "G-MGZVQPCDVE"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Elements
const resetPasswordBtn = document.getElementById("resetPasswordBtn");
const resetEmail = document.getElementById("resetEmail");
const resetMessage = document.getElementById("resetMessage");

// Password Reset Function
resetPasswordBtn.addEventListener("click", () => {
    const email = resetEmail.value;

    if (!email) {
        resetMessage.textContent = "Please enter your email.";
        return;
    }

    sendPasswordResetEmail(auth, email)
        .then(() => {
            resetMessage.textContent = "Reset link sent! Check your email.";
            resetMessage.style.color = "green";
        })
        .catch((error) => {
            resetMessage.textContent = error.message;
            resetMessage.style.color = "red";
        });
});
