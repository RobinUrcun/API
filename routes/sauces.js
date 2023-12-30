const express = require('express')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer')
const router = express.Router()
const saucesCtrl = require('../controllers/sauces')

router.get('/', auth, saucesCtrl.getAllSauces )

router.get('/:id', auth, saucesCtrl.getASauce)

router.post('/', auth, multer, saucesCtrl.createSauce)

router.put('/:id', auth, multer, saucesCtrl.modifyASauce)

router.delete('/:id', auth, saucesCtrl.deleteASauce)

router.post('/:id/like', auth, saucesCtrl.likeASauce)

module.exports = router