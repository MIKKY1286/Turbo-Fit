import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    updatePassword 
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc, 
    collection, 
    query, 
    where, 
    getDocs 
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";



// 🔥 Firebase Config (Replace with your actual Firebase project credentials)
const firebaseConfig = {
    apiKey: "AIzaSyAt8l4aBhsjfigqhPupfC6Y6eE2Nyh-pGI",
    authDomain: "snaporia-207ae.firebaseapp.com",
    projectId: "snaporia-207ae",
    storageBucket: "snaporia-207ae.firebasestorage.app",
    messagingSenderId: "676150553528",
    appId: "1:676150553528:web:5d6b1063aaca60c28c7d4d",
    measurementId: "G-NVP2L3EX8P"
  };

// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Monitor Auth State
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is logged in:", user.email);
    } else {
        console.log("No user is logged in.");
    }
});

// 🔹 Sign Up New User & Store Data in Firestore
const registerUser = async (email, password, fullName) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: email,
            fullName: fullName,
            createdAt: new Date()
        });

        console.log("User registered & data saved:", fullName);
    } catch (error) {
        console.error("Error registering user:", error.message);
    }
};

// 🔹 Sign In User
const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in:", userCredential.user.email);
    } catch (error) {
        console.error("Login failed:", error.message);
    }
};

// 🔹 Sign Out User
const logoutUser = async () => {
    try {
        await signOut(auth);
        console.log("User signed out successfully.");
    } catch (error) {
        console.error("Error signing out:", error.message);
    }
};

// 🔹 Update User Password
const updateUserPassword = async (newPassword) => {
    try {
        const user = auth.currentUser;
        if (user) {
            await updatePassword(user, newPassword);
            console.log("Password updated successfully.");
        } else {
            console.log("No authenticated user found.");
        }
    } catch (error) {
        console.error("Error updating password:", error.message);
    }
};

// 🔹 Fetch User Data from Firestore
const getUserData = async (userId) => {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            console.log("User Data:", userSnap.data());
            return userSnap.data();
        } else {
            console.log("No user found!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user data:", error.message);
    }
};

// 🔹 Search Users by Email
const searchUserByEmail = async (email) => {
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                console.log("User Found:", doc.data());
            });
        } else {
            console.log("No user found with this email.");
        }
    } catch (error) {
        console.error("Error searching for user:", error.message);
    }
};

// 🔹 Example Usage
// registerUser("test@example.com", "password123", "John Doe");
// loginUser("test@example.com", "password123");
// logoutUser();
// updateUserPassword("newSecurePassword123");
// getUserData("user_id_here");
// searchUserByEmail("test@example.com");

export { auth, db, registerUser, loginUser, logoutUser, updateUserPassword, getUserData, searchUserByEmail };
