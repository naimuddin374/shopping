const router = require('express').Router()
const { validObjectId, authenticate } = require('../middleware')

const { list, getById, insert, remove, update, changeStatus, myOrder } = require('../controllers/orderController')

router.get('/', authenticate, list)
router.get('/myOrder', authenticate, myOrder)
router.get('/:id', [validObjectId, authenticate], getById)
router.post('/', authenticate, insert)
router.put('/:id', [validObjectId, authenticate], update)
router.delete('/:id', [validObjectId, authenticate], remove)
router.put('/changeStatus/:id/:status', [validObjectId, authenticate], changeStatus)

module.exports = router
