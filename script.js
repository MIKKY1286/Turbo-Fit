function toggleMenu() {
    document.querySelector(".nav-links").classList.toggle("active");
}


const firebaseConfig = {
    apiKey: "AIzaSyBVKqGOI0EwuIVN5gp07w78y4VKsplEoO8",
    authDomain: "e-commerce-project-641ff.firebaseapp.com",
    projectId: "e-commerce-project-641ff",
    storageBucket: "e-commerce-project-641ff.firebasestorage.app",
    messagingSenderId: "608023216536",
    appId: "1:608023216536:web:40471428517d8cc883abed"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();










//  SECCOND NAVBAR

document.querySelector(".category-dropdown").addEventListener("change", function () {
    console.log("Selected Category:", this.value);
});



// ========= NAV & TAB SECTION ========== //

// Firebase Configuration


// Select Cart Elements
const cartCount = document.getElementById("cart-count");
const addToCartButtons = document.querySelectorAll(".add-to-cart");

// Cart Counter
let cartItems = [];

// Function to Add Product to Firestore
function addToFirestore(product) {
    db.collection("cart").add(product)
        .then(() => {
            console.log("Product added to Firestore:", product);
        })
        .catch(error => {
            console.error("Error adding product:", error);
        });
}

// Function to Handle Add to Cart
addToCartButtons.forEach(button => {
    button.addEventListener("click", function () {
        let productElement = this.parentElement;
        let product = {
            name: productElement.querySelector("h3").innerText,
            price: productElement.querySelector("h4").innerText.replace("$", ""),
            image: productElement.querySelector("img").src
        };

        // Add to Local Cart
        cartItems.push(product);
        cartCount.innerText = cartItems.length;

        // Store in Firestore
        addToFirestore(product);
    });
});

// Fetch and Display Cart Count from Firestore
db.collection("cart").get().then(snapshot => {
    cartItems = snapshot.docs.map(doc => doc.data());
    cartCount.innerText = cartItems.length;
});




//========== NEWSLETTER SECTION =========//

document.getElementById("newsletter-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const emailInput = document.getElementById("email-input");
    const errorMessage = document.getElementById("email-error");
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(emailInput.value)) {
        errorMessage.textContent = "Please enter a valid email address.";
        errorMessage.style.display = "block";
    } else {
        errorMessage.style.display = "none";
        alert("Thank you for subscribing!");
        emailInput.value = "";
    }
});
