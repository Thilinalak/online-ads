const db = require('../models')
const multer = require('multer')
const path = require('path')



// @Desc Add a post
// @Route POST /api/items/add-post
exports.addPost = async(req , res) =>{
    console.log('images ', req.files[0].path);

    const paths = []
    req.files.map((path, index)=> {
        const p = req.files[index].path
        paths.push(p)
    })
    console.log('pths ', paths);


    const {itemname, description , price, category_id} =  req.body
    if(!itemname || !description || !price ){
        res.status(400).json({Error: 'All Fields are Required !'})
    }else if(!category_id){
        res.status(400).json({Error: 'Please Select Category Related to Your Item !'})
    }else if(!req.files){
        res.status(400).json({Error: 'Please Upload Images !'})
    }else{
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
            req.files.map((path, index)=> {
                const p = req.files[index].path
                paths.push(p)
                images =  db.images.create({
                    imageURL: req.files[index].path,
                    itemId: newItem.id   
                   })
                   
            })
            if(images){
                res.status(201).json({
                    message: 'Your Item Successfully Posted !',
                    item: newItem,
                    images: images
                }) 
            }
             
        }else{
            res.status(400).json({Error : 'Item not Posted!'})
        }
    }
}

// @Decs Upload Images
// @Route POST api/items/add-post
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
}).array('imageURL', 2)



// @Decs getAll Categories
// @Route GET api/items/add-post
exports.getAllCategories = async(req, res) =>{

    const categories = await db.categories.findAll()
    res.status(200).json(categories)
}