const router = require('express').Router()
const { validObjectId, authenticate } = require('../middleware')
const { uploadImage } = require('../utils/fileUpload')

const { list, getById, insert, remove, update } = require('../controllers/categoryController')



router.get('/', list)
router.get('/:id', validObjectId, getById)
router.post('/', [authenticate, uploadImage.single('image')], insert)
router.put('/:id', [validObjectId, authenticate, uploadImage.single('image')], update)
router.delete('/:id', [validObjectId, authenticate], remove)

module.exports = router
