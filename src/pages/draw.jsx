import { storage } from '../configFirebase'
import { ref, uploadString } from 'firebase/storage'
import { Popup, Header, Text, getDrawing, updateDrawing, Button } from '../components/Utilities'
import { DrawNavBar, SaveSideBar, DrawSideBar, PaletteSideBar, SettingsSideBar, UploadSideBar } from '../components/DrawNavigation'
import styles from '../styles/Draw.module.css'
import useWindowSize from '../hooks/useWindowSize'
import Canvas from '../components/Canvas'
import Image from 'next/image'

// redesigning coloring page
async function changeColor(event, color) {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    context.strokeStyle = color
    context.fillStyle = color
    var colorButton = document.getElementById('palette').firstElementChild.nextElementSibling
    for (let i = 0; i < 9; i++) {
        colorButton.style.outline = 'none'
        colorButton = colorButton.nextElementSibling
    }
    event.currentTarget.style.outline = '2px solid #000000'
    document.getElementById('eraser').src = '/icons/eraser.svg'
    document.getElementById('pen').src = '/icons/open/pen.svg'
    await updateDrawing('h6svuOhdSue4m198cMqOYKvmBBK2', 'unqiueId', 'current', color)
}

async function changeTool(event, tool) {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    const button = event.currentTarget
    const image = button.firstElementChild
    if (image.src.includes('open')) {
        image.src = '/icons/' + tool + '.svg'
    } else {
        image.src = '/icons/open/' + tool + '.svg'
    }
    if (tool == 'eraser') {
        document.getElementById('pen').src = '/icons/pen.svg'
        context.strokeStyle = '#FFFFFF'
        context.fillStyle = '#FFFFFF'
    } else if (tool == 'pen') {
        document.getElementById('eraser').src = '/icons/eraser.svg'
        const drawing = await getDrawing('h6svuOhdSue4m198cMqOYKvmBBK2', 'unqiueId')
        context.strokeStyle = drawing.CURRENT
        context.fillStyle = drawing.CURRENT
    }
}
// each button will have a unique id that can be accessed by the changecolor function
function ColorButton({ color }) {
    return (
        <button className={styles.colorButton}
            style={{ backgroundColor: color }}
            onClick={(e) => changeColor(e, color)}>
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
            <div className={styles.shadow}></div>
        </div>
    )
}

export async function getServerSideProps() {
    //const drawing = await getDrawing('h6svuOhdSue4m198cMqOYKvmBBK2', 'unqiueId')
    //const user = await getUser('h6svuOhdSue4m198cMqOYKvmBBK2')
    var colors = ['#E74236', '#FF914D', '#FFDE59', '#59BD7C', '#0CC0DF', '#9E6EFF', '#FF88D1', '#000000']
    var user = {
        NAME: 'Georgie Smith',
        TITLE: 'Achievement/Title'
    }
    return (
        {props: {
            PALETTE: colors,
            CURRENT: '#000000',
            USER: user
        }}
    )
}

function clear(width, height) {
    const popup = document.getElementById('clear')
    popup.style.display = 'none'
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, width, height)
    var image = document.getElementById('backgroundImage')
    image.src = popup.alt
}

function Draw(props) {
    const { width, height } = useWindowSize()
    if (props) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {/*Navigation*/}
                <DrawSideBar user={props.USER}/>
                <DrawNavBar/>
                <PaletteSideBar palette={props.PALETTE} user={props.USER}/>
                <SaveSideBar user={props.USER}/>
                <UploadSideBar user={props.USER}/>
                <SettingsSideBar user={props.USER}/>
                
                {/*Drawing*/}
                <img
                    id='img'
                    style={{ display: 'none' }}
                />
                <img
                    id='backgroundImage'
                    width={width}
                    height={height - 75}
                    style={{ position: 'absolute', top: '75px' }}
                />
                <Canvas
                    width={width}
                    height={height}
                />
                <ToolBox colors={props.PALETTE}/>
                <Popup id='clear'>
                    <Header text='Clear the current canvas?'/>
                    <Button onClick={() => clear(width, height)} text='Clear canvas'/>
                </Popup>
            </div>
        )
    }
}

export default Draw