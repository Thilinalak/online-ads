const db = require('../models')

// @Decs View all ads to normal user
// @Route GET '/'
exports.showAllAds = async(req, res)=>{

    const allAds = await db.items.findAll({
        attributes: ['id', 'itemname', 'price','datetime'],
        include: ['images']
    })
    const categories = await db.categories.findAll()

    res.status(200).json({ ads :allAds, categories: categories})
} 

// @Decs Normal user view single ad
// @Route GET '/:itemid'
exports.viewSingleAd = async(req, res)=>{
    console.log(req.params.itemid);

    const singleAd = await db.items.findOne({
        where : { id: req.params.itemid},
        attributes: { exclude : ['isActive' ]},
        include: ['images']
    })
    singleAd ? res.status(200).json({message: 'Normal user view Signle Ad', ad: singleAd}) 
    : res.status(404).json({Error : 'Item Not Found !'})
}

