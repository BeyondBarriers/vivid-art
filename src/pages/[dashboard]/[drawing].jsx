import { storage } from '../../configFirebase'
import { ref, uploadString } from 'firebase/storage'
import { Popup, Header, getUser, getDrawing, newDrawing, Button } from '../../components/Utilities'
import { DrawNavBar, SaveSideBar, DrawSideBar, PaletteSideBar, SettingsSideBar } from '../../components/DrawNavigation'
import styles from '../../styles/Draw.module.css'
import useWindowSize from '../../hooks/useWindowSize'
import Canvas from '../../components/Canvas'
import Image from 'next/image'

async function changeColor(event) {
    const color = event.currentTarget.style.backgroundColor
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    context.strokeStyle = color
    context.fillStyle = color
    var colorButton = document.getElementById('palette').firstElementChild.nextElementSibling
    for (let i = 0; i < 9; i++) {
        colorButton.style.outline = 'none'
        colorButton = colorButton.nextElementSibling
    }
    var sideButton = document.getElementById('palettesidebar').firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling
    for (let i = 0; i < 8; i++) {
        sideButton.firstElementChild.nextElementSibling.style.outline = 'none'
        sideButton = sideButton.nextElementSibling
    }
    event.currentTarget.style.outline = '2px solid #000000'
    document.getElementById(event.currentTarget.id + 'mini').style.outline = '2px solid #000000'
    document.getElementById('eraser').src = '/icons/eraser.svg'
    document.getElementById('pen').src = '/icons/open/pen.svg'
}

async function changeTool(event, tool) {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    const button = event.currentTarget
    const image = button.firstElementChild
    if (tool == 'eraser') {
        document.getElementById('eraser').src = '/icons/open/eraser.svg'
        document.getElementById('pen').src = '/icons/pen.svg'
        context.strokeStyle = '#FFFFFF'
        context.fillStyle = '#FFFFFF'
    } else if (tool == 'pen') {
        document.getElementById('eraser').src = '/icons/eraser.svg'
        document.getElementById('pen').src = '/icons/open/pen.svg'
        var colorButton = document.getElementById('palette').firstElementChild.nextElementSibling
        for (let i = 0; i < 9; i++) {
            if (colorButton.style.outline != 'none') {
                context.strokeStyle = colorButton.style.backgroundColor
                context.fillStyle = colorButton.style.backgroundColor
            }
            colorButton = colorButton.nextElementSibling
        }
    }
}

function ColorButton({ color, id }) {
    return (
        <button className={styles.colorButton} id={id}
            style={{ backgroundColor: color }}
            onClick={(e) => changeColor(e)}>
        </button>
    )
}

function Tool({ type }) {
    var image = '/icons/' + type + '.svg'
    if (type == 'pen') {
        image = '/icons/open/' + type + '.svg'
    }
    return (
        <button className={styles.icon}
            onClick={(e) => changeTool(e, type)}>
            <Image
                fill
                src={image}
                alt={type}
                id={type}
                style={{ objectFit: 'contain' }}
            />
        </button>
    )
}

function Palette({ colors }) {
    // each will be stored in the database specific to each drawing
    return (
        <div className={styles.palette} id='palette'>
            <Tool type='pen'/>
            <Tool type='eraser'/>
            {colors.map((color) =>
                <ColorButton color={color} id={color}/>
            )}
        </div>
    )
}

function ToolBox({ colors }) {
    return (
        <div style={{width: '100%', border: '2px solid black'}}>
            <Palette colors={colors}/>
            <div className={styles.shadow} id='paletteShadow'></div>
        </div>
    )
}

function uploadPage(clear, width, height) {
    const popup = document.getElementById('clear')
    popup.style.display = 'none'
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    if (clear) {
        context.clearRect(0, 0, width, height)
    }
    let image = document.createElement('img')
    image.src = popup.alt
    image.onload = () => {
        let imageHeight = height - 75 - (width * 0.65 * 0.1) - (height * 0.08)
        let imageWidth = (imageHeight / image.naturalHeight) * image.naturalWidth
        let x = (width / 2) - (imageWidth / 2)
        context.drawImage(image, x, 0, imageWidth, imageHeight)
    }
}

function next() {
    const popup = document.getElementById('uploadFail')
    popup.style.display = 'none'
}

export async function getServerSideProps(context) {
    const uid = context.params.dashboard
    const drawingId = context.params.drawing
    const user = await getUser(uid)
    console.log(user)
    var drawing = await getDrawing(uid, drawingId)
    if (!drawing) {
        drawing = await newDrawing(uid, drawingId)
    }
    return (
        {props: {
            ID: drawingId,
            PALETTE: drawing.PALETTE,
            USER: user
        }}
    )
}

function Draw(props) {
    const { width, height } = useWindowSize()
    if (props) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {/*Navigation*/}
                <DrawSideBar user={props.USER}/>
                <DrawNavBar drawingId={props.ID}/>
                <PaletteSideBar palette={props.PALETTE} user={props.USER}/>
                <SaveSideBar user={props.USER} drawingId={props.ID}/>
                <SettingsSideBar user={props.USER}/>
                
                {/*Drawing*/}
                <img id='img' style={{ display: 'none' }}/>
                <Canvas width={width} height={height}/>
                <ToolBox colors={props.PALETTE}/>
                <Popup id='clear'>
                    <Header text='Clear the canvas?'/>
                    <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
                        <Button onClick={() => uploadPage(true, width, height)} text='Clear canvas'/>
                        <Button onClick={() => uploadPage(false, width, height)} text='Keep canvas'/>
                    </div>
                </Popup>
                <Popup id='uploadFail'>
                    <Header text='Unable to upload image.'/>
                    <Button onClick={() => next()} text='Continue'/>
                </Popup>
            </div>
        )
    }
}

export default Draw