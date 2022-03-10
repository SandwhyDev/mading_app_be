const { request, response } = require('express')
const jwt = require('jsonwebtoken')
const path = require('path')
require('dotenv').config()
const fs = require('fs')
const cekUsers = async (req = request, res = response, next) => {
	try {
		const file = await req.file
		const auth = req.headers.authorization
		if (!auth) {
			fs.unlinkSync(path.join(__dirname, `../temp/${file.filename}`))
			res.sendStatus(401)
			return
		}

		const token = auth.split(' ')[1]
		const verifToken = await jwt.verify(token, process.env.API_SECRET)

		if (!verifToken) {
			fs.unlinkSync(path.join(__dirname, `../temp/${file.filename}`))
			res.sendStatus(401)
			return
		}

		req.body.user_id = await verifToken.user_uuid

		console.log(verifToken)
		next()
	} catch (error) {
		const file = await req.file
		fs.unlinkSync(path.join(__dirname, `../temp/${file.filename}`))
		res.sendStatus(401)
	}
}

module.exports = cekUsers
