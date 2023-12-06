import styles from '../styles/Auth.module.css'
import { Left } from '../components/AuthLayout'
import { GoogleProvider, Input } from '../pages/signup'
import { useRouter } from 'next/router'
import { auth } from '../configFirebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

async function getUserWithEmail(router) {
    var email = document.getElementById('Email').value
    var password = document.getElementById('Password').value
    var error = document.getElementById('error')
    try {
        error.style.display = 'none'
        const result = await signInWithEmailAndPassword(auth, email, password)
        const user = result.user
        router.push({
            pathname: '/[dashboard]/home',
            query: {dashboard: user.uid}
        })
    } catch (e) {
        error.style.display = 'block'
        if (email == '' || password == '' || e.code == 'auth/missing-email' || e.code == 'auth/missing-password') {
            error.innerText = 'Missing email or password.'
        } else if (e.code == 'auth/invalid-email') {
            error.innerText = 'This email is invalid.'
        } else if (e.code == 'auth/invalid-login-credentials') {
            error.innerText = 'Incorrect email or password.'
        } else if (e.code == 'auth/user-disabled') {
            error.innerText = 'This email has been deactivated.'
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
                value='Log in'
                className={styles.input}
                onClick={() => getUserWithEmail(router)}
                style={{backgroundColor: '#F1C400', justifyContent: 'center', alignItems: 'center'}}
            />
            <div className={styles.shadow}></div>
        </div>
    )
}

function Form() {
    const router = useRouter()
    return (
        <form className={styles.form} style={{borderRight: '4px solid #000000', left: '0px'}} 
            onSubmit={(e) => e.preventDefault()}>
            <div>
                <p className={styles.header}>Log in</p>
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
                onClick={() => router.push('/signup')}>
                Don't have an account? <u className={styles.u}>Sign up</u>
            </p>
        </form>
    )
}

function Login() {
    return (
        <Left setup={false}>
            <Form/>
        </Left>
    )
}

export default Login