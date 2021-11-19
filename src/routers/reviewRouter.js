const router = require('express').Router()
const { validObjectId, authenticate } = require('../middleware')

const { list, getById, insert, remove, update, activeInactive } = require('../controllers/reviewController')

router.post('/', insert)
router.get('/', list)
router.get('/:id', validObjectId, getById)
router.put('/:id', validObjectId, update)
router.delete('/:id', validObjectId, remove)
router.put('/activeInactive/:id/:status', activeInactive)

module.exports = router
