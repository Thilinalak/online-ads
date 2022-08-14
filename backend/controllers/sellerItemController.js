const db = require('../models')
const multer = require('multer')
const path = require('path')



// @Desc Add a post
// @Route POST /api/items/add-post
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
                    imageURL: img.path,
                    itemId: newItem.id,
                }
                images.push(image)
            })

            await db.images.bulkCreate(images)
            .then( () => {
               res.status(201).json({
                    message: 'Your Ad Successfully Posted !',
                    item: newItem,
                }) 
                
            })
            .catch(() => {
                res.status(400).json({Error : 'Item not Posted!'})
            })
            
             
        }else{
            res.status(400).json({Error : 'Item not Posted!'})
        }
    }
}

// @Decs Upload Images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './backend/uploadImages')
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

// @Decs Get all ads of seller
// @Route GET /api/items/my-ads
exports.myAds = async(req, res)=>{

    const allMyPosts = await db.items.findAll({ 
        where : { 
            user_id : req.user.id, 
            isActive : true },
            include: ['images']})
    allMyPosts ? res.status(200).json({message : 'Seller Posted Ads', ads: allMyPosts})
    : res.status(404).json({Error : `You haven't Posted any Ads !` })
}

// @Decs View seller selected ad to update
// @Route GET /api/items/select-ad-to-update/:itemid
exports.viewToUpdateSelectedAd = async(req, res)=>{

    const item = await db.items.findOne({
        where: {id: req.params.itemid},
        attributes: ['id', 'itemname','description', 'price','category_id'],
        include: ['images']
    })
    item ? res.status(200).json({message: 'Update your ad', Ad: item})
    : res.status(404).json({Error : `You haven't Selected any Ad to update !` })
}

// @Decs  Update selected Ad
// @Route PUT /api/items/update-ad/:itemid
exports.updateSelectedAd = async(req, res)=>{
console.log(req.params.itemid);
console.log(req.body);

    const Item = await db.items.update(req.body,{ 
        where : { id : req.params.itemid}
    })
    // req.files.map((img)=>{
    //     db.images.update(img.path, { 
    //         where: {itemId : req.params.itemid}
    //     })
    // })

    const updatedItem = await db.items.findOne({
        where: {id: req.params.itemid},
        attributes: ['id', 'itemname','description', 'price','category_id'],
        include: ['images']
    })
    updatedItem ? res.status(200).json({message: 'You have Successfully Update your ad', Ad: updatedItem})
    : res.status(404).json({Error : `Not Updated !` })
    
}


// @Decs  Delete selected Ad
// @Route PUT /api/items/delete-ad/:itemid
exports.deleteSelectedAd = async(req, res)=>{
    console.log(req.params.itemid);

    await db.items.update({isActive : false},{ 
        where : { id : req.params.itemid}
    }).then( () => {
        res.status(200).json({message: 'You have Successfully Deleted your Ad'})
    }).catch(() => {
        res.status(404).json({Error : `Not Deleted !` })
    })

}



