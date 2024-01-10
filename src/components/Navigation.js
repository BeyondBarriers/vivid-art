import Image from 'next/image'
import styles from '../styles/Navigation.module.css'
import { auth } from '../configFirebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

function view(router, tab) {
    router.push({
        pathname: '/[dashboard]/' + tab.toLowerCase(),
        query: {dashboard: auth.currentUser.uid}
    })
}

export function Profile({ name, title }) {
    //add option to set a profile picture?
    return (
        <div>
            <Image
                src='/icons/profile.svg'
                alt='profile'
                width={125}
                height={125}
                style={{marginLeft: '12px'}}
            />
            <p className={styles.text}>{name}</p>
            <p className={styles.text}>{title}</p>
        </div>
    )
}

function Menu() {
    return (
        <button className={styles.menu}
            onClick={(e) => showSideBar(e)}
            onMouseOver={(e) => imageHighlight('menu', true, e)}
            onMouseLeave={(e) => imageHighlight('menu', false, e)}>
            <Image
                src='/icons/menu.svg'
                alt='menu'
                width={30}
                height={25}
            />
        </button>
    )
}

function showSideBar(event) {
    const sideBar = document.getElementById('sidebar')
    const navBar = document.getElementById('NavBar')
    const sideBarNavBar = document.getElementById('SideBarNavBar')
    const menu = event.currentTarget.firstElementChild
    console.log(menu)
    console.log(sideBar)
    if (sideBar.style.display == 'none') {
        navBar.style.display = 'none'
        sideBar.style.display = 'flex'
        sideBarNavBar.style.display = 'flex'
        menu.src = '/icons/menu.svg'
    } else {
        navBar.style.display = 'flex'
        sideBar.style.display = 'none'
        sideBarNavBar.style.display = 'none'
        menu.src = '/icons/open/menu.svg'
    }
}

export function NavBarLogo() {
    const router = useRouter()
    return (
        <button className={styles.navBarLogo}
            onClick={() => router.push('/')}
            onMouseOver={(e) => imageHighlight('vividArt', true, e)}
            onMouseLeave={(e) => imageHighlight('vividArt', false, e)}>
            <Image
                src='/icons/vividArt.svg'
                alt='logo'
                width={30}
                height={30}
                style={{marginRight: '10px'}}
            />
            <p>Vivid Art</p>
        </button>
    )
}

function open(tab, router) {
    if (tab == 'Draw') {
        const drawingId = uuidv4()
        console.log(drawingId)
        router.push({
            pathname: '/[dashboard]/[drawing]',
            query: {dashboard: auth.currentUser.uid, drawing: drawingId}
        })
    } else if (tab == 'Template') {
        router.push('/template')
    } else if (tab == 'Gallery') {
        router.push('/gallery')
    } else if (tab == 'Login') {
        router.push('/login')
    } else if (tab == 'Signup') {
        router.push('/signup')
    }
}

function NavButton({ text }) {
    const router = useRouter()
    return (
        <button className={styles.navButton}
            onClick={() => open(text, router)}>
            {text}
        </button>
    )
}

export function Logo() {
    const router = useRouter()
    return (
        <button className={styles.logo}
            onClick={() => router.push('/')}
            onMouseOver={(e) => imageHighlight('vividArt', true, e)}
            onMouseLeave={(e) => imageHighlight('vividArt', false, e)}>
            <Image
                src='/icons/vividArt.svg'
                alt='logo'
                width={40}
                height={40}
                style={{marginRight: '10px'}}
            />
            <p>Vivid Art</p>
        </button>
    )
}

export function imageHighlight(file, hovering, event) {
    const image = event.currentTarget.firstElementChild
    if (hovering) {
        image.src = '/icons/open/' + file + '.svg'
    } else {
        image.src = '/icons/' + file + '.svg'
    }
    if (file == 'menu') {
        var sideBar = document.getElementById('sidebar')
        if (sideBar.style.display != 'none') {
            image.src = '/icons/open/' + file + '.svg'
        }
    }
}

export function SideButton({ text, open='None' }) {
    const router = useRouter()
    var image = '/icons/' + text.toLowerCase() + '.svg'
    var className = styles.sideTextOpen
    if (open == 'None') {
        className = styles.sideText
    }
    return (
        <button className={styles.sideButton}
            onClick={() => view(router, text)}
            onMouseOver={(e) => imageHighlight(text.toLowerCase(), true, e)}
            onMouseLeave={(e) => imageHighlight(text.toLowerCase(), false, e)}>
            <Image
                src={image}
                alt={text}
                width={20}
                height={20}
                style={{marginBottom: '3px', marginRight: '10px'}}
            />
            <p className={className}>
                {text}</p>
        </button>
    )
}

export function SideBar({ open='None', user }) {
    return (
        <div id='sidebar' className={styles.sideBar} style={{display: 'none'}}>
            <Logo/>
            {user != 'None' && <Profile name={user.NAME} title={user.TITLE}/>}
            <SideButton text='Home' open={open}/>
            {open=='Home' && <div className={styles.underline}></div>}
            <SideButton text='Drawings'/>
            {open=='Drawings' && <div className={styles.underline} style={{width: '72px'}}></div>}
            <SideButton text='Groups'/>
            {open=='Groups' && <div className={styles.underline} style={{width: '60px'}}></div>}
            <SideButton text='Collaboration'/>
            {open=='Collaboration' && <div className={styles.underline} style={{width: '110px'}}></div>}
            <SideButton text='Settings'/>
            {open=='Settings' && <div className={styles.underline} style={{width: '70px'}}></div>}
        </div>
    )
}

export function SideBarNavBar() {
    return (
        <div id='SideBarNavBar'
            className={styles.navBar} style={{display: 'none'}}>
            <NavButton text='Draw'/>
            <NavButton text='Template'/>
            <NavButton text='Gallery'/>
            <Menu/>
        </div>
    )
}

export function NavBar() {
    const [user, setUser] = useState(false)
    const router = useRouter()
    onAuthStateChanged(auth, ( user) => {
        if (user) {
            setUser(true)
        }
    })
    if (user) {
        return (
            <div id='NavBar'
                className={styles.navBar} style={{minWidth: '100%'}}>
                <NavBarLogo/>
                <NavButton text='Draw'/>
                <NavButton text='Template'/>
                <NavButton text='Gallery'/>
                <Menu/>
            </div>
        )
    } else {
        return (
            <div id='NavBar'
                className={styles.navBar} style={{minWidth: '100%'}}>
                <NavBarLogo/>
                <NavButton text='Login'/>
                <NavButton text='Signup'/>
            </div>
        )
    }
}