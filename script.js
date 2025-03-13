// ======= TOGGLE NAVIGATION MENU =======
const menuIcon = document.getElementById('menu-icon');
const navLinks = document.getElementById('nav-links');

menuIcon.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});


// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { 
    getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
    onAuthStateChanged, signOut 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { 
    getFirestore, collection, addDoc, updateDoc, getDocs, query, where, doc 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAt8l4aBhsjfigqhPupfC6Y6eE2Nyh-pGI",
    authDomain: "snaporia-207ae.firebaseapp.com",
    projectId: "snaporia-207ae",
    storageBucket: "snaporia-207ae.firebasestorage.app",
    messagingSenderId: "676150553528",
    appId: "1:676150553528:web:5d6b1063aaca60c28c7d4d",
    measurementId: "G-NVP2L3EX8P"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Select Elements
const loginSignup = document.getElementById("loginSignup");
const logoutBtn = document.getElementById("logoutBtn");
const cartCount = document.getElementById("cart-count");

// Handle Authentication State
document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log("User is logged in:", user);
            if (loginSignup) loginSignup.style.display = "none";
            if (logoutBtn) logoutBtn.style.display = "block";
            await updateCartCount(); // Update cart count when user logs in
        } else {
            console.log("User is logged out");
            if (loginSignup) loginSignup.style.display = "block";
            if (logoutBtn) logoutBtn.style.display = "none";
            if (cartCount) cartCount.textContent = "0"; // Reset cart count on logout
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

// ======= ADD PRODUCT TO FIRESTORE & UPDATE CART COUNT =======
async function addToCart(product) {
    const user = auth.currentUser;

    if (!user) {
        Swal.fire({
            title: 'Error!',
            text: 'You have to log in to add to your cart',
            icon: 'error',
            confirmButtonText: 'Ok'
          })

        
        return;
    }

    try {
        const cartRef = collection(db, "cart");
        const q = query(cartRef, where("id", "==", product.id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            const existingData = querySnapshot.docs[0].data();
            await updateDoc(docRef, {
                quantity: existingData.quantity + product.quantity
            });
            console.log("Cart updated successfully!");
        } else {
            await addDoc(cartRef, product);
            console.log("Product added to cart!");
        }

        // Update cart count
        await updateCartCount();
    } catch (error) {
        console.error("Error updating cart:", error);
    }
}

// ======= UPDATE CART COUNT =======
async function updateCartCount() {
    const user = auth.currentUser;
    if (!user) return;

    try {
        const cartRef = collection(db, "cart");
        const querySnapshot = await getDocs(cartRef);
        let totalQuantity = 0;

        querySnapshot.forEach(doc => {
            totalQuantity += doc.data().quantity;
        });

        if (cartCount) cartCount.textContent = totalQuantity;
    } catch (error) {
        console.error("Error updating cart count:", error);
    }
}

// Event Listener for "Add to Cart" Buttons
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            const quantity = parseInt(this.dataset.quantity) || 1;
            const product = {
                id: this.dataset.id,
                name: this.dataset.name,
                image: this.dataset.image,
                price: this.dataset.price,
                quantity: quantity,
                timestamp: new Date()
            };
            console.log(product);
            
            addToCart(product);
        });
    });
});



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