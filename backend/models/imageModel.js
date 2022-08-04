module.exports = (sequelize, DataTypes) =>{

    const image = sequelize.define('image',{
        imageURL: DataTypes.STRING,
    },{timestamps: false})

    return image
}