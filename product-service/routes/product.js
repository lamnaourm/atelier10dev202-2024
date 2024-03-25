import express from 'express'
import productModel from '../models/Product.js'

const routes = express.Router()

routes.post('/', (req, res) => {

    const product = req.body;

    productModel.create(product)
        .then((p) => {
            return res.json(p)
        })
        .catch((err) => {
            return res.status(510).send('erreur creation product')
        })
})

routes.post('/buy', (req, res) => {
    
})

export default routes