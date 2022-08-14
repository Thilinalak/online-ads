const db = require('../models')

// @Decs Show all ads to normal user
// @Route GET /ads/?page=1
exports.showAllAds = async(req, res)=>{

    const { page } = req.query;
    let  value = 0 ;
    page ? value = page - 1 : value = 1 - 1

    const allAds = await db.items.findAll({
        limit: 3,
        offset: value * 3,
        where : { isActive: true },
        attributes: ['id', 'itemname', 'price','datetime'],
        include: ['images']
    })
    const categories = await db.categories.findAll()

    res.status(200).json({ ads :allAds, categories: categories})
} 

// @Decs Normal user view single ad
// @Route GET /ads/:itemid
exports.viewSingleAd = async(req, res)=>{

    const singleAd = await db.items.findOne({
        where : { id: req.params.itemid},
        attributes: { exclude : ['isActive' ]},
        include: ['images']
    })
    const sellerInfo = await db.users.findOne({
        where : { id : singleAd.user_id},
        attributes: ['id','fname', 'mobile', 'city', 'email']
    })
    singleAd && sellerInfo ? res.status(200)
    .json({message: 'Normal user view Signle Ad', ad: singleAd, sellerInfo : sellerInfo}) 
    : res.status(404).json({Error : 'Item Not Found !'})
}

// @Desc normal user search
// @Route GET /api/search
exports.searchAds = async (req, res) =>{
    const { page } = req.query;
    let  value = 0 ;
    page ? value = page - 1 : value = 1 - 1
    const {searchingText} = req.body

    await db.items.findAll({
        limit: 3,
        offset: value * 3,
        where : { itemname : searchingText, isActive : true},
        attributes: ['id', 'itemname', 'price','datetime'],
        include: ['images']
    })
    .then((result) => {
        console.log(result.length);
        result.length !== 0 ? res.status(200).json({message : `Total ${result.length} Items Found`,SearchingAds :result})
        : res.status(404).json({Error : `No Items Found for ${searchingText} !` })
    })
}

// @Decs Normal user filter ads by category
// @Route GET /ads/category/:categoryid
exports.adsFilterByCategory = async(req, res)=>{
    const { page } = req.query;
    let  value = 0 ;
    page ? value = page - 1 : value = 1 - 1
    
    const allfilterAds = await db.items.findAll({
        limit: 3,
        offset: value * 3,
        where : { category_id: req.params.categoryid ,isActive: true },
        attributes: ['id', 'itemname', 'price','datetime'],
        include: ['images']
    })
    const selectedCategory = await db.categories.findOne({
        where : { id : req.params.categoryid}
    })
    const items = await db.items.findAll({
        where : { category_id: req.params.categoryid ,isActive: true },
       
    })
    const categories = await db.categories.findAll()

    allfilterAds.length !== 0  ? 
    res.status(200).json({ message: `Filter By ${selectedCategory.category} Category, Total ${items.length} Items Found `
    , ads :allfilterAds, categories: categories})
    : res.status(404).json({Error : `No Items Found For ${selectedCategory.category} Category !`})
}