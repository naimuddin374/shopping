const router = require('express').Router()
const { validObjectId, authenticate } = require('../middleware')

const { list, getById, insert, remove, update, getByCatId, getBySubCatId, getBySearch } = require('../controllers/productController')


router.get('/', list)
router.get('/:id', validObjectId, getById)
router.get('/getByCatId/:id', validObjectId, getByCatId)
router.get('/getBySubCatId/:id', validObjectId, getBySubCatId)
router.get('/getBySearch', getBySearch)
router.post('/', [validObjectId, authenticate], insert)
router.put('/:id', [validObjectId, authenticate], update)
router.delete('/:id', [validObjectId, authenticate], remove)

module.exports = router
