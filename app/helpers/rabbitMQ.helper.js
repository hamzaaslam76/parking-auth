'use strict'

const mqLib = require('amqplib')
const config = require('../config/environment.config')

let connection
if (process.env.NODE_ENV === 'production') {
  connection = config.rabbitMQ.connection.production
} else if (process.env.NODE_ENV === 'staging') {
  connection = config.rabbitMQ.connection.staging
} else {
  connection = config.rabbitMQ.connection.development
}

const sendMessage = (message, route) => {
  console.log('Sending Message')
  mqLib.connect(process.env.RABBITMQ_CONNECTION || connection)
    .then(con => {
      con.createChannel()
        .then(channel => {
          channel.assertExchange(config.rabbitMQ.exchange, 'direct', { durable: true })
          channel.publish(config.rabbitMQ.exchange, route, Buffer.from(JSON.stringify(message)))
          console.log('Message published to RabbitMQ ', message)
        })
      setTimeout(() => {
        con.close()
      }, 500)
    })
    .catch(err => {
      console.log('Error in connecting to RabbitMQ ', err)
    })
}

const receiveMessage = (message) => {
  console.log('Message consumed from RabbitMQ ', JSON.parse(message.content))
}

module.exports = {
  sendMessage,
  receiveMessage
}
