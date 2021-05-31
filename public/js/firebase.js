const firebaseConfig = {
  apiKey: "AIzaSyBOR1VM10Npb54A2KnPsNymLwAvPQmiL5o",
  authDomain: "lets-fazy.firebaseapp.com",
  databaseURL:
    "https://lets-fazy-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lets-fazy",
  storageBucket: "lets-fazy.appspot.com",
  messagingSenderId: "568013195041",
  appId: "1:568013195041:web:849ae97f758acee3b72060",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();
