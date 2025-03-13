// Firebase Setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase Config (Replace with your own credentials)
const firebaseConfig = {
    apiKey: "AIzaSyAt8l4aBhsjfigqhPupfC6Y6eE2Nyh-pGI",
    authDomain: "snaporia-207ae.firebaseapp.com",
    projectId: "snaporia-207ae",
    storageBucket: "snaporia-207ae.appspot.com",
    messagingSenderId: "676150553528",
    appId: "1:676150553528:web:5d6b1063aaca60c28c7d4d",
    measurementId: "G-NVP2L3EX8P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
        console.error("Error fetching cart:", error);
        alert("Failed to load cart. Please try again later.");
    }
}

// Show Payment Card on Checkout
document.getElementById("checkout-btn").addEventListener("click", function () {
    let paymentMethod = document.getElementById("payment-method").value;
    let orderTotal = document.getElementById("order-total").innerText;

    if (!paymentMethod) {
        alert("Please select a payment method!");
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
    alert("Payment successful! 🎉");
    document.getElementById("payment-card").classList.remove("show");
    // Optionally, clear the cart or redirect to another page
});

// Load Cart on Page Load
document.addEventListener("DOMContentLoaded", fetchCart);
