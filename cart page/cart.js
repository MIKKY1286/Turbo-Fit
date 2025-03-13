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
            window.location.reload();
        } catch (error) {
            console.error("Logout error:", error.message);
        }
    });
}


// Function to Update Cart Count
async function updateCartCount() {
    try {
        const cartRef = collection(db, "cart");
        const querySnapshot = await getDocs(cartRef);
        let itemCount = 0;

        querySnapshot.forEach(docSnap => {
            let product = docSnap.data();
            itemCount += product.quantity || 1; // Sum up the quantities of all items
        });

        if (cartCount) {
            cartCount.textContent = itemCount.toString();
        }
    } catch (error) {
        console.error("Error updating cart count:", error);
    }
}

// Fetch Cart Data
async function fetchCart() {
    try {
        const cartRef = collection(db, "cart");
        const querySnapshot = await getDocs(cartRef);

        const cartItems = document.getElementById("cart-items");
        cartItems.innerHTML = "";
        let total = 0;

        if (querySnapshot.empty) {
            cartItems.innerHTML = `<p class="empty-cart">Your cart is empty 🛒</p>`;
            document.getElementById("checkout-btn").style.display = "none";
            return;
        } else {
            document.getElementById("checkout-btn").style.display = "block";
        }

        querySnapshot.forEach(docSnap => {
            let product = docSnap.data();
            let productId = docSnap.id;

            let price = parseFloat(product.price) || 0;
            let quantity = product.quantity || 1;

            let imageUrl = product.image ? product.image : "https://via.placeholder.com/150";

            let itemDiv = document.createElement("div");
            itemDiv.classList.add("cart-item");
            itemDiv.innerHTML = `
                <img src="${imageUrl}" alt="${product.name || 'No Name'}">
                <div class="item-details">
                    <p class="item-name">${product.name || 'No Name'}</p>
                    <p class="item-price">$${price.toFixed(2)}</p>
                </div>
                <div class="quantity">
                    <button class="btn minus" onclick="updateQuantity('${productId}', ${quantity - 1})">-</button>
                    <span id="qty-${productId}">${quantity}</span>
                    <button class="btn plus" onclick="updateQuantity('${productId}', ${quantity + 1})">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart('${productId}')">🗑</button>
            `;

            cartItems.appendChild(itemDiv);
            total += price * quantity;
        });

        document.getElementById("total-price").innerText = total.toFixed(2);
    } catch (error) {
        console.error("Error fetching cart:", error);
        alert("Failed to load cart. Please try again.");
    }
}

// Update Quantity
async function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }

    try {
        const productRef = doc(db, "cart", productId);
        await updateDoc(productRef, { quantity: newQuantity });
        fetchCart();
        updateCartCount(); // Update cart count
    } catch (error) {
        console.error("Error updating quantity:", error);
    }
}

// Remove from Cart
async function removeFromCart(productId) {
    try {
        await deleteDoc(doc(db, "cart", productId));
        fetchCart();
        updateCartCount(); // Update cart count
    } catch (error) {
        console.error("Error removing item:", error);
    }
}

// Attach functions to window so they are globally accessible
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;

// Load Cart Data
document.addEventListener("DOMContentLoaded", fetchCart);


const checkoutBtn = document.getElementById("checkout-btn");
if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
        window.location.href = "../checkout/checkout.html";
    });
}


