import Image from 'next/image'
import styles from '../styles/Navigation.module.css'
import { storage } from '../configFirebase'
import { ref, uploadString } from 'firebase/storage'
import { Logo, NavBarLogo, Profile, imageHighlight } from '../components/Navigation'
import { useRouter } from 'next/router'
import useWindowSize from '../hooks/useWindowSize'
import { isHexCode } from './Utilities'

function showSideBar(event) {
    const sideBar = document.getElementById('sidebar')
    const navBar = document.getElementById('DrawNavBar')
    const menu = event.currentTarget.firstElementChild
    const paletteBar = document.getElementById('palettesidebar')
    if (sideBar.style.display == 'none') {
        sideBar.style.display = 'flex'
        menu.src = '/icons/menu.svg'
    } else {
        navBar.style.display = 'flex'
        sideBar.style.display = 'none'
        paletteBar.style.display = 'none'
        menu.src = '/icons/open/menu.svg'
    }
}

function Title() {
    var text = 'Untitled Drawing'
    var color = '#000000'
    if (text == 'Untitled Drawing') {
        color = '#5F5F5F'
    }
    function rename(event) {
        var title = event.currentTarget.value
        var canvas = document.getElementById('canvas')
        canvas.title = title
    }
    return (
        <input className={styles.title}
            color={color}
            type='text'
            onChange={(e) => rename(e)}
            placeholder={text}
        />
    )
}

function open(type, router) {
    const paletteBar = document.getElementById('palettesidebar')
    const saveBar = document.getElementById('savesidebar')
    const settingsBar = document.getElementById('settingssidebar')
    saveBar.style.display = 'none'
    paletteBar.style.display = 'none'
    settingsBar.style.display = 'none'
    if (type == 'Palette') {
        paletteBar.style.display = 'flex'
    } else if (type == 'Save') {
        saveBar.style.display = 'flex'
    } else if (type == 'Upload') {
        upload()
    } else if (type == 'Settings') {
        settingsBar.style.display = 'flex'
    } else if (type == 'Exit') {
        save('Save')
        router.push('/') // go to dashboard
    }
}

function SideButton({ text }) {
    const router = useRouter()
    var image = '/icons/' + text.toLowerCase() + '.svg'
    return (
        <button className={styles.sideButton}
            onClick={() => open(text, router)}
            onMouseOver={(e) => imageHighlight(text.toLowerCase(), true, e)}
            onMouseLeave={(e) => imageHighlight(text.toLowerCase(), false, e)}>
            <Image
                src={image}
                alt={text}
                width={20}
                height={20}
                style={{marginBottom: '3px', marginRight: '10px'}}
            />
            <p className={styles.sideText}>
                {text}</p>
        </button>
    )
}

export function Menu() {
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

function Heading({ text }) {
    const image = '/icons/' + text.toLowerCase() + '.svg'
    return (
        <div className={styles.header}>
            <Image
                src={image}
                alt={text}
                width={30}
                height={30}
                style={{marginBottom: '3px', marginRight: '10px'}}
            />
            <p className={styles.sideText} style={{fontSize: '30px'}}>
                {text}</p>
        </div>
    )
}

function changeColor(event, id) {
    const input = event.currentTarget
    const colorButton = document.getElementById(id)
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    var previous = input.getAttribute('data-previous')
    if (isHexCode(input.value)) {
        colorButton.style.backgroundColor = input.value
        const colorPicker = document.getElementById(id + 'mini')
        colorPicker.style.backgroundColor = input.value
        if (context.strokeStyle == previous) {
            context.strokeStyle = input.value
            context.fillStyle = input.value
        }
        input.setAttribute('data-previous', input.value)
    }
}

function Color({ color }) {
    return (
        <div style={{display: 'inline-flex', width: '60%', marginBottom: '16px'}}>
            <div className={styles.paletteColor} style={{backgroundColor: color}} id={color + 'mini'}></div>
            <input data-previous={color} className={styles.inputText} placeholder={color} onChange={(e) => changeColor(e, color)}/>
        </div>
    )
}

function back() {
    const sideBar = document.getElementById('sidebar')
    const paletteBar = document.getElementById('palettesidebar')
    const saveBar = document.getElementById('savesidebar')
    paletteBar.style.display = 'none'
    saveBar.style.display = 'none'
    sideBar.style.display = 'flex'
}

function Back() {
    return (
        <button className={styles.sideButton} style={{marginBottom: '25px'}}
            onClick={() => back()}
            onMouseOver={(e) => imageHighlight('back', true, e)}
            onMouseLeave={(e) => imageHighlight('back', false, e)}>
            <Image
                src='/icons/back.svg'
                alt='Back'
                width={20}
                height={20}
                style={{marginTop: '20px', marginRight: '10px'}}
            />
            <p className={styles.sideText} style={{marginBottom: '0px'}}>Back</p>
        </button>
    )
}

export function PaletteSideBar({ palette, user }) {
    return (
        <div id='palettesidebar' className={styles.sideBar} style={{display: 'none'}}>
            <Logo/>
            <Back/>
            <Profile name={user.NAME} title={user.TITLE}/>
            <Heading text='Palette'/>
            {palette.map((color) => 
                <Color color={color}/>
            )}
        </div>
    )
}

function save(type) {
    if (type == 'Save') {
        // adds white background
        var canvas = document.getElementById('canvas')
        const whiteBackground = document.createElement('canvas')
        whiteBackground.width = canvas.width
        whiteBackground.height = canvas.height

        const ctx = whiteBackground.getContext('2d')
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(canvas, 0, 0)

        // upload image
        var imageID = 'image1'
        let storageRef = ref(storage, 'images/' + imageID + '.png') // imageid in the localstorage
        var dataURL = whiteBackground.toDataURL('image/png')
        uploadString(storageRef, dataURL, 'data_url').then((snapshot) => {
            alert('Saved!')
        })
    } else if (type == 'Print') {
        const dataURL = document.getElementById('canvas').toDataURL()
        let windowContent = '<!DOCTYPE html>'
        windowContent += '<html>'
        windowContent += '<body>'
        windowContent += '<img src="' + dataURL + '">'
        windowContent += '</body>'
        windowContent += '</html>'

        const printWindow = window.open('', '', 'width=' + screen.availWidth + ',height=' + screen.availHeight)
        printWindow.document.open()
        printWindow.document.write(windowContent)

        printWindow.document.addEventListener('load', function () {
            printWindow.focus()
            printWindow.document.close()
            printWindow.print()
        }, true)
    } else if (type == 'Download') {
        // creates png to download
        let downloadLink = document.createElement('a');
        const title = document.getElementById('canvas').title
        downloadLink.setAttribute('download', title + '.png');
        var canvas = document.getElementById('canvas')

        // adds white background
        const whiteBackground = document.createElement('canvas')
        whiteBackground.width = canvas.width
        whiteBackground.height = canvas.height

        const ctx = whiteBackground.getContext('2d')
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(canvas, 0, 0)

        whiteBackground.toBlob((blob) => {
            let url = URL.createObjectURL(blob);
            downloadLink.setAttribute('href', url);
            downloadLink.click()
        })
    }
}

function SaveButton({ type }) {
    var image = '/icons/' + type.toLowerCase() + '.svg'
    return (
        <button className={styles.sideButton} style={{marginTop: '-10px'}}
            onClick={() => save(type)}
            onMouseOver={(e) => imageHighlight(type.toLowerCase(), true, e)}
            onMouseLeave={(e) => imageHighlight(type.toLowerCase(), false, e)}>
            <Image
                src={image}
                alt={type}
                width={20}
                height={20}
                style={{marginBottom: '3px', marginRight: '10px'}}
            />
            <p className={styles.sideText}>
                {type}</p>
        </button>
    )
}

export function SaveSideBar({ user }) {
    return (
        <div id='savesidebar' className={styles.sideBar} style={{display: 'none'}}>
            <Logo/>
            <Back/>
            <Profile name={user.NAME}/>
            <Heading text='Save'/>
            <SaveButton type='Print'/>
            <SaveButton type='Download'/>
            <SaveButton type='Save'/>
        </div>
    )
}

async function upload() {
    const reader = new FileReader()
    try {
        const [fileHandle] = await window.showOpenFilePicker()
        const imageFile = await fileHandle.getFile();
        reader.addEventListener('load', () => {
            let popup = document.getElementById('clear')
            popup.alt = reader.result
            popup.style.display = 'block'
        })
        reader.readAsDataURL(imageFile)
    } catch (e) {
        // add a popup that says upload did not owrk
    }
}

export function SettingsSideBar({ user }) {
    return (
        <div id='settingssidebar' className={styles.sideBar} style={{display: 'none'}}>
            <Logo/>
            <Back/>
            <Profile name={user.NAME}/>
            <Heading text='Settings'/>
        </div>
    )
}

export function DrawSideBar({ user }) {
    return (
        <div id='sidebar' className={styles.sideBar} style={{display: 'none'}}>
            <Logo/>
            <Profile name={user.NAME}/>
            <SideButton text='Palette'/>
            <SideButton text='Upload'/>
            <SideButton text='Save'/>
            {/*<SideButton text='Settings'/>*/}
            <SideButton text='Exit'/>
        </div>
    )
}

export function DrawNavBar() {
    return (
        <div id='DrawNavBar' className={styles.navBar} style={{minWidth: '100%', border: 'none', boxShadow: 'none'}}>
            <NavBarLogo/>
            <Title/>
            <Menu/>
        </div>
    )
}