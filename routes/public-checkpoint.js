require('dotenv').config()
const express = require('express')
const sha256 = require('js-sha256').sha256
const PDFDocument = require('pdfkit')
const QRCode = require('qrcode')

const checkpointKeyLength = Number(process.env['CHECKPOINT_KEY_LENGTH'])

const publicCheckpointApiRouter = express.Router()

publicCheckpointApiRouter.get('/', async (req, res) => {
  const doc = new PDFDocument()
  const checkpointKey = sha256(String(Math.random())).substring(0, checkpointKeyLength)
  const appLink = process.env.APP_URL
  const checkpointLink = `${appLink}/?checkpoint=${checkpointKey}`
  const checkpointQrCodeUrl = await QRCode.toDataURL(checkpointLink, { margin: 0, scale: 20 })
  const checkpointQrCodeImg = Buffer.from(checkpointQrCodeUrl.replace('data:image/png;base64,', ''), 'base64')
  const websiteLink = process.env.ABOUT_URL
  const websiteQRCodeUrl = await QRCode.toDataURL(websiteLink, { margin: 0, scale: 4 })
  const websiteQrCodeImg = Buffer.from(websiteQRCodeUrl.replace('data:image/png;base64,', ''), 'base64')
  doc.image('./public-checkpoint/track-covid.png', 0, 0, { width: 600 })
  doc.image(checkpointQrCodeImg, 55, 325, { width: 300 })
  doc.image(websiteQrCodeImg, 378, 668.5, { width: 37 })
  doc.pipe(res)
  doc.end()
})

module.exports = publicCheckpointApiRouter
