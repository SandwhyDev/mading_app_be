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

const user_routes = express.Router()

// CREATE USER
user_routes.post('/user_create', async (req, res) => {
	try {
		const { email, password } = await req.body
		const checkEmail = await ps.users.findUnique({
			where: {
				email: email,
			},
		})

		if (checkEmail) {
			res.status(400).json({
				success: false,
				response: 'email sudah ada',
			})
			return
		}

		const createUser = await ps.users.create({
			data: {
				email: email,
				password: bcryptjs.hashSync(password, salt),
				uuid: uuidv4(),
			},
		})

		res.status(201).json({
			success: true,
			response: 'berhasil register',
		})
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message,
		})
	}
})

// USER LOGIN
user_routes.post('/user_login', async (req, res) => {
	try {
		const { email, password } = await req.body

		const findEmail = await ps.users.findUnique({
			where: {
				email: email,
			},
		})

		if (!findEmail) {
			res.status(404).json({
				success: false,
				response: 'email tidak ditemukan',
			})
			return
		}

		const cekPassword = await bcryptjs.compareSync(password, findEmail.password)

		if (!cekPassword) {
			res.status(401).json({
				success: false,
				response: 'password salah',
			})
			return
		}

		// generated token
		const token = jwt.sign(
			{
				app_name: 'mading_app',
				user_email: findEmail.email,
				user_uuid: findEmail.uuid,
				createdAt: moment().format('DD-MM-YYYY hh:mm:ss'),
			},
			process.env.API_SECRET,
			{
				expiresIn: '1d',
			}
		)
		res.status(200).json({
			success: true,
			response: 'berhasil login',
			token: token,
		})
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message,
		})
	}
})

// USER READ
user_routes.get('/user_read', async (req, res) => {
	try {
		const result = await ps.users.findMany()
		res.status(201).json({
			success: true,
			query: result,
		})
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message,
		})
	}
})

module.exports = user_routes
