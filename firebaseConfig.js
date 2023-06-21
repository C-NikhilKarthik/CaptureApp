import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'
// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBxZG2K7uNkY9M6_UYb8JpevZ6E4dk7rig",
  authDomain: "captureapp-513f4.firebaseapp.com",
  projectId: "captureapp-513f4",
  storageBucket: "captureapp-513f4.appspot.com",
  messagingSenderId: "671376014435",
  appId: "1:671376014435:web:4f03a57c7d873210568c56",
  measurementId: "G-1B4K6DL75Y"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

export {firebase}
// export const FIREBASE_APP = initializeApp(firebaseConfig);
// export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
// export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
