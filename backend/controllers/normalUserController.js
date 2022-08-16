const db = require('../models')

// @Desc    Show all ads to normal user
// @Method  GET
// @Route   /ads/?page=1
exports.showAllAds = async(req, res)=>{

    const { page } = req.query;
    let  value = 0 ;
    page ? value = page - 1 : value = 1 - 1

    const totalAds = await db.items.count({
        where : { isActive: true }
    })

    const allAds = await db.items.findAll({
        limit: 3,
        offset: value * 3,
        where : { isActive: true },
        attributes: ['id', 'itemname', 'price','datetime'],
        include: ['images']
    })
    const categories = await db.categories.findAll()

    let totalpages = Math.ceil(totalAds / 3)
    res.status(200).json({ 
        pages: `page ${value+1} of ${totalpages} page(s)`,
        ads :allAds, categories: categories})
} 

// @Desc    Normal user view single ad
// @Method  GET
// @Route   /ads/:itemid
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

// @Desc    Normal user search
// @Method  GET
// @Route   /api/search
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
        let totalpages = Math.ceil(result.length / 3)
        
        result.length !== 0 ? res.status(200).json({
            message : `Total ${result.length} Items Found`,
            Pages: `page ${value+1} of ${Math.ceil(totalpages / 3)} page(s)`,
            SearchingAds :result})
        : res.status(404).json({Error : `No Items Found for ${searchingText} !` })
    })
}

// @Desc    Normal user filter ads by category
// @Method  GET
// @Route   /ads/category/:categoryid
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
    const items = await db.items.count({
        where : { category_id: req.params.categoryid ,isActive: true },
       
    })
    const categories = await db.categories.findAll()

    allfilterAds.length !== 0  ? 
    res.status(200).json({ 
        message: `Filter By ${selectedCategory.category} Category, Total ${items} Items Found `,
        Pages: `page ${value+1} of ${Math.ceil(items / 3)} page(s)`, 
        ads :allfilterAds, categories: categories})
    : res.status(404).json({Error : `No Items Found For ${selectedCategory.category} Category !`})
}