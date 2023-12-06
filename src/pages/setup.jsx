import styles from '../styles/Auth.module.css'
import { Left } from '../components/AuthLayout'
import { database, auth } from '../configFirebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useState  } from 'react'

async function next(router) {
    const adminTrue = document.getElementById('Yes, I am.').style.backgroundColor
    const adminFalse = document.getElementById("No, I'm not.").style.backgroundColor
    const error = document.getElementById('error')
    if ((adminTrue == '#FFFFFF' || adminTrue == 'rgb(255, 255, 255)') && (adminFalse == '#FFFFFF' || adminFalse == 'rgb(255, 255, 255)')) {
        error.style.display = 'block'
    } else {
        error.style.display = 'none'
        var admin = adminFalse == '#FFFFFF' || adminFalse == 'rgb(255, 255, 255)'
        const uid = auth.currentUser.uid
        const userRef = doc(database, 'users', uid)
        await setDoc(userRef, {
            NAME: auth.currentUser.displayName,
            ADMIN: admin,
            FRIENDS: [],
            GROUPS: []
        })
        if (admin) {
            router.push('/setup/create-group')
        } else {
            router.push('/setup/join-group')
        }
    }
}

function Continue() {
    const router = useRouter()
    return (
        <div>
            <input 
                type='submit'
                value='Continue'
                className={styles.input}
                style={{backgroundColor: '#F1C400', justifyContent: 'center', alignItems: 'center'}}
                onClick={() => next(router)}
            />
            <div className={styles.shadow}></div>
        </div>
    )
}

function selectRole(event) {
    var button = event.currentTarget
    button.style.backgroundColor = '#F1C400'
    if (button.innerText == 'Yes, I am.') {
        document.getElementById("No, I'm not.").style.backgroundColor = '#FFFFFF'
    } else {
        document.getElementById('Yes, I am.').style.backgroundColor = '#FFFFFF'
    }
}

export function Button({ value }) {
    return (
        <div style={{width: '100%'}}>
            <button
                id={value}
                className={styles.input}
                style={{backgroundColor: '#FFFFFF', alignItems: 'center'}}
                onClick={(e) => selectRole(e)}>
                {value}
            </button>
            <div className={styles.shadow}></div>
        </div>
    )
}

function Form() {
    return (
        <form className={styles.form} style={{borderRight: '4px solid #000000', left: '0px'}} 
            onSubmit={(e) => e.preventDefault()}>
            <div>
                <p className={styles.header}>Set up</p>
                <p className={styles.text}
                    style={{marginTop: '40px', marginBottom: '15px'}}>
                    Are you an administrator?</p>
                <div className={styles.double}
                    style={{marginBottom: '20px'}}>
                    <Button value='Yes, I am.'/>
                    <Button value="No, I'm not."/>
                </div>
                <p className={styles.error} id='error' style={{display: 'none', marginTop: '-42px', marginBottom: '23px'}}>
                    Select a role to continue.
                </p>
                <Continue/>
            </div>
        </form>
    )
}

function Setup() {
    const [user, setUser] = useState(false)
    const router = useRouter()
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            router.push('/signup')
        } else {
            setUser(true)
        }
    })
    if (user) {
        return (
            <Left setup={true}>
                <Form/>
            </Left>
        )
    }
}

export default Setup