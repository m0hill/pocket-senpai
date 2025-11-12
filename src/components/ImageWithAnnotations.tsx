'use client'

import { useEffect, useRef, useState } from 'react'

interface BoundingBox {
  xMin: number
  yMin: number
  xMax: number
  yMax: number
}

interface Point {
  x: number
  y: number
}

interface ImageWithAnnotationsProps {
  imageUrl: string
  boundingBoxes?: BoundingBox[]
  points?: Point[]
  objectLabel?: string
}

export function ImageWithAnnotations({
  imageUrl,
  boundingBoxes = [],
  points = [],
  objectLabel = 'object',
}: ImageWithAnnotationsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const img = imageRef.current
    const canvas = canvasRef.current
    if (!img || !canvas) return

    const handleLoad = () => {
      // Set canvas dimensions to match image
      const displayWidth = img.clientWidth
      const displayHeight = img.clientHeight

      setDimensions({ width: displayWidth, height: displayHeight })

      canvas.width = displayWidth
      canvas.height = displayHeight

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw bounding boxes
      if (boundingBoxes.length > 0) {
        ctx.strokeStyle = '#10b981' // green-500
        ctx.lineWidth = 3
        ctx.font = '14px Inter, system-ui, sans-serif'
        ctx.fillStyle = '#10b981'

        boundingBoxes.forEach((box, index) => {
          const x = box.xMin * displayWidth
          const y = box.yMin * displayHeight
          const width = (box.xMax - box.xMin) * displayWidth
          const height = (box.yMax - box.yMin) * displayHeight

          // Draw rectangle
          ctx.strokeRect(x, y, width, height)

          // Draw label background
          const label = `${objectLabel} ${index + 1}`
          const textMetrics = ctx.measureText(label)
          const textHeight = 20

          ctx.fillStyle = '#10b981'
          ctx.fillRect(x, y - textHeight, textMetrics.width + 8, textHeight)

          // Draw label text
          ctx.fillStyle = '#ffffff'
          ctx.fillText(label, x + 4, y - 6)
        })
      }

      // Draw points
      if (points.length > 0) {
        points.forEach((point, index) => {
          const x = point.x * displayWidth
          const y = point.y * displayHeight

          // Draw outer circle
          ctx.beginPath()
          ctx.arc(x, y, 8, 0, 2 * Math.PI)
          ctx.fillStyle = '#ef4444' // red-500
          ctx.fill()
          ctx.strokeStyle = '#ffffff'
          ctx.lineWidth = 2
          ctx.stroke()

          // Draw inner circle
          ctx.beginPath()
          ctx.arc(x, y, 3, 0, 2 * Math.PI)
          ctx.fillStyle = '#ffffff'
          ctx.fill()

          // Draw label
          ctx.font = '12px Inter, system-ui, sans-serif'
          const label = `${objectLabel} ${index + 1}`
          const textMetrics = ctx.measureText(label)

          // Label background
          ctx.fillStyle = '#ef4444'
          ctx.fillRect(x + 12, y - 10, textMetrics.width + 8, 18)

          // Label text
          ctx.fillStyle = '#ffffff'
          ctx.fillText(label, x + 16, y + 3)
        })
      }
    }

    if (img.complete) {
      handleLoad()
    } else {
      img.addEventListener('load', handleLoad)
    }

    return () => {
      img.removeEventListener('load', handleLoad)
    }
  }, [imageUrl, boundingBoxes, points, objectLabel])

  return (
    <div className="relative inline-block">
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Annotated image"
        className="max-w-full h-auto rounded-lg"
        style={{ maxHeight: '500px' }}
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: dimensions.width || 'auto',
          height: dimensions.height || 'auto',
        }}
      />
    </div>
  )
}
