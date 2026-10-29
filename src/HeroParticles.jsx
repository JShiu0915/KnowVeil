import React, { useEffect, useRef } from 'react'

/**
 * 首屏星点流动背景（particle network）。
 * - 星点缓慢漂移，邻近星点之间自动连出淡线
 * - 停在视口外 / 页签隐藏时自动暂停，不耗电
 * - prefers-reduced-motion 用户只渲染一帧静态图
 * - 配色跟随站点：墨色为主，品牌绿点缀
 */
const DOT = [19, 32, 26]
const ACCENT = [50, 141, 106]
const LINE = [19, 32, 26]
const LINK_DIST = 128

/* 体积云：预渲染成径向渐变贴图，每帧只做拖动，避免逐帧模糊的开销 */
const CLOUDS = [
  { color: ACCENT, radius: 340, alpha: 0.08, fx: 0.2, fy: 0.32, ax: 0.1, ay: 0.08, sx: 0.3, sy: 0.24, phase: 0 },
  { color: LINE, radius: 430, alpha: 0.04, fx: 0.8, fy: 0.6, ax: 0.11, ay: 0.09, sx: 0.22, sy: 0.19, phase: 2.1 },
  { color: ACCENT, radius: 250, alpha: 0.07, fx: 0.62, fy: 0.22, ax: 0.1, ay: 0.08, sx: 0.34, sy: 0.26, phase: 4.2 },
  { color: LINE, radius: 300, alpha: 0.03, fx: 0.34, fy: 0.78, ax: 0.08, ay: 0.1, sx: 0.24, sy: 0.3, phase: 1.2 },
]

const makeCloudSprite = (color, radius, alpha) => {
  const [r, g, b] = color
  const sprite = document.createElement('canvas')
  sprite.width = radius * 2
  sprite.height = radius * 2
  const ctx = sprite.getContext('2d')
  const grad = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius)
  grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`)
  grad.addColorStop(0.35, `rgba(${r},${g},${b},${alpha * 0.55})`)
  grad.addColorStop(0.7, `rgba(${r},${g},${b},${alpha * 0.18})`)
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, sprite.width, sprite.height)
  return sprite
}

export default function HeroParticles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cloudSprites = CLOUDS.map((cloud) => ({
      ...cloud,
      sprite: makeCloudSprite(cloud.color, cloud.radius, cloud.alpha),
    }))

    let width = 0
    let height = 0
    let particles = []
    let raf = 0
    let running = false
    let visible = true

    const rand = (min, max) => min + Math.random() * (max - min)

    const createParticles = () => {
      const count = Math.min(110, Math.round((width * height) / 16000))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: rand(-0.16, 0.16),
        vy: rand(-0.12, 0.12),
        r: rand(0.8, 2.1),
        alpha: rand(0.18, 0.5),
        twinkle: rand(0.4, 1.4),
        phase: rand(0, Math.PI * 2),
        color: Math.random() < 0.7 ? ACCENT : DOT,
      }))
    }

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      createParticles()
      if (reduced) draw(0)
    }

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height)
      const t = time / 1000

      const cloudScale = Math.min(1, width / 1280)
      for (const cloud of cloudSprites) {
        const x = width * cloud.fx + Math.sin(t * cloud.sx + cloud.phase) * width * cloud.ax
        const y = height * cloud.fy + Math.cos(t * cloud.sy + cloud.phase) * height * cloud.ay
        const size = cloud.radius * 2 * cloudScale
        ctx.drawImage(cloud.sprite, x - size / 2, y - size / 2, size, size)
      }

      for (const p of particles) {
        const twinkle = 0.65 + 0.35 * Math.sin(p.phase + t * p.twinkle)
        const [cr, cg, cb] = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${(p.alpha * twinkle).toFixed(3)})`
        ctx.fill()
      }

      ctx.lineWidth = 1
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 > LINK_DIST * LINK_DIST) continue
          const fade = 1 - Math.sqrt(d2) / LINK_DIST
          ctx.strokeStyle = `rgba(${LINE[0]},${LINE[1]},${LINE[2]},${(0.1 * fade).toFixed(3)})`
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }
    }

    const step = (time) => {
      if (!running) return
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < -20) p.x = width + 20
        if (p.x > width + 20) p.x = -20
        if (p.y < -20) p.y = height + 20
        if (p.y > height + 20) p.y = -20
      }
      draw(time)
      raf = requestAnimationFrame(step)
    }

    const start = () => {
      if (running || !visible || document.hidden || reduced) return
      running = true
      raf = requestAnimationFrame(step)
    }

    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas.parentElement)

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) start()
        else stop()
      },
      { threshold: 0 },
    )
    intersectionObserver.observe(canvas.parentElement)

    const onVisibilityChange = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibilityChange)

    resize()
    if (!reduced) start()

    return () => {
      stop()
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return <canvas ref={canvasRef} className="hero-particles" aria-hidden="true" />
}
