import { useEffect, useRef } from 'react'
import styles from './BgCanvas.module.scss'

const BgCanvas = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const matrixChars = '01<>{}[];:/\\|=-+*&%$#@!~`'
    const radioChars = '░▒▓█▄▀■□▪▫'
    const fontSize = 14
    let columns = Math.floor(canvas.width / fontSize)
    const drops = new Array(columns).fill(0)
    const speeds = new Array(columns)
      .fill(0)
      .map(() => 0.3 + Math.random() * 0.4)
    const charTypes = new Array(columns)
      .fill(0)
      .map(() => (Math.random() > 0.8 ? 'radio' : 'matrix'))

    const noiseParticles = []
    for (let i = 0; i < 200; i++) {
      noiseParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: 0.5 + Math.random() * 2,
      })
    }

    function draw() {
      const fadeAlpha = 0.03 + Math.random() * 0.02
      ctx.fillStyle = `rgba(12, 12, 12, ${fadeAlpha})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < drops.length; i++) {
        const chars = charTypes[i] === 'radio' ? radioChars : matrixChars
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        const brightness =
          charTypes[i] === 'radio'
            ? 40 + Math.floor(Math.random() * 30)
            : 25 + Math.floor(Math.random() * 20)
        ctx.fillStyle = `rgb(${brightness}, ${brightness + (charTypes[i] === 'radio' ? 10 : 0)}, ${brightness})`
        ctx.font = `${fontSize}px monospace`
        ctx.fillText(char, x, y)

        if (y > canvas.height && Math.random() > 0.98) {
          drops[i] = 0
          charTypes[i] = Math.random() > 0.8 ? 'radio' : 'matrix'
          speeds[i] = 0.3 + Math.random() * 0.4
        }
        drops[i] += speeds[i]
      }

      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
      for (const p of noiseParticles) {
        if (Math.random() > 0.7) {
          ctx.fillRect(p.x, p.y, p.size, p.size)
        }
        p.y += p.speed
        if (p.y > canvas.height) {
          p.y = 0
          p.x = Math.random() * canvas.width
        }
      }

      if (Math.random() > 0.97) {
        const burstY = Math.random() * canvas.height
        const burstHeight = 2 + Math.random() * 8
        ctx.fillStyle = `rgba(255, 255, 255, ${0.02 + Math.random() * 0.05})`
        ctx.fillRect(0, burstY, canvas.width, burstHeight)
      }

      if (Math.random() > 0.98) {
        const lineY = Math.random() * canvas.height
        ctx.strokeStyle = `rgba(0, 255, 0, ${0.05 + Math.random() * 0.1})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(0, lineY)
        ctx.lineTo(canvas.width, lineY)
        ctx.stroke()
      }
    }

    const interval = setInterval(draw, 50)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.bgCanvas} />
}

export default BgCanvas
