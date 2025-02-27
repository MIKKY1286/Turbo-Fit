// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase configuration
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

// DOM Elements
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("eMail");
const phoneInput = document.getElementById("phone");
const websiteInput = document.getElementById("website");
const streetInput = document.getElementById("Street");
const cityInput = document.getElementById("ciTy");
const stateInput = document.getElementById("sTate");
const zipInput = document.getElementById("zIp");
const updateButton = document.getElementById("update");
const cancelButton = document.getElementById("cancel");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileImage = document.getElementById("profileImage");
const profileDropdown = document.getElementById("profileDropdown");
const logoutButton = document.getElementById("logoutButton");

// Toggle Profile Dropdown
profileImage.addEventListener("click", () => {
    profileDropdown.classList.toggle("show");
});

// Close dropdown when clicking outside
document.addEventListener("click", (event) => {
    if (!profileImage.contains(event.target) && !profileDropdown.contains(event.target)) {
        profileDropdown.classList.remove("show");
    }
});

// Log Out Function
logoutButton.addEventListener("click", async () => {
    try {
        await signOut(auth);
        Swal.fire({
            icon: "success",
            title: "Logged Out",
            text: "You have been logged out successfully.",
        }).then(() => {
            window.location.href = "../index.html"; // Redirect to login page
        });
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong while logging out.",
        });
        console.error("Error logging out:", error);
    }
});

// Load user data
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Populate the email field with the authenticated user's email
        emailInput.value = user.email;

        // Fetch additional user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            fullNameInput.value = userData.fullName || "";
            phoneInput.value = userData.phone || "";
            websiteInput.value = userData.website || "";
            streetInput.value = userData.street || "";
            cityInput.value = userData.city || "";
            stateInput.value = userData.state || "";
            zipInput.value = userData.zip || "";

            // Update profile section
            profileName.textContent = userData.fullName || "User Name";
            profileEmail.textContent = user.email;
        } else {
            console.error("User document does not exist.");
        }
    } else {
        window.location.href = "../index.html"; // Redirect to login page if not authenticated
    }
});

// Update profile
updateButton.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "You must be logged in to update your profile.",
        });
        return;
    }

    // Validate required fields
    if (!fullNameInput.value.trim() || !phoneInput.value.trim()) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please fill out all required fields.",
        });
        return;
    }

    const userData = {
        fullName: fullNameInput.value.trim(),
        phone: phoneInput.value.trim(),
        website: websiteInput.value.trim(),
        street: streetInput.value.trim(),
        city: cityInput.value.trim(),
        state: stateInput.value.trim(),
        zip: zipInput.value.trim(),
    };

    try {
        await updateDoc(doc(db, "users", user.uid), userData);
        Swal.fire({
            icon: "success",
            title: "Profile Updated",
            text: "Your profile has been updated successfully!",
        });
        profileName.textContent = userData.fullName;
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong while updating your profile.",
        });
        console.error("Error updating profile:", error);
    }
});

// Cancel button
cancelButton.addEventListener("click", () => {
    window.location.href = "../index.html"; // Redirect to profile page
});