const router = require('express').Router()
const { validObjectId, authenticate } = require('../middleware')

const { list, getById, insert, remove, update } = require('../controllers/categoryController')
const fileUpload  = require('../utils/fileUpload')

router.get('/', authenticate, list)
router.get('/:id', validObjectId, getById)
router.post('/', [authenticate, fileUpload.single('image')], insert)
router.put('/:id', [validObjectId, authenticate], update)
router.delete('/:id', [validObjectId, authenticate], remove)

module.exports = router
