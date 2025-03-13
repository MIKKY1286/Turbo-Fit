// ======= TOGGLE NAVIGATION MENU =======
const menuIcon = document.getElementById('menu-icon');
const navLinks = document.getElementById('nav-links');

menuIcon.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});


// Firebase Modular Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { 
    getAuth, onAuthStateChanged, signOut, updatePassword, updateProfile 
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { 
    getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs 
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { 
    getStorage, ref, uploadBytes, getDownloadURL 
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js";

// Firebase Configuration
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
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Select Elements
const loginSignup = document.getElementById("loginSignup");
const logoutBtn = document.getElementById("logoutBtn");
const cartCount = document.getElementById("cart-count");
const profilePicInput = document.getElementById("profile-pic-input");

// Function to Update Cart Count
async function updateCartCount() {
    const user = auth.currentUser;
    if (!user) return;

    try {
        const cartRef = doc(db, "carts", user.uid);
        const cartSnap = await getDoc(cartRef);

        if (cartSnap.exists()) {
            const cartData = cartSnap.data();
            const itemCount = cartData.items ? cartData.items.length : 0;
            if (cartCount) cartCount.textContent = itemCount;
        } else {
            if (cartCount) cartCount.textContent = "0";
        }
    } catch (error) {
        console.error("Error fetching cart count:", error);
    }
}

// Check Auth State
onAuthStateChanged(auth, async (user) => {
    if (user) {
        document.getElementById("user-name").textContent = user.displayName || "No Name";
        document.getElementById("user-email").textContent = user.email;
        document.getElementById("profile-pic").src = user.photoURL || "default-avatar.png";
        await updateCartCount();
    } else {
        window.location.href = "../signin page/signin.html"; // Redirect to signin page
    }
});

// Handle Authentication State
document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            if (loginSignup) loginSignup.style.display = "none";
            if (logoutBtn) logoutBtn.style.display = "block";
            await updateCartCount();
        } else {
            if (loginSignup) loginSignup.style.display = "block";
            if (logoutBtn) logoutBtn.style.display = "none";
            if (cartCount) cartCount.textContent = "0";
        }
    });
});

// Logout Function
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await signOut(auth);
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

// Function to Update Profile Picture
window.uploadProfilePicture = async () => {
    const user = auth.currentUser;
    if (!user) return alert("You need to log in first.");

    if (!profilePicInput.files.length) return alert("Please select a file.");

    const file = profilePicInput.files[0];
    const storageRef = ref(storage, `profile_pictures/${user.uid}`);

    try {
        // Upload file to Firebase Storage
        await uploadBytes(storageRef, file);

        // Get the download URL
        const photoURL = await getDownloadURL(storageRef);

        // Update profile in Firebase Auth
        await updateProfile(user, { photoURL });

        // Update profile picture in Firestore
        await setDoc(doc(db, "users", user.uid), { photoURL }, { merge: true });

        // Update the profile picture on the UI
        document.getElementById("profile-pic").src = photoURL;
        Swal.fire({
            icon: "success",
            title: "Profile Updated Sucessfully!",
            text: "Your profile has been updated successfully 🎉",
            timer: 3000,
            showConfirmButton: false
        });
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        alert("Failed to upload profile picture. Try again.");
    }
};

// Function to Show Sections
window.showSection = async (section) => {
    const content = document.getElementById("main-content");
    if (section === "account-info") {
        content.innerHTML = `
            <h2>Account Info</h2>
            <input type="text" id="name" placeholder="Full Name">
            <input type="email" id="email" placeholder="Email" disabled>
            <input type="text" id="phone" placeholder="Phone Number">
            <button onclick="saveAccountInfo()">Save</button>
        `;
        loadAccountInfo();
    } else if (section === "orders") {
        content.innerHTML = `<h2>My Orders</h2><div id="orders-list">Loading...</div>`;
        loadOrders();
    } else if (section === "address") {
        content.innerHTML = `
            <h2>Edit Address</h2>
            <input type="text" id="address-line1" placeholder="Address Line 1">
            <input type="text" id="address-line2" placeholder="Address Line 2">
            <input type="text" id="city" placeholder="City">
            <input type="text" id="state" placeholder="State">
            <input type="text" id="zip" placeholder="ZIP Code">
            <button onclick="saveAddress()">Save Address</button>
        `;
        loadAddress();
    } else if (section === "change-password") {
        content.innerHTML = `
            <h2>Change Password</h2>
            <input type="password" id="new-password" placeholder="New Password">
            <button onclick="changePassword()">Update Password</button>
        `;
    }
};

// Load Account Info
async function loadAccountInfo() {
    const user = auth.currentUser;
    if (user) {
        document.getElementById("email").value = user.email;
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            document.getElementById("name").value = userDoc.data().name || "";
            document.getElementById("phone").value = userDoc.data().phone || "";
        }
    }
}

// Save Account Info
window.saveAccountInfo = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await setDoc(doc(db, "users", user.uid), {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value
    }, { merge: true });

    Swal.fire({
        icon: "success",
        title: "Account info Updated!",
        text: "Your account info has been updated successfully 🎉",
        timer: 3000,
        showConfirmButton: false
    });
};

// Function to Save Address
window.saveAddress = async () => {
    const user = auth.currentUser;
    if (!user) return Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "You need to log in first to perform this action!",
        showCancelButton: true,
        confirmButtonText: "Log In",
        cancelButtonText: "Cancel",
    })
    const addressData = {
        addressLine1: document.getElementById("address-line1").value,
        addressLine2: document.getElementById("address-line2").value,
        city: document.getElementById("city").value,
        state: document.getElementById("state").value,
        zip: document.getElementById("zip").value
    };

    await setDoc(doc(db, "users", user.uid), { address: addressData }, { merge: true });
    Swal.fire({
        icon: "success",
        title: "Address Updated Successfully!",
        text: "Your address has been updated successfully 🎉",
        timer: 3000,
        showConfirmButton: false
    });
};

// Change Password
window.changePassword = async () => {
    const newPassword = document.getElementById("new-password").value;
    const user = auth.currentUser;
    if (user) {
        await updatePassword(user, newPassword);
        Swal.fire({
            icon: "success",
            title: "Password Updated Successfully!",
            text: "Your password has been updated successfully 🎉",
            timer: 3000,
            showConfirmButton: false
        });
    }
};
