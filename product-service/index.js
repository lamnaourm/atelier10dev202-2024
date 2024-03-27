import express from 'express'
import mongoose from 'mongoose'
import productroute from './routes/product.js'

const app = express();
app.use(express.json());

mongoose.connect(process.env.url_mongo)
        .then(() => {
            console.log('Connected to mongodb')
        })
        .catch((err) => {
            console.log('Unable to connect to mongodb')
        })

app.use('/products', productroute)

app.listen(process.env.port, (err) => {
    if(!err)
        console.log('Unable to start Server at 3000')
    else 
        console.log('Server Started')
})