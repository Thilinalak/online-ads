
module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('user', {
        fname: {
            type : DataTypes.STRING,
            allowNull: false
        },
        mobile: {
            type : DataTypes.INTEGER,
            allowNull: false
        },
        city: {
            type : DataTypes.STRING,
            allowNull: false
        },
        email: {
            type : DataTypes.STRING,
            allowNull: false
        },
        password: {
            type : DataTypes.STRING,
            allowNull: false
        },
    })

    return User
}