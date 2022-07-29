const express = require('express')
const dotenv = require('dotenv').config()
const cors =  require('cors')

const port = process.env.PORT || 5000

const app = express()

//middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true }))

app.use('/api/users', require('./routes/userRoutes'))

app.listen(port, () => console.log(`Server running on port ${port}... `))