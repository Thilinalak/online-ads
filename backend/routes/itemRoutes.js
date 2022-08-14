const express = require('express')
const router = express.Router()
const sellerItemController = require('../controllers/sellerItemController')
const normalUserController = require('../controllers/normalUserController')
const protect = require('../middleware/authMiddleware')

// Seller Routes
router.post('/add-post',protect,sellerItemController.uploadImages, sellerItemController.addPost)
router.get('/my-ads',protect, sellerItemController.myAds)
router.get('/select-ad-to-update/:itemid',protect, sellerItemController.viewToUpdateSelectedAd)
router.put('/update-ad/:itemid',protect, sellerItemController.updateSelectedAd)
router.put('/delete-ad/:itemid',protect, sellerItemController.deleteSelectedAd)

// Normal User Routes
router.get('/ads',normalUserController.showAllAds)
router.get('/ads/:itemid',normalUserController.viewSingleAd)
router.get('/ads/category/:categoryid',normalUserController.adsFilterByCategory)
router.post('/ads/search',normalUserController.searchAds)

module.exports = router