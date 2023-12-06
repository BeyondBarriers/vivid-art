import { useDraw } from '../hooks/useDraw'

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
            width={width}
            height={height}
            onMouseDown={onCanvasMouseDown}
            ref={setCanvasRef}
            style={{ width: '100%', height: '100%' }}
        />
    )
}

export default Canvas