//@flow

import firebase from 'firebase'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrq3TG-U0VQbdteIHgfNxA3Sa-QIQ-Sxo",
  authDomain: "drinkyland-22e88.firebaseapp.com",
  databaseURL: "https://drinkyland-22e88.firebaseio.com",
  projectId: "drinkyland-22e88",
  storageBucket: "drinkyland-22e88.appspot.com",
  messagingSenderId: "844746822305",
  appId: "1:844746822305:web:0261781f7b2b41802cd6e0",
  measurementId: "G-T6ZVB3LWMG"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;
