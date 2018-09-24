import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';

// Initialize Firebase
const config = {
    apiKey: "AIzaSyCPylh3vAx0SN7PVn-5iqS--JHDYwqwDR0",
    authDomain: "babysitter-558e9.firebaseapp.com",
    databaseURL: "https://babysitter-558e9.firebaseio.com",
    projectId: "babysitter-558e9",
    storageBucket: "babysitter-558e9.appspot.com",
    messagingSenderId: "278593435972"
};
firebase.initializeApp(config);

const firestore = firebase.firestore();

firestore.settings({
    timestampsInSnapshots: true
});

export { firebase, firestore };
