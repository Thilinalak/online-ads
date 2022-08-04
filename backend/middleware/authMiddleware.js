const jwt = require('jsonwebtoken')
const db = require('../models')

const User = db.users

const protect = async(req, res, next) => {

    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            // Get Token from Header
            token = req.headers.authorization.split(' ')[1]

            // Verify Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Get user from token'
            req.user = await User.findByPk(decoded.id)
            next()

        } catch (error) {
            // console.log(error);
            res.status(401).json({Error : 'Not Authorized Invalid Token !'})
        }
    }

    if(!token){
        res.status(401).json({Error: 'Not Authorized No Token !'})
    }
}

module.exports = protect