import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: 'AIzaSyBNFB3Do02iHg4oA7LVU9VtfH4HsMM5YPs',
//   authDomain: 'test-XXXX.firebaseapp.com',
//   databaseURL: 'https://test-db.firebaseio.com',
  projectId: 'vachan-go',
  storageBucket: 'vachan-go.appspot.com',
  appId: "1:486797934259:android:272804dd9f18b7c166fac6"
};


firebase.initializeApp(firebaseConfig);