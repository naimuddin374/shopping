const path = require('path')


const routes = [
    {
        path: '/api/orders',
        handler: require('./orderRouter')
    },
    {
        path: '/api/reviews',
        handler: require('./reviewRouter')
    },
    {
        path: '/api/products',
        handler: require('./productRouter')
    },
    {
        path: '/api/subcategories',
        handler: require('./subCategoryRouter')
    },
    {
        path: '/api/categories',
        handler: require('./categoryRouter')
    },
    {
        path: '/api/sizes',
        handler: require('./sizeRouter')
    },
    {
        path: '/api/colors',
        handler: require('./colorRouter')
    },
    {
        path: '/api/auth',
        handler: require('./authRouter')
    },
    {
        path: '/api/users',
        handler: require('./userRouter')
    },
    {
        path: '*',
        handler: (req, res) => {
            return res.sendFile(path.resolve(__dirname, '../../', 'public', 'index.html'))
        }
    },
    {
        path: '*',
        handler: (req, res) => res.send({ response: "404 Page Not Found!" }).status(200)
    }
]


module.exports = app => {
    routes.forEach(r => {
        app.use(r.path, r.handler)
    })
}