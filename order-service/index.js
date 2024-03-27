import express from 'express'
import mongoose from 'mongoose'
import amqp from 'amqplib'
import OrderModel from './models/Order.js'

const app = express();
app.use(express.json());

var connection, channel;
const queueName1 = 'order-service-queue';
const queueName2 = 'produit-service-queue';

mongoose.connect(process.env.url_mongo)
    .then(() => {
        console.log('Connected to mongodb')
    })
    .catch((err) => {
        console.log('Unable to connect to mongodb')
    })

async function connectToRabbitMQ() {
    const amqpServer = process.env.url_rabbit
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue(queueName1);
    await channel.assertQueue(queueName2);
}

connectToRabbitMQ().then(() => {
    channel.consume(queueName1, (data) => {
        const products = JSON.parse(data.content.toString());
        console.log(products)
        const total = products.reduce((som,p) => som+p.price, 0)
        const order = {products, total}

        OrderModel.create(order).then((o) => {
           channel.sendToQueue(queueName2, Buffer.from(JSON.stringify(o)))
        })

        channel.ack(data)
    })
})

app.listen(process.env.port, (err) => {
    if (!err)
        console.log('Unable to start Server at 3000')
    else
        console.log('Server Started')
})