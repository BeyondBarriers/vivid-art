import { useState, useEffect } from 'react'

function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    })
    useEffect(() => {
        function handleResize() {
            if (document.getElementById('canvas')) {
                var canvas = document.getElementById('canvas')
                var ctx = canvas.getContext('2d')
                var dataURL = canvas.toDataURL('image/png')
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                })
                var img = document.getElementById('img')
                img.src = dataURL
                img.onload = function () {
                    ctx.drawImage(img, 0, 0);
                }
            }
        }
        window.addEventListener("resize", handleResize)
        handleResize()
        return () => window.removeEventListener("resize", handleResize)
    }, [])
    return windowSize
}

export default useWindowSize