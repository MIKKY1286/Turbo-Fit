// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore,collection,setDoc,doc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
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
// Initialize Firestore
const db = getFirestore(app);
// COllection Ref
const colRef = collection(db, "users")

// Define an asynchronous function to create a new user account
const createUserAccount = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const { name, email, password, confirmPassword } = signUpForm; // Destructure the values from the sign-up form

    // Create an object to hold the user's details from the form
    let userDetails = {
        name: name.value,           // Get the user's name
        email: email.value,         // Get the user's email
        password: password.value,   // Get the user's password
    }
    try {
        if (userDetails.password !== confirmPassword.value) { // Check if the password and confirm password match
            // If passwords don't match, throw an error
            throw new Error("Ensure password matches");
        }
        const userCred = await createUserWithEmailAndPassword(auth, userDetails.email, userDetails.password); // Attempt to create the user with the provided email and password
        const docRef = doc(colRef, userCred.user.uid); // Reference to the document in the Firestore collection for the new user
        const docSnap = await setDoc(docRef, { // Save user data (name and email) to the Firestore document
            name: userDetails.name,
            email: userDetails.email,
        });
        alert("Sign Up successful");  // Display a success message to the user

        // Optional: Redirect the user to the home page after a short delay (commented out)
        // setTimeout(() => {
        //     window.location.href = `./index.html`;
        // }, 2000);

    } catch (error) {
        console.log(error.message); // Log the error message if any exception is thrown

        // Handle specific Firebase error messages and display appropriate error messages to the user
        if (error.message === "Firebase: Password should be at least 6 characters (auth/weak-password).") {
            // Display a message if the password is too short
            errorP.textContent = "*Password should be at least 6 characters";
        }
        if (error.message === "Firebase: Error (auth/email-already-in-use).") {
            // Display a message if the email is already in use
            errorP.textContent = "Email already exists.";
        }
        if (error.message === 'Ensure password matches') {
            // Display a message if the passwords don't match
            errorP.textContent = "Ensure password matches";
        }
    }
}

// Event Listener(s)
signUpForm.addEventListener("submit", createUserAccount);

