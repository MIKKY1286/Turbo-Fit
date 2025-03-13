// ======= TOGGLE NAVIGATION MENU =======
const menuIcon = document.getElementById('menu-icon');
const navLinks = document.getElementById('nav-links');

menuIcon.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

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

// Function to Update Cart Count
async function updateCartCount() {
    try {
        const cartRef = collection(db, "cart");
        const querySnapshot = await getDocs(cartRef);

        let count = 0;
        querySnapshot.forEach(docSnap => {
            let product = docSnap.data();
            count += product.quantity || 1; // Count total items in cart
        });

        if (cartCount) {
            cartCount.textContent = count;
        }
    } catch (error) {
        console.error("Error updating cart count:", error);
    }
}

// Handle Authentication State
document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, async (user) => {
        const cartItems = document.getElementById("cart-items");
        const checkoutBtn = document.getElementById("checkout-btn");
        const totalPrice = document.getElementById("total-price");

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

            // Reset cart count
            if (cartCount) cartCount.textContent = "0";

            // Clear cart UI completely
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

// Function to Fetch and Display Cart Items
async function fetchCart() {
    try {
        const cartRef = collection(db, "cart");
        const querySnapshot = await getDocs(cartRef);

        const cartContainer = document.getElementById("cart-items");
        cartContainer.innerHTML = "";

        let subtotal = 0;
        let shippingFee = 5.00;

        if (querySnapshot.empty) {
            cartContainer.innerHTML = `<p class="empty-cart">Your cart is empty 🛒</p>`;
            document.getElementById("checkout-btn").style.display = "none";
            return;
        } 

        document.getElementById("checkout-btn").style.display = "block";

        querySnapshot.forEach(docSnap => {
            let product = docSnap.data();
            let price = parseFloat(product.price) || 0;
            let quantity = product.quantity || 1;

            subtotal += price * quantity;

            cartContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${product.image}" alt="${product.name}">
                    <p>${product.name} (x${quantity})</p>
                    <p>$${(price * quantity).toFixed(2)}</p>
                </div>
            `;
        });

        let orderTotal = subtotal + shippingFee;
        document.getElementById("subtotal-price").innerText = subtotal.toFixed(2);
        document.getElementById("shipping-fee").innerText = shippingFee.toFixed(2);
        document.getElementById("order-total").innerText = orderTotal.toFixed(2);
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to load cart. Please try again later.",
        });
    }
}

// Show Payment Card on Checkout
document.getElementById("checkout-btn").addEventListener("click", function () {
    let paymentMethod = document.getElementById("payment-method").value;
    let orderTotal = document.getElementById("order-total").innerText;

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

// Close Payment Card
document.getElementById("close-payment").addEventListener("click", function () {
    document.getElementById("payment-card").classList.remove("show");
});

// Confirm Payment
document.getElementById("confirm-payment").addEventListener("click", function () {
    Swal.fire({
        icon: "success",
        title: "Payment Successful!",
        text: "Your order has been placed successfully 🎉",
        timer: 3000,
        showConfirmButton: false
    });

    setTimeout(() => {
        document.getElementById("payment-card").classList.remove("show");
        // Optionally, clear the cart or redirect to another page
    }, 3000);
});

// Load Cart on Page Load
document.addEventListener("DOMContentLoaded", fetchCart);
