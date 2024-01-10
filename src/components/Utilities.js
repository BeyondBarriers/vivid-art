import styles from '../styles/Utilities.module.css'
import Image from 'next/image'
import { database } from '../configFirebase'
import { arrayUnion, collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore'
import { imageHighlight } from './Navigation'

export async function getUser(uid) {
    const userRef = doc(database, 'users', uid)
    const userSnap = await getDoc(userRef)
    return {
        ID: userSnap.id,
        NAME: userSnap.data().NAME,
        ADMIN: userSnap.data().ADMIN,
        FRIENDS: userSnap.data().FRIENDS,
        GROUPS: userSnap.data().GROUPS
    }
}

export async function newUser(uid, name, admin) {
    const userRef = doc(database, 'users', uid)
    await setDoc(userRef, {
        NAME: name,
        ADMIN: admin,
        FRIENDS: [],
        GROUPS: []
    })
    return await getUser(uid)
}

export async function updateUser(uid, type, data) {
    const userRef = doc(database, 'users', uid)
    if (type == 'groups') {
        await updateDoc(userRef, {
            GROUPS: arrayUnion(data)
        })
    }
}

export async function getDrawings(uid) {
    const drawingsRef = collection(database, 'users', uid, 'drawings')
    const drawingSnap = await getDocs(drawingsRef)
    var data = []
    drawingSnap.forEach((drawing) => {
        data.push({
            ID: drawing.id,
            TITLE: drawing.data().TITLE,
            DATE: drawing.data().DATE,
            PALETTE: drawing.data().PALETTE
        })
    })
    return data
}

export async function getDrawing(uid, drawingId) {
    const drawingRef = doc(database, 'users', uid, 'drawings', drawingId)
    const drawingSnap = await getDoc(drawingRef)
    if (drawingSnap.exists()) {
        return {
            PALETTE: drawingSnap.data().PALETTE
        }
    } else {
        return false
    }
}

export async function newDrawing(uid, drawingId) {
    const drawingsRef = doc(database, 'users', uid, 'drawings', drawingId)
    const date = new Date()
    await setDoc(drawingsRef, {
        PALETTE: ['#E74236', '#FF914D', '#FFDE59', '#59BD7C', '#0CC0DF', '#9E6EFF', '#FF88D1', '#000000'],
        TITLE: 'Untitled Drawing',
        DATE: date.toLocaleDateString(),
    })
    return await getDrawing(uid, drawingId)
}

export async function updateDrawing(uid, drawingId, type, data) {
    const drawingRef = doc(database, 'users', uid, 'drawings', drawingId)
    if (type == 'title') {
        await updateDoc(drawingRef, {
            TITLE: data
        })
    } else if (type == 'palette') {
        await updateDoc(drawingRef, {
            PALETTE: data
        })
    }
}

export async function getGroup(code) {
    const userRef = doc(database, 'groups', code)
    const userSnap = await getDoc(userRef)
    return {
        NAME: userSnap.data().NAME,
        ADMINS: userSnap.data().ADMINS,
        USERS: userSnap.data().USERS
    }
}

export function onlyLetters(string) {
    return /^[a-zA-Z]+$/.test(string)
}

export function onlyNumbersAndLetters(string) {
    return /^[A-Za-z0-9]*$/.test(string)
}

export function isHexCode(string) {
    return string.length == 7 && /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(string)
}

function close(id) {
    const popup = document.getElementById(id)
    popup.style.display = 'none'
}

export function Header({ text }) {
    return (
        <p className={styles.text} style={{fontSize: '36px'}}>{text}</p>
    )
}

export function Text({ text }) {
    return (
        <p className={styles.text}>{text}</p>
    )
}

export function Button({ onClick, text, children }) {
    return (
        <div style={{width: '35%'}}>
            <button className={styles.button}
                onClick={onClick}>
                {text}
                {children}
            </button>
            <div className={styles.buttonShadow}></div>
        </div>
    )
}

export function Popup({ id, children }) {
    return (
        <div id={id} style={{display: 'none'}}>
            <div className={styles.popup}>
                <button className={styles.x}
                    onClick={() => close(id)}
                    onMouseOver={(e) => imageHighlight('x', true, e)}
                    onMouseLeave={(e) => imageHighlight('x', false, e)}>
                    <Image
                        src='/icons/x.svg'
                        width={30}
                        height={30}
                        alt='x'
                    />
                </button>
                {children}
            </div>
            <div className={styles.shadow}></div>
        </div>
    )
}