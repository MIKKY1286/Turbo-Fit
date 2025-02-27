// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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
// Initialize Auth
const auth = getAuth();

// Add an event listener to the sign-in form to trigger the sign-in process when submitted
signInForm.addEventListener("submit", signInUser);

// Add an event listener to the sign-out button to trigger the sign-out process when clicked
signOutBtn.addEventListener("click", signOutUser);

// Define an asynchronous function to handle user sign-out
async function signOutUser() {
    try {
        await signOut(auth);  // Attempt to sign out the user from Firebase authentication
        alert("Sign out successful"); // Show a success message when sign-out is successful
    } catch (error) {
        console.log(error); // Log any errors that occur during sign-out
    }
}

// Define an asynchronous function to handle user sign-in
async function signInUser(e) {
    e.preventDefault();  // Prevent the default form submission behavior

    try {
        const { email, password } = signInForm; // Destructure the values from the sign-in form (email and password)

        // Create a user object with email and password from the form
        let user = {
            email: email.value,  // Get the user's email
            password: password.value,  // Get the user's password
        }
        await signInWithEmailAndPassword(auth, user.email, user.password); // Attempt to sign in the user with the provided email and password
        alert("Sign In successful"); // Display a success message when sign-in is successful
        
        // Redirect to the landing page after successful sign-in
        window.location.href = "../test.html"; // Change this URL to your actual landing page URL
    } catch (error) {
        // Log any errors that occur during sign-in
        console.log(error.message);

        // Handle specific Firebase error messages and display appropriate error messages to the user
        if (error.message === "Firebase: Error (auth/invalid-credential).") {
            // Display an error message if the email/password is invalid
            errorP.textContent = "Invalid email/password.";
        }
    }
}

// Monitor authentication state changes (sign-in or sign-out) in real-time
onAuthStateChanged(auth, (user) => {
    if (user) {
        // If a user is signed in, log their user information
        console.log(user);
    } else {
        // If no user is signed in, log a message indicating the user is not signed in
        console.log("No one is currently signed in.");
    }
});
