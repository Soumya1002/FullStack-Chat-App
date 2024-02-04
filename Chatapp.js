const express = require('express')
const bodyParser = require('body-parser')
// app.use(express.static('public'))
require('dotenv').config()
const path = require('path')

const fs = require('fs')

const User = require('./Models/user-model')

const sequelize = require('./util/database')
const cors = require('cors')

const app = express()

// app.use(cors({
//     origin: 'http://localhost:4000',
//     // origin: 'http://127.0.0.1:5500/'    
//     //origin: '*'
// }))

app.use(cors())

app.use(bodyParser.json({extended:false}))

const signupRoute = require('./Routes/signup-route')
const loginRoute = require('./Routes/login-route')
const chatRoute = require('./Routes/chat-route')

app.use(signupRoute)
app.use(loginRoute)
app.use(chatRoute)


app.use((req, res) => {
    res.sendFile(path.join(__dirname, `public/${req.url}`))
})

User.hasMany(Chat)
Chat.belongsTo(User)

sequelize.sync()
.then(() => {
    app.listen(4000)
}) 
.catch(err => {
    console.log(err)
})