import styles from '../../styles/Auth.module.css'
import { onlyNumbersAndLetters } from '../../components/Utilities'
import { Left } from '../../components/AuthLayout'
import { Input } from '../../pages/signup'
import { database, auth } from '../../configFirebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useState } from 'react'

async function next(router) {
    const error = document.getElementById('error')
    const name = document.getElementById('Group name').value
    const code = document.getElementById('Group code').value
    error.style.display = 'block'
    if (code == '') {
        error.innerText = 'Missing code.'
    } else if (name == '') {
        error.innerText = 'Missing name.'
    } else if (!onlyNumbersAndLetters(code)) {
        error.innerText = 'This code contains invalid characters.'
    } else {
        const uid = auth.currentUser.uid
        const groupRef = doc(database, 'groups', code)
        const groupSnap = await getDoc(groupRef)
        if (groupSnap.exists()) {
            error.innerText = 'This code is already in use.'
        } else {
            error.style.display = 'none'
            await setDoc(groupRef, {
                NAME: name,
                USERS: [],
                ADMINS: [uid]
            })
            router.push({
                pathname: '/[dashboard]/home',
                query: {dashboard: uid}
            })
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

function Form() {
    const router = useRouter()
    return (
        <form className={styles.form} style={{borderRight: '4px solid #000000', left: '0px'}} 
            onSubmit={(e) => e.preventDefault()}>
            <div>
                <p className={styles.header}>Create a group</p>
                <p className={styles.text}
                    style={{marginTop: '40px', marginBottom: '15px'}}>
                    Set a group name and code:
                </p>
                <div style={{marginBottom: '20px'}}>
                    <Input placeholder='Group name'/>
                    <Input placeholder='Group code'/>
                </div>
                <p className={styles.error} id='error' style={{display: 'none', marginTop: '-48px', marginBottom: '24px'}}>
                    This code is already in use.
                </p>
                <Continue/>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <p className={styles.steps} style={{marginLeft: '-10px'}} onClick={() => router.push('/setup')}>&larr; Go back</p>
                    <p className={styles.steps}
                    onClick={() => router.push({
                        pathname: '/[dashboard]/home',
                        query: {dashboard: auth.currentUser.uid}
                    })}>Skip this step &rarr;</p>
                </div>
            </div>
        </form>
    )
}

function CreateGroup() {
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

export default CreateGroup