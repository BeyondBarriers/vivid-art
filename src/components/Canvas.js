import { useDraw } from '../hooks/useDraw'
import { useState } from 'react'

const Canvas = ({ width, height }) => {
    const { setCanvasRef, onCanvasMouseDown } = useDraw(onDraw)
    function onDraw(ctx, point, prevPoint) {
        drawLine(prevPoint, point, ctx, 20)
    }
    function drawLine(start, end, ctx, width) {
        start = start ?? end
        ctx.beginPath()
        ctx.lineWidth = width
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(start.x, start.y, width / 2, 0, 2 * Math.PI)
        ctx.fill()
    }
    return (
        <canvas
            id='canvas'
            title='Untitled Drawing'
            width={width}
            height={height-75}
            onMouseDown={onCanvasMouseDown}
            ref={setCanvasRef}
            style={{ position: 'absolute', top: '75px' }}
        />
    )
}

export default Canvas