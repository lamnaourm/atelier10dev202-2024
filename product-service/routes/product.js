import express from 'express'
import amqp from 'amqplib'
import productModel from '../models/Product.js'

const routes = express.Router()

var connection, channel;
const queueName1='order-service-queue';
const queueName2='produit-service-queue';

async function connectToRabbitMQ() {
    const amqpServer = process.env.url_rabbit;
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue(queueName1);
    await channel.assertQueue(queueName2);
 }

 connectToRabbitMQ().then(() => {
    console.log('Connected to Rabbit MQ')
 })

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
    const list = req.body;

    productModel.find({'_id':{$in:list}})
        .then((products) => {
            channel.sendToQueue(queueName1, Buffer.from(JSON.stringify(products)))

            channel.consume(queueName2, (data) => {
                res.json(JSON.parse(data.content.toString()))

                channel.ack(data)
            })
        })
        .catch((err) => {
            return res.status(510).send('erreur' + err)
        })
})

export default routes