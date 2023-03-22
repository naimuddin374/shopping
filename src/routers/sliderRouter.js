const router = require('express').Router()
const { validObjectId, authenticate } = require('../middleware')

const { list, getById, insert, remove, update } = require('../controllers/sliderController')
const { uploadImage } = require('../utils/fileUpload')


router.get('/', list)
router.get('/:id', validObjectId, getById)
router.post('/', [authenticate, uploadImage.single('image')], insert)
router.put('/:id', [validObjectId, authenticate, uploadImage.single('image')], update)
router.delete('/:id', [validObjectId, authenticate], remove)

module.exports = router
