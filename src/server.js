require('dotenv').config()
const express = require('express')
// const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose');
const config = require('config');
const { logger } = require('./utils')
const { passport, morgan } = require('./middleware')
const setRoute = require("./routers");




const app = express()
app.use(cors())
app.use(express.static(path.join(__dirname, '../', 'public')))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


// USE MIDDLEWARE 
morgan(app)
passport(app)

// ROUTE
setRoute(app)



app.get('/', (req, res) => {
    console.log('OK')
    return res.status(200).json({ message: 'Welcome to our application!' })
})

app.use((req, res, next) => {
    const error = new Error('404 Page Not Found!')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    if (error.status === 404) {
        return res.status(404).json({
            message: error.message,
            status: 404
        })
    }

    return res.status(500).json({
        message: 'Internal Server Error!',
        status: 500
    })
})


// SERVER LISTEN 
let server = app.listen(config.get('PORT'), () => {
    let port = server.address().port
    logger.info(`Listening on port ${port} & env ${config.env}`)
});



mongoose.connect(`${config.get('DB_CONNECTION')}`,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        const msg = `Database Connected & Application Listening on port=${config.get('PORT')}`
        logger.info(msg)
    }
)

