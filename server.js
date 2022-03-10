const express = require('express')
const cors = require('cors')
require('dotenv').config()
const path = require('path')
const fs = require('fs')
const cloudinary_routes = require('./routes/cloudinary_routes')
const user_routes = require('./routes/user_routes')
const mading_routes = require('./routes/mading_routes')

const app = express()
const { PORT } = process.env

//middleware
app.use(cors())
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: false }))

//routes
app.use('/api', cloudinary_routes)
app.use('/api', user_routes)
app.use('/api', mading_routes)

//listener
app.listen(PORT, '0.0.0.0', () => {
	console.log(`
    LISTENED TO PORT ${PORT}
    `)
})
