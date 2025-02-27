// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js";

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
const storage = getStorage(app);


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


// DOM Elements
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profilePhone = document.getElementById("profilePhone");
const profileWebsite = document.getElementById("profileWebsite");
const profileAddress = document.getElementById("profileAddress");
const profilePictureDisplay = document.getElementById("profilePictureDisplay");
const profilePictureUpload = document.getElementById("profilePictureUpload");
const uploadButton = document.getElementById("uploadButton");
const profileImage = document.getElementById("profileImage");
const profileDropdown = document.getElementById("profileDropdown");
const logoutButton = document.getElementById("logoutButton");

// Toggle Profile Dropdown
profileImage.addEventListener("click", () => {
    profileDropdown.style.display = profileDropdown.style.display === "block" ? "none" : "block";
});

// Close dropdown when clicking outside
document.addEventListener("click", (event) => {
    if (!profileImage.contains(event.target) && !profileDropdown.contains(event.target)) {
        profileDropdown.style.display = "none";
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
            window.location.href = "./index.html"; // Redirect to login page
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
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();

            // Update profile section
            profileName.textContent = userData.fullName || "User Name";
            profileEmail.textContent = user.email;
            profilePhone.textContent = userData.phone || "Not provided";
            profileWebsite.textContent = userData.website || "Not provided";
            profileAddress.textContent = userData.street ? `${userData.street}, ${userData.city}, ${userData.state}, ${userData.zip}` : "Not provided";

            // Load profile picture
            if (userData.profilePicture) {
                profilePictureDisplay.src = userData.profilePicture;
                profileImage.querySelector("img").src = userData.profilePicture;
            }
        }
    } else {
        window.location.href = "../signin page/signin.html"; // Redirect to login page if not authenticated
    }
});

// Upload Profile Picture
uploadButton.addEventListener("click", () => {
    profilePictureUpload.click();
});

profilePictureUpload.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
        const user = auth.currentUser;
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        // Update Firestore with the new profile picture URL
        await updateDoc(doc(db, "users", user.uid), {
            profilePicture: downloadURL,
        });

        // Update the displayed profile picture
        profilePictureDisplay.src = downloadURL;
        profileImage.querySelector("img").src = downloadURL;

        Swal.fire({
            icon: "success",
            title: "Profile Picture Updated",
            text: "Your profile picture has been updated successfully!",
        });
    }
});