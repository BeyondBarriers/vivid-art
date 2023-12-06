import Image from 'next/image'
import styles from '../styles/Auth.module.css'
import { onlyLetters } from '../components/Utilities'
import { Right } from '../components/AuthLayout'
import { useRouter } from 'next/router'
import { database, auth } from '../configFirebase'
import { doc, getDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth'

async function createUserWithEmail(router) {
    var firstName = document.getElementById('First name').value
    var lastName = document.getElementById('Last name').value
    var email = document.getElementById('Email').value
    var password = document.getElementById('Password').value
    var error = document.getElementById('error')
    try {
        if (firstName == '' || lastName == '') {
            error.style.display = 'block'
            error.innerText = 'Missing first or last name.'
        } else if (!onlyLetters(firstName) || !onlyLetters(lastName)) {
            error.style.display = 'block'
            error.innerText = 'Name must contain only letters.'
        } else {
            error.style.display = 'none'
            const result = await createUserWithEmailAndPassword(auth, email, password)
            const user = result.user
            updateProfile(user, {
                displayName: firstName + ' ' + lastName
            })
            router.push('/setup')
        }
    } catch (e) {
        error.style.display = 'block'
        if (email == '' || password == '' || e.code == 'auth/missing-email' || e.code == 'auth/missing-password') {
            error.innerText = 'Missing email or password.'
        } else if (e.code == 'auth/email-already-in-use') {
            error.innerText = 'This email is already in use.'
        } else if (e.code == 'auth/invalid-email') {
            error.innerText = 'This email is invalid.'
        } else if (e.code == 'auth/weak-password') {
            error.innerText = 'Password must be at least 6 characters.'
        } else {
            error.innerText = 'An error has occurred.'
        }
    }
}

function Submit() {
    const router = useRouter()
    return (
        <div>
            <input 
                type='submit'
                value='Sign up'
                className={styles.input}
                onClick={() => createUserWithEmail(router)}
                style={{backgroundColor: '#F1C400', justifyContent: 'center', alignItems: 'center'}}
            />
            <div className={styles.shadow}></div>
        </div>
    )
}

async function createUserWithGoogle(router) {
    const googleProvider = new GoogleAuthProvider()
    var error = document.getElementById('error')
    signInWithPopup(auth, googleProvider).then(async (result) => {
        error.style.display = 'none'
        const uid = result.user.uid
        const userRef = doc(database, 'users', uid)
        const userSnap = await getDoc(userRef)
        if (!userSnap.exists()) {
            router.push('/setup')
        } else {
            router.push({
                pathname: '/[dashboard]/home',
                query: {dashboard: uid}
            })
        }
    }).catch((e) => {
        error.style.display = 'block'
        error.innerText = 'Unable to sign in with Google.'
    })
}

export function GoogleProvider() {
    const router = useRouter()
    return (
        <div>
            <button
                style={{backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center'}}
                className={styles.input}
                onClick={() => createUserWithGoogle(router)}>
                <Image
                    width={20}
                    height={20}
                    src='/icons/google.svg'
                    alt='google'
                    style={{marginRight: '10px', marginLeft: '-5px', paddingBottom: '2px'}}
                />
                Sign in with Google
            </button>
            <div className={styles.shadow}></div>
        </div>
    )
}

export function Input({ placeholder }) {
    return (
        <div>
            <input 
                type='text'
                placeholder={placeholder}
                id={placeholder}
                className={styles.input}
            />
            <div className={styles.shadow}></div>
        </div>
    )
}

function Form() {
    const router = useRouter()
    return (
        <form className={styles.form} style={{borderLeft: '4px solid #000000', right: '0px'}} 
            onSubmit={(e) => e.preventDefault()}>
            <div>
                <p className={styles.header}>Sign up</p>
                <div className={styles.double}>
                    <Input placeholder='First name'/>
                    <Input placeholder='Last name'/>
                </div>
                <Input placeholder='Email'/>
                <Input placeholder='Password'/>
            </div>
            <p className={styles.error} id='error' style={{display: 'none'}}>
                This email is already in use.
            </p>
            <div>
                <Submit/>
                <GoogleProvider/>
            </div>
            <p className={styles.text}
                style={{textAlign: 'center'}}
                onClick={() => router.push('/login')}>
                Already have an account? <u className={styles.u}>Log in</u>
            </p>
        </form>
    )
}

function Signup() {
    return (
        <Right>
            <Form/>
        </Right>
    )
}

export default Signup