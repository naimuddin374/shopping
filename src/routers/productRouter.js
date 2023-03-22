const router = require('express').Router()
const { validObjectId, authenticate } = require('../middleware')
const { list, getById, insert, remove, update, getByCatId, getBySubCatId, getBySearch, getBestSelling, getTrending } = require('../controllers/productController')
const { uploadImage } = require('../utils/fileUpload')



router.get('/best-selling', getBestSelling)
router.get('/trending', getTrending)
router.get('/getByCatId/:id', validObjectId, getByCatId)
router.get('/getBySubCatId/:id', validObjectId, getBySubCatId)
router.get('/getBySearch', getBySearch)
router.post('/', [authenticate, uploadImage.single('image')], insert)
router.put('/:id', [validObjectId, authenticate, uploadImage.single('image')], update)
router.delete('/:id', [validObjectId, authenticate], remove)
router.get('/:id', validObjectId, getById)
router.get('/', list)

module.exports = router
