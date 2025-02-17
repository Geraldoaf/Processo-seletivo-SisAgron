import { getFirestore } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyBAspzoyGR6aiJlspU4vL6MZrb_se4YPn4',
  authDomain: 'processo-seletivo-sisagro.firebaseapp.com',
  projectId: 'processo-seletivo-sisagro',
  storageBucket: 'processo-seletivo-sisagro.firebasestorage.app',
  messagingSenderId: '455579223071',
  appId: '1:455579223071:web:8c03b9e2409497dfefc12a',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }
