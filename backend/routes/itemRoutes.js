const express = require('express')
const router = express.Router()
const itemController = require('../controllers/itemController')
const protect = require('../middleware/authMiddleware')

router.post('/add-post',protect,itemController.uploadImages, itemController.addPost)
router.get('/add-post', protect, itemController.getAllCategories)

module.exports = router