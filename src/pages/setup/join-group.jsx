import Image from 'next/image'
import styles from '../../styles/Auth.module.css'
import { onlyNumbersAndLetters, getUser } from '../../components/Utilities'
import { Left } from '../../components/AuthLayout'
import { Input } from '../../pages/signup'
import { database, auth } from '../../configFirebase'
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useState } from 'react'


async function join(router) {
    const code = document.getElementById('Group code').value
    const groupRef = doc(database, 'groups', code)
    const uid = auth.currentUser.uid
    await updateDoc(groupRef, {
        USERS: arrayUnion(uid)
    })
    router.push({
        pathname: '/[dashboard]/home',
        query: {dashboard: uid}
    })
}

function Join() {
    const router = useRouter()
    return (
        <div id='join' style={{display: 'none'}}>
            <input
                type='submit'
                value='Join'
                className={styles.input}
                style={{backgroundColor: '#F1C400', justifyContent: 'center', alignItems: 'center'}}
                onClick={() => join(router)}
            />
            <div className={styles.shadow}></div>
        </div>
    )
}

async function next() {
    const code = document.getElementById('Group code').value
    const error = document.getElementById('error')
    const adminProfile = document.getElementById('admin')
    const next = document.getElementById('continue')
    const join = document.getElementById('join')
    if (code == '') {
        error.style.display = 'block'
        adminProfile.style.display = 'none'
        error.innerText = 'Missing code.'
    } else if (!onlyNumbersAndLetters(code)) {
        error.style.display = 'block'
        adminProfile.style.display = 'none'
        error.innerText = 'This code contains invalid characters.'
    } else {
        const groupRef = doc(database, 'groups', code)
        const groupSnap = await getDoc(groupRef)
        if (!groupSnap.exists()) {
            error.style.display = 'block'
            error.innerText = 'This group does not exist.'
        } else {
            error.style.display = 'none'
            adminProfile.style.display = 'block'
            const adminUid = groupSnap.data().ADMINS[0]
            const admin = await getUser(adminUid)
            document.getElementById('Admin name').innerText = admin.NAME
            document.getElementById('Group name').innerText = groupSnap.data().NAME
            next.style.display = 'none'
            join.style.display = 'block'
        }
    }
}

function Continue() {
    const router = useRouter()
    return (
        <div id='continue'>
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

function Admin() {
    return (
        <div id='admin' style={{display: 'none'}}>
            <p className={styles.text}
                style={{textAlign: 'center', marginTop: '-20px', marginBottom: '15px'}}>
                Is this your administrator?
            </p>
            <div className={styles.admin}>
                <Image
                    src='/icons/profile.svg'
                    alt='profile'
                    width={90}
                    height={90}
                />
                <div className={styles.adminData}>
                    <p className={styles.text} id='Admin name' style={{margin: '0px'}}>Administrator Name</p>
                    <p className={styles.text} id='Group name' style={{margin: '0px'}}>Group name</p>
                </div>
            </div>
            <div className={styles.adminShadow}></div>
        </div>
    )
}

function Form() {
    const router = useRouter()
    return (
        <form className={styles.form} style={{borderRight: '4px solid #000000', left: '0px'}} 
            onSubmit={(e) => e.preventDefault()}>
            <div>
                <p className={styles.header}>Join a group</p>
                <p className={styles.text}
                    style={{marginTop: '40px', marginBottom: '15px'}}>
                    Enter a group code:
                </p>
                <div style={{marginBottom: '20px'}}>
                    <Input placeholder='Group code'/>
                </div>
                <p className={styles.error} id='error' style={{display: 'none', marginTop: '-48px', marginBottom: '24px'}}>
                    This group does not exist.
                </p>
                <div>
                    <Admin/>
                    <Continue/>
                    <Join/>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <p className={styles.steps} style={{marginLeft: '-10px'}} onClick={() => router.push('/setup')}>&larr; Go back</p>
                </div>
            </div>
        </form>
    )
}

function JoinGroup() {
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

export default JoinGroup