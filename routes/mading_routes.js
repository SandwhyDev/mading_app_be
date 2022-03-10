const express = require('express')
const path = require('path')
const fs = require('fs')
require('dotenv').config()
const cryptojs = require('crypto-js')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const ps = require('../prisma/connection')
const salt = bcryptjs.genSaltSync(10)
const { v4: uuidv4 } = require('uuid')
const moment = require('moment')
const { upload_middleware } = require('../libs/upload_services')
const cloudinary = require('../libs/cloudinary_services')
const cekUsers = require('../middleware/cekUsers')

const mading_routes = express.Router()

mading_routes.post('/mading_create', upload_middleware.single('photo'), cekUsers, async (req, res) => {
	try {
		const data = await req.body
		const file = await req.file
		const uploadToCloudinary = await cloudinary.uploader.upload(path.join(__dirname, `../temp/${file.filename}`), {
			use_filename: true,
			folder: 'mading_app/mading_images',
			public_id: file.filename,
		})

		const createMading = await ps.madings.create({
			data: {
				user_id: data.user_id,
				content: data.content,
				image: uploadToCloudinary.secure_url,
			},
		})

		res.status(201).json({
			success: true,
			msg: createMading,
		})
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message,
		})
	}
})

module.exports = mading_routes
