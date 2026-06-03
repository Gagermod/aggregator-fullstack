import { useEffect, useRef } from 'react'
import styles from './NoiseCanvas.module.scss'

const NoiseCanvas = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    function resize() {
      canvas.width = window.innerWidth / 4 // меньше разрешение = быстрее
      canvas.height = window.innerHeight / 4
    }
    resize()
    window.addEventListener('resize', resize)

    function draw() {
      const imageData = ctx.createImageData(canvas.width, canvas.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255
        data[i] = value // R
        data[i + 1] = value // G
        data[i + 2] = value // B
        data[i + 3] = 255 // A
      }

      ctx.putImageData(imageData, 0, 0)
    }

    const interval = setInterval(draw, 100) // 10fps

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.noiseCanvas} />
}

export default NoiseCanvas
