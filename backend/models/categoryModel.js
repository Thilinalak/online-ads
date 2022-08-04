module.exports  =(sequelize, DataTypes) =>{

    const category = sequelize.define('category',{
        category:{
            type: DataTypes.STRING,
            allowNull: false
        },
        
    },{
        timestamps: false
    })
    return category 
}