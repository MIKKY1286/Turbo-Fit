// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, updateDoc  } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBVKqGOI0EwuIVN5gp07w78y4VKsplEoO8",
    authDomain: "e-commerce-project-641ff.firebaseapp.com",
    projectId: "e-commerce-project-641ff",
    storageBucket: "e-commerce-project-641ff.appspot.com", // Corrected storage bucket
    messagingSenderId: "608023216536",
    appId: "1:608023216536:web:40471428517d8cc883abed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Select Elements
const loginSignup = document.getElementById("loginSignup");
const logoutBtn = document.getElementById("logoutBtn");

// Handle Authentication State
document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is logged in:", user);
            if (loginSignup) loginSignup.style.display = "none";
            if (logoutBtn) logoutBtn.style.display = "block";
        } else {
            console.log("User is logged out");
            if (loginSignup) loginSignup.style.display = "block";
            if (logoutBtn) logoutBtn.style.display = "none";
        }
    });
});

// Logout Function
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await signOut(auth);
            console.log("User logged out");
            alert("You have logged out.");
            window.location.reload();
        } catch (error) {
            console.error("Logout error:", error.message);
        }
    });
}


// ======= ADD PRODUCT TO FIRESTORE =======
async function addToCart(product) {
    try {
        const cartRef = collection(db, "cart");

        // Check if the item already exists in Firestore
        const q = query(cartRef, where("id", "==", product.id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // If the product exists, update the quantity
            const docRef = querySnapshot.docs[0].ref;
            const existingData = querySnapshot.docs[0].data();
            await updateDoc(docRef, {
                quantity: existingData.quantity + product.quantity
            });
            console.log("Goods quantity updated successfully!");
        } else {
            // If the product doesn't exist, add it to Firestore
            await addDoc(cartRef, product);
            console.log("Goods saved successfully!");
        }
    } catch (error) {
        console.error("Error saving goods:", error);
    }
}

// Event Listener for "Add to Cart" Buttons
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            const quantity = parseInt(this.dataset.quantity) || 1; // Default to 1 if not provided
            const product = {
                id: this.dataset.id,
                name: this.dataset.name,
                price: parseFloat(this.dataset.price),
                quantity: quantity,
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
