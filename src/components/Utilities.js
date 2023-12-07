import styles from '../styles/Utilities.module.css'
import Image from 'next/image'
import { database } from '../configFirebase'
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore'
import { imageHighlight } from './Navigation'

export async function getUser(uid) {
    const userRef = doc(database, 'users', uid)
    const userSnap = await getDoc(userRef)
    return {
        NAME: userSnap.data().NAME,
        ADMIN: userSnap.data().ADMIN,
        FRIENDS: userSnap.data().FRIENDS,
        GROUPS: userSnap.data().GROUPS
    }
}

export async function getDrawings(uid) {
    const drawingsRef = collection(database, 'users', uid, 'drawings')
    const drawingSnap = await getDocs(drawingsRef)
    var data = []
    drawingSnap.forEach((drawing) => {
        data.push({
            TITLE: drawing.data().TITLE,
            DATE: drawing.data().DATE,
            ID: drawing.id
        })
    })
    return data
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
        <button className={styles.button}
            onClick={onClick}>
            {text}
            {children}
        </button>
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

export async function getGroup(code) {
    const userRef = doc(database, 'groups', code)
    const userSnap = await getDoc(userRef)
    return {
        NAME: userSnap.data().NAME,
        ADMINS: userSnap.data().ADMINS,
        USERS: userSnap.data().USERS
    }
}

export async function getDrawing(uid, drawingId) {
    const drawingRef = doc(database, 'users', uid, 'drawings', drawingId)
    const drawingSnap = await getDoc(drawingRef)
    return {
        CURRENT: drawingSnap.data().CURRENT, 
        PALETTE: drawingSnap.data().PALETTE
    }
}

export async function updateDrawing(uid, drawingId, type, data) {
    const drawingRef = doc(database, 'users', uid, 'drawings', drawingId)
    if (type == 'current') {
        await updateDoc(drawingRef, {
            CURRENT: data
        })
    } else if (type == 'palette') {
        await updateDoc(drawingRef, {
            PALETTE: data
        })
    }
}

export function onlyLetters(string) {
    return /^[a-zA-Z]+$/.test(string)
}

export function onlyNumbersAndLetters(string) {
    return /^[A-Za-z0-9]*$/.test(string)
}