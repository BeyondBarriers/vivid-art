import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyD3AWfZP2qTrerRHuYnFtzQFecpzLi-aWY",
    authDomain: "coloring-app-9697a.firebaseapp.com",
    projectId: "coloring-app-9697a",
    storageBucket: "coloring-app-9697a.appspot.com",
    messagingSenderId: "112992420128",
    appId: "1:112992420128:web:74678c10d111fa9771d745",
    measurementId: "G-CLGWVWJ6TT"
}

let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export var database = getFirestore(app)
export var storage = getStorage(app)
export var auth = getAuth(app)