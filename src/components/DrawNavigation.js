import Image from 'next/image'
import styles from '../styles/Navigation.module.css'
import { auth, storage } from '../configFirebase'
import { ref, uploadString } from 'firebase/storage'
import { Logo, NavBarLogo, Profile, imageHighlight } from '../components/Navigation'
import { useRouter } from 'next/router'
import { isHexCode, updateDrawing } from './Utilities'
import { get } from 'http'

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

async function rename(event, drawingId) {
    var title = event.currentTarget.value
    var canvas = document.getElementById('canvas')
    canvas.title = title
    await updateDrawing(auth.currentUser.uid, drawingId, 'title', title)
}

function Title({ drawingId }) {
    var text = 'Untitled Drawing'
    var color = '#000000'
    if (text == 'Untitled Drawing') {
        color = '#5F5F5F'
    }
    return (
        <input className={styles.title}
            color={color}
            type='text'
            onChange={(e) => rename(e, drawingId)}
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

function changeHexCode(event, id) {
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

function showColorPicker(id) {
    const colorPicker = document.getElementById(id + 'picker')
    const inputColor = document.getElementById(id + 'input')
    colorPicker.click()
}

function getColorPicker(id) {
    const colorPicker = document.getElementById(id + 'picker')
    const inputColor = document.getElementById(id + 'input')
    const sideButton = document.getElementById(id + 'mini')
    const colorButton = document.getElementById(id)
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    const previous = inputColor.getAttribute('data-previous')
    inputColor.value = colorPicker.value
    colorButton.style.backgroundColor = colorPicker.value
    sideButton.style.backgroundColor = colorPicker.value
    if (context.strokeStyle == previous) {
        context.strokeStyle = colorPicker.value
        context.fillStyle = colorPicker.value
    }
    inputColor.setAttribute('data-previous', inputColor.value)
}

async function changePenColor(event) {
    const color = event.currentTarget.style.backgroundColor
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    context.strokeStyle = color
    context.fillStyle = color
    var sideButton = document.getElementById('palettesidebar').firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling
    for (let i = 0; i < 8; i++) {
        sideButton.firstElementChild.nextElementSibling.style.outline = 'none'
        sideButton = sideButton.nextElementSibling
    }
    var colorButton = document.getElementById('palette').firstElementChild.nextElementSibling
    for (let i = 0; i < 9; i++) {
        colorButton.style.outline = 'none'
        colorButton = colorButton.nextElementSibling
    }
    event.currentTarget.style.outline = '2px solid #000000'
    document.getElementById(event.currentTarget.id.substring(0, 7)).style.outline = '2px solid #000000'
    document.getElementById('eraser').src = '/icons/eraser.svg'
    document.getElementById('pen').src = '/icons/open/pen.svg'
    await updateDrawing('h6svuOhdSue4m198cMqOYKvmBBK2', 'unqiueId', 'current', color)
}

function Color({ color }) {
    return (
        <div style={{display: 'inline-flex', width: '60%', marginBottom: '16px'}}>
            <input type='color' id={color + 'picker'} 
                onChange={() => getColorPicker(color)}
                value={color} 
                style={{position: 'absolute', width: '30px', visibility: 'hidden'}}/>
            <div className={styles.paletteColor} 
                style={{backgroundColor: color, zIndex: '1'}} 
                id={color + 'mini'}
                onClick={(e) => changePenColor(e)}>
            </div>
            <input className={styles.inputText} 
                data-previous={color}
                placeholder={color} 
                id={color + 'input'}
                onClick={() => showColorPicker(color)} 
                onChange={(e) => changeHexCode(e, color)}
            />
        </div>
    )
}

function back() {
    const sideBar = document.getElementById('sidebar')
    const paletteBar = document.getElementById('palettesidebar')
    const saveBar = document.getElementById('savesidebar')
    const settingsBar = document.getElementById('settingssidebar')
    paletteBar.style.display = 'none'
    saveBar.style.display = 'none'
    sideBar.style.display = 'flex'
    settingsBar.style.display = 'none'
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

function useDefaultColors() {
    console.log('youir mom')
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
            <div style={{width: '60%', marginTop: '20px'}}>
                <button className={styles.toggle} onClick={() => useDefaultColors()}>
                    Default colors
                </button>
                <div className={styles.toggleShadow}></div>
            </div>
        </div>
    )
}

function save(type, drawingId, userID) {
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
        let storageRef = ref(storage, userID + '/' + drawingId + '.png')
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

function SaveButton({ type, drawingId, userID }) {
    var image = '/icons/' + type.toLowerCase() + '.svg'
    return (
        <button className={styles.sideButton} style={{marginTop: '-10px'}}
            onClick={() => save(type, drawingId, userID)}
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

export function SaveSideBar({ user, drawingId }) {
    return (
        <div id='savesidebar' className={styles.sideBar} style={{display: 'none'}}>
            <Logo/>
            <Back/>
            <Profile name={user.NAME}/>
            <Heading text='Save'/>
            <SaveButton type='Print'/>
            <SaveButton type='Download'/>
            <SaveButton type='Save' drawingId={drawingId} userID={user.ID}/>
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
            popup.style.display = 'flex'
        })
        reader.readAsDataURL(imageFile)
    } catch (e) {
        let popup = document.getElementById('uploadFail')
        popup.style.display = 'flex'
    }
}

function showPalette(event) {
    const button = event.currentTarget
    const palette = document.getElementById('palette')
    const paletteShadow = document.getElementById('paletteShadow')
    if (button.innerText == 'Hide palette') {
        button.style.backgroundColor = '#F1C400'
        button.innerText = 'Show palette'
        palette.style.display = 'none'
        paletteShadow.style.display = 'none'
    } else {
        button.style.backgroundColor = '#FFFFFF'
        button.innerText = 'Hide palette'
        palette.style.display = 'flex'
        paletteShadow.style.display = 'flex'
    }
}

function TogglePalette() {
    return (
        <div style={{width: '60%'}}>
            <button className={styles.toggle} onClick={(e) => showPalette(e)}>
                Hide palette
            </button>
            <div className={styles.toggleShadow}></div>
        </div>
    )
}

export function SettingsSideBar({ user }) {
    return (
        <div id='settingssidebar' className={styles.sideBar} style={{display: 'none'}}>
            <Logo/>
            <Back/>
            <Profile name={user.NAME}/>
            <Heading text='Settings'/>
            <TogglePalette/>
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
            <SideButton text='Settings'/>
            <SideButton text='Exit'/>
        </div>
    )
}

export function DrawNavBar({ drawingId }) {
    return (
        <div id='DrawNavBar' className={styles.navBar} style={{minWidth: '100%', border: 'none', boxShadow: 'none'}}>
            <NavBarLogo/>
            <Title drawingId={drawingId}/>
            <Menu/>
        </div>
    )
}