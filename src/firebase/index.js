import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAum4k-JnHd_SmE01zZy3V_nt9HaTSuKco",
  authDomain: "beep-93d1c.firebaseapp.com",
  databaseURL: "https://beep-93d1c-default-rtdb.firebaseio.com",
  projectId: "beep-93d1c",
  storageBucket: "beep-93d1c.appspot.com",
  messagingSenderId: "48600591572",
  appId: "1:48600591572:web:f35e194d4d4f7d29bc5f41"
}

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const db = firebase.database()
const storage = firebase.storage()

export {
	auth, db, storage
}