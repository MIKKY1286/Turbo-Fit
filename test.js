// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
// import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";
import {onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";



// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBVKqGOI0EwuIVN5gp07w78y4VKsplEoO8",
    authDomain: "e-commerce-project-641ff.firebaseapp.com",
    projectId: "e-commerce-project-641ff",
    storageBucket: "e-commerce-project-641ff.firebasestorage.app",
    messagingSenderId: "608023216536",
    appId: "1:608023216536:web:40471428517d8cc883abed"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is logged in
            console.log("User is logged in:", user);
            if (loginSignup) loginSignup.style.display = "none";
            if (logoutBtn) logoutBtn.style.display = "block";
        } else {
            // User is logged out
            console.log("User is logged out");
            if (loginSignup) loginSignup.style.display = "block";
            if (logoutBtn) logoutBtn.style.display = "none";
        }
    });
});


const loginSignup = document.getElementById("loginSignup");
const logoutBtn = document.getElementById("logoutBtn");

if (!loginSignup || !logoutBtn) {
    console.error("Login or Logout button not found!");
}


setTimeout(() => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            loginSignup.style.display = "none";
            logoutBtn.style.display = "block";
        } else {
            loginSignup.style.display = "block";
            logoutBtn.style.display = "none";
        }
    });
}, 1000);




logoutBtn.addEventListener("click", async () => {
    try {
        await signOut(auth);
        console.log("User logged out");
        alert("You have logged out.");
        window.location.reload(); // Reload to reflect changes
    } catch (error) {
        console.error("Logout error:", error.message);
    }
});


// ========== USER AUTHENTICATION ==========
// Sign Up Function
document.querySelector("#signup-btn").addEventListener("click", async () => {
    let email = document.querySelector("#signup-email").value;
    let password = document.querySelector("#signup-password").value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User signed up:", userCredential.user);
        alert("Signup successful! Please log in.");
    } catch (error) {
        console.error("Signup error:", error.message);
        alert(error.message);
    }
});

// Login Function
document.querySelector("#login-btn").addEventListener("click", async () => {
    let email = document.querySelector("#login-email").value;
    let password = document.querySelector("#login-password").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in:", userCredential.user);
        alert("Login successful!");
    } catch (error) {
        console.error("Login error:", error.message);
        alert(error.message);
    }
});

// Logout Function
document.querySelector("#logout-btn").addEventListener("click", async () => {
    try {
        await signOut(auth);
        console.log("User logged out");
        alert("You have logged out.");
    } catch (error) {
        console.error("Logout error:", error.message);
    }
});



// ======= ADD PRODUCT TO FIRESTORE =======

   // Function to Add Product to Firestore
   async function addToCart(product) {
    try {
        await addDoc(collection(db, "cart"), product);
        console.log("Goods saved successfully!");
    } catch (error) {
        console.error("Error saving goods:", error);
    }
}

// Event Listener for "Add to Cart" Buttons
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            const product = {
                id: this.dataset.id,
                name: this.dataset.name,
                price: parseFloat(this.dataset.price),
                timestamp: new Date()
            };
            addToCart(product);
        });
    });
});

// ======= TOGGLE NAVIGATION MENU =======
function toggleMenu() {
    document.querySelector('.nav-links').classList.toggle('active');
}

// ======= NEWSLETTER SIGNUP =======
document.addEventListener("DOMContentLoaded", () => {
    const newsletterForm = document.getElementById("newsletter-form");
    if (newsletterForm) {
        newsletterForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const emailInput = document.getElementById("email-input");
            const errorMessage = document.getElementById("email-error");
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (emailInput && errorMessage) {
                if (!emailPattern.test(emailInput.value)) {
                    errorMessage.textContent = "Please enter a valid email address.";
                    errorMessage.style.display = "block";
                } else {
                    errorMessage.style.display = "none";
                    alert("Thank you for subscribing!");
                    emailInput.value = "";
                }
            }
        });
    }
});
 // ======= CART FUNCTIONS =======