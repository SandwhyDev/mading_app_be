const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

const upload_storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, '../temp'))
	},
	filename: (req, file, cb) => {
		cb(null, uuidv4())
	},
})

const upload_middleware = multer({ storage: upload_storage })

module.exports = { upload_middleware }
