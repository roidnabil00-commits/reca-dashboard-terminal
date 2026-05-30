#!/usr/bin/env node
/**
 * generate-icons.js
 * Creates placeholder PNG icons for the PWA manifest.
 * Run: node generate-icons.js
 *
 * For production, replace these with your actual branded icons.
 * Recommended: use https://realfavicongenerator.net or https://maskable.app
 */

const { createCanvas } = require('canvas')
const fs = require('fs')
const path = require('path')

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
const outputDir = path.join(__dirname, 'public', 'icons')

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

sizes.forEach((size) => {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = '#0f2044'
  ctx.fillRect(0, 0, size, size)

  // Rounded corners mask (simulate rounded rect)
  const radius = size * 0.2
  ctx.globalCompositeOperation = 'destination-in'
  ctx.beginPath()
  ctx.moveTo(radius, 0)
  ctx.lineTo(size - radius, 0)
  ctx.quadraticCurveTo(size, 0, size, radius)
  ctx.lineTo(size, size - radius)
  ctx.quadraticCurveTo(size, size, size - radius, size)
  ctx.lineTo(radius, size)
  ctx.quadraticCurveTo(0, size, 0, size - radius)
  ctx.lineTo(0, radius)
  ctx.quadraticCurveTo(0, 0, radius, 0)
  ctx.closePath()
  ctx.fill()
  ctx.globalCompositeOperation = 'source-over'

  // Letter "R"
  ctx.fillStyle = '#ffffff'
  ctx.font = `bold ${Math.floor(size * 0.55)}px serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('R', size / 2, size / 2 + size * 0.03)

  const buffer = canvas.toBuffer('image/png')
  const filePath = path.join(outputDir, `icon-${size}x${size}.png`)
  fs.writeFileSync(filePath, buffer)
  console.log(`✓ Generated ${filePath}`)
})

console.log('\n✅ All icons generated in public/icons/')
console.log('💡 Replace with branded icons before production deployment.\n')
