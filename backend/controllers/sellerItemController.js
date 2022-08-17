const db = require('../models')
const multer = require('multer')
const path = require('path')


// @Desc    Add a post
// @Method  POST
// @Route   /api/items/add-post
exports.addPost = async(req , res) =>{
    console.log('images:: ', req.files);

    const {itemname, description , price, category_id} =  req.body
    if(!itemname || !description || !price ){
        res.status(400).json({Error: 'All Fields are Required !'})
    }else if(!category_id){
        res.status(400).json({Error: 'Please Select Category Related to Your Item !'})
    }else if(!req.files){
        res.status(400).json({Error: 'Please Upload Images !'})
    }
    else{
        // Add Item
        const newItem = await db.items.create({
            itemname,
            description,
            price,
            datetime: new Date().toLocaleString("en-Us", {timeZone: 'Asia/Colombo'}),
            isActive: true,
            user_id: req.user.id,
            category_id
        })
        if(newItem){
            // Save Images
            let images = []
            req.files.map(img=>{
                 const image = {
                    imageURL: 'uploadImages/'+ img.filename,
                    itemId: newItem.id,
                }
                images.push(image)
            })

            await db.images.bulkCreate(images)
            .then( async() => {
                const savedItem  = await db.items.findOne({
                    where : { id : newItem.id},
                include: ['images'] 
                })
                
               res.status(201).json({
                    message: 'Your Ad Successfully Posted !',
                    item: savedItem,
                }) 
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json({Error : 'Item not Posted!'})
            })
        }else{
            res.status(400).json({Error : 'Item not Posted!'})
        }
    }
}

// @Desc Upload Images Controller
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './backend/public/uploadImages')
    },
    filename: (req, file, cb) =>{
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

exports.uploadImages = multer({
    storage: storage,
    limits: {fileSize: '10000000'},
    fileFilter: (req, file, cb)=>{
        const fileTypes = /jpeg|jpg|png/
        const mimeType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        if(mimeType && extname){
            return cb (null, true)
        }
        cb('Please Upload jpeg or jpg or png format images')
    }
}).array('imageURL',3)

// @Desc    Show seller all category
// @Method  GET
// @Route   /api/items/add-post
exports.getAllCategories = async (req, res) =>{

    const categories = await db.categories.findAll()
    res.status(200).json({ 
        message: `Categories`,categories: categories})
}

// @Desc    Get all ads of seller
// @Method  GET
// @Route   /api/items/my-ads
exports.myAds = async(req, res)=>{
    const { page } = req.query;
    let  value = 0 ;
    page ? value = page - 1 : value = 1 - 1

    const totalAds = await db.items.count({
        where : { user_id : req.user.id ,isActive: true },
       
    })
    const allMyPosts = await db.items.findAll({
        limit: 3,
        offset: value * 3,
        where : { 
            user_id : req.user.id, 
            isActive : true },
            include: ['images']
        })

        totalAds > 0 ? res.status(200).json({
        message : `Seller Posted Ads, Total ${totalAds} ads`, 
        Pages: `page ${value+1} of ${Math.ceil(totalAds / 3)} page(s)`,
        ads: allMyPosts})
        : res.status(404).json({Error : `You haven't Posted any Ads !` })
}

// @Desc    View seller selected ad to update
// @Method  GET
// @Route   /api/items/select-ad-to-update/:itemid
exports.viewToUpdateSelectedAd = async(req, res)=>{

    const item = await db.items.findOne({
        where: {id: req.params.itemid},
        attributes: ['id', 'itemname','description', 'price','category_id'],
        include: ['images']
    })
    item ? res.status(200).json({message: 'Update your ad', Ad: item})
    : res.status(404).json({Error : `You haven't Selected any Ad to update !` })
}

// @Desc    Update selected Ad
// @Method  PUT
// @Route   /api/items/update-ad/:itemid
exports.updateSelectedAd = async(req, res)=>{

    const item = await db.items.update(req.body,{ 
        where : { id : req.params.itemid}
    })
   
    const updatedItem = await db.items.findOne({
        where: {id: req.params.itemid},
        attributes: ['id', 'itemname','description', 'price','category_id'],
        include: ['images']
    })
    updatedItem ? res.status(200).json({message: 'You have Successfully Updated your ad', Ad: updatedItem})
    : res.status(404).json({Error : `Not Updated !` })
}

// @Desc    Update selected Image
// @Method  PUT
// @Route   /api/items/update-image/:imageid
exports.updateSelectedImage = async(req, res)=>{

    const imge = await db.images.update({imageURL :'uploadImages/'+req.files[0].filename},{ 
        where : { id : req.params.imageid}
    })
    imge ?
        res.status(200).json({message: 'You have Successfully Updated your Image',})
    :
        res.status(404).json({Error : `Not Updated !` })
}

// @Desc    Delete selected Ad
// @Method  PUT
// @Route   /api/items/delete-ad/:itemid
exports.deleteSelectedAd = async(req, res)=>{

    await db.items.update({isActive : false},{ 
        where : { id : req.params.itemid}
    }).then( () => {
        res.status(200).json({message: 'You have Successfully Deleted your Ad'})
    }).catch((err) => {
        console.log(err);
        res.status(404).json({Error : `Not Deleted !` })
    })
}

// @Desc    Delete selected Image
// @Method  DELETE
// @Route   /api/items/delete-image/:imageid
exports.deleteSelectedImage = async(req, res)=>{

    await db.images.destroy({ 
        where : { id : req.params.imageid}
    }).then( () => {
        res.status(200).json({message: 'You have Successfully Deleted your Image'})
    }).catch((err) => {
        console.log(err);
        res.status(404).json({Error : `Not Deleted !` })
    })
}



