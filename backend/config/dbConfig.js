module.exports = {
    HOST : process.env.HOST,
    USER : process.env.USER,
    PASSWORD : process.env.PASSWORD,
    DB : process.env.DB,
    DIALECT : process.env.DIALECT,

    pool : {
        max : 10,
        min : 0,
        acquire : process.env.ACQUIRE,
        idle : process.env.IDLE,
    }
}