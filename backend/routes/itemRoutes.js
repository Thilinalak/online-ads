const express = require('express')
const router = express.Router()
const sellerItemController = require('../controllers/sellerItemController')
const normalUserController = require('../controllers/normalUserController')
const protect = require('../middleware/authMiddleware')

// Seller Routes
router.post('/add-post',protect,sellerItemController.uploadImages, sellerItemController.addPost)
router.get('/my-posts',protect, sellerItemController.myPosts)
router.get('/select-post-to-update/:itemid',protect, sellerItemController.viewToUpdateSelectedItem)
router.put('/update-post/:itemid',protect, sellerItemController.updateSelectedItem)

// Normal User Routes
router.get('/ads',normalUserController.showAllAds)
router.get('/ads/:itemid',normalUserController.viewSingleAd)
router.get('/category/:categoryid',normalUserController.adFilterByCategory)

module.exports = router