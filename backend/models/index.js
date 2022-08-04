const dbConfig  = require('../config/dbConfig') 

const {Sequelize , DataTypes} = require('sequelize')

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,{
        host: dbConfig.HOST,
        dialect: dbConfig.DIALECT,
        operatorsAliases : false,

        pool: {
            max : dbConfig.pool.max,
            min : dbConfig.pool.min,
            acquire : dbConfig.pool.acquire,
            idle : dbConfig.pool.idle,
        }
    }
)
// Athuenticate
sequelize.authenticate()
.then(() => console.log('Connected...'))
.catch(err => console.log('ERROR : ',err))

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.users = require('./userModel')(sequelize, DataTypes)
db.items = require('./itemModel')(sequelize, DataTypes)
db.categories = require('./categoryModel')(sequelize, DataTypes)
db.images = require('./imageModel')(sequelize, DataTypes)


db.sequelize.sync({force : false})
.then(() => console.log('yes re-sync done!'))


// 1 : M relation (user has many items)
db.users.hasMany(db.items,{
    foreignKey: 'user_id',
    as: 'user'
})
db.items.belongsTo(db.users,{
    foreignKey: 'user_id',
    as: 'user'
})


// 1:M Relation (item has many images)
db.items.hasMany(db.images,{
    foreignkey: 'item_id',
    as: 'item'
})
db.images.belongsTo(db.items, {
    foreignkey: 'item_id',
    as: 'item'
})


// 1:1 Relation (category item)
db.categories.hasOne(db.items, {
    foreignKey: 'category_id'
})
// db.items.belongsTo(db.categories,{
//     foreignKey: 'category_id'
// })

module.exports  = db