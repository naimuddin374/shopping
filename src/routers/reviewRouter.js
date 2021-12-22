const router = require('express').Router()
const { validObjectId, authenticate } = require('../middleware')

const { list, getById, insert, remove, update, activeInactive } = require('../controllers/reviewController')

router.get('/', authenticate, list)
router.get('/:id', [validObjectId, authenticate], getById)
router.post('/', authenticate, insert)
router.put('/:id', [validObjectId, authenticate], update)
router.delete('/:id', [validObjectId, authenticate], remove)
router.put('/activeInactive/:id/:status', [authenticate, validObjectId], activeInactive)

module.exports = router
