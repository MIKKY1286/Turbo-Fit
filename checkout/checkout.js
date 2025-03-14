// ======= TOGGLE NAVIGATION MENU =======
const menuIcon = document.getElementById('menu-icon');
const navLinks = document.getElementById('nav-links');

menuIcon.addEventListener('click', () => {
    navLinks.classList.toggle('show');
});

// ======= FIREBASE SETUP =======
import { 
    getFirestore, collection, getDocs, doc, updateDoc, deleteDoc 
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {  
    getAuth, onAuthStateChanged, signOut 
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

// Select Elements
const loginSignup = document.getElementById("loginSignup");
const logoutBtn = document.getElementById("logoutBtn");
const cartCount = document.getElementById("cart-count"); // Cart count badge
const cartItems = document.getElementById("cart-items");
const checkoutBtn = document.getElementById("checkout-btn");
const totalPrice = document.getElementById("total-price");

// Function to Update Cart Count
async function updateCartCount() {
    try {
        const user = auth.currentUser;
        if (!user || !cartCount) return;

        const cartRef = collection(db, "users", user.uid, "cart");
        const querySnapshot = await getDocs(cartRef);

        let count = 0;
        querySnapshot.forEach(docSnap => {
            let product = docSnap.data();
            count += product.quantity || 1; // Count total items in cart
        });

        cartCount.textContent = count;
    } catch (error) {
        console.error("Error updating cart count:", error);
    }
}

// Handle Authentication State
document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log("User is logged in:", user);
            if (loginSignup) loginSignup.style.display = "none";
            if (logoutBtn) logoutBtn.style.display = "block";

            await updateCartCount(); // Update cart count when user logs in
            await fetchCart(); // Fetch cart only when user is logged in
        } else {
            console.log("User is logged out");
            if (loginSignup) loginSignup.style.display = "block";
            if (logoutBtn) logoutBtn.style.display = "none";

            if (cartCount) cartCount.textContent = "0";
            if (cartItems) cartItems.innerHTML = `<p class="empty-cart">Your cart is empty 🛒</p>`;
            if (checkoutBtn) checkoutBtn.style.display = "none";
            if (totalPrice) totalPrice.innerText = "0.00";
        }
    });
});

// Logout Function
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await signOut(auth);
            console.log("User logged out");
            Swal.fire({
                icon: "success",
                title: "Logged Out",
                text: "You have successfully logged out!",
                timer: 2000,
                showConfirmButton: false
            });
            setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Logout Failed",
                text: error.message,
            });
        }
    });
}

// ✅ Fetch Cart Data for Logged-in User
async function fetchCart() {
    const user = auth.currentUser;
    if (!user || !cartItems) return;

    try {
        const userCartRef = collection(db, "users", user.uid, "cart");
        const querySnapshot = await getDocs(userCartRef);

        let total = 0;
        let cartHTML = "";

        if (querySnapshot.empty) {
            cartItems.innerHTML = `<p class="empty-cart">Your cart is empty 🛒</p>`;
            if (checkoutBtn) checkoutBtn.style.display = "none";
            if (totalPrice) totalPrice.innerText = "0.00";
            return;
        } else {
            checkoutBtn.style.display = "block";
        }

        querySnapshot.forEach((docSnap) => {
            let product = docSnap.data();
            let productId = docSnap.id;
            let price = parseFloat(product.price) || 0;  
            let quantity = product.quantity || 1;
            let subtotal = price * quantity; 
            let imageUrl = product.image || "https://via.placeholder.com/150";

            cartHTML += `
                <div class="cart-item">
                    <img src="${imageUrl}" alt="${product.name || 'No Name'}">
                    <div class="item-details">
                        <p class="item-name">${product.name || 'No Name'}</p>
                        <p class="item-price">$${price.toFixed(2)}</p>
                        <p class="item-subtotal">Subtotal: $${subtotal.toFixed(2)}</p>
                    </div>
                </div>
            `;

            total += subtotal;
        });

        cartItems.innerHTML = cartHTML;
        totalPrice.innerText = total.toFixed(2);
    } catch (error) {
        console.error("Error fetching cart:", error);
    }
}

// ✅ Proceed to Payment
checkoutBtn.addEventListener("click", function () {
    let paymentMethod = document.getElementById("payment-method").value;
    let orderTotal = totalPrice.innerText;

    if (!paymentMethod) {
        Swal.fire({
            icon: "warning",
            title: "Payment Method",
            text: "Please select a payment method!",
        });
        return;
    }

    document.getElementById("selected-method").innerText = paymentMethod;
    document.getElementById("final-amount").innerText = `$${orderTotal}`;
    document.getElementById("payment-card").classList.add("show");
});

// ✅ Confirm Payment and Clear Cart
document.getElementById("confirm-payment").addEventListener("click", async function () {
    try {
        const user = auth.currentUser;
        if (!user) return;

        const cartRef = collection(db, "users", user.uid, "cart");
        const querySnapshot = await getDocs(cartRef);

        querySnapshot.forEach(async (docSnap) => {
            await deleteDoc(doc(db, "users", user.uid, "cart", docSnap.id));
        });

        Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            text: "Your order has been placed successfully 🎉",
            timer: 3000,
            showConfirmButton: false
        });

        setTimeout(() => {
            document.getElementById("payment-card").classList.remove("show");
            window.location.href = "../index.html"; 
        }, 3000);
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to clear cart after payment. Please contact support.",
        });
        console.error("Error clearing cart:", error);
    }
});

// Load Cart on Page Load
document.addEventListener("DOMContentLoaded", fetchCart);
