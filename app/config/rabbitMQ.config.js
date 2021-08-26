'use strict'

const mqLib = require('amqplib')
const config = require('./environment.config')
const winston = require('./winston')
const rabbitMQHelper = require('../helpers/rabbitMQ.helper')

winston.info('Initializing RabbitMQ...')

let connection = ''
if (process.env.NODE_ENV === 'production') {
  connection = config.rabbitMQ.connection.production
} else if (process.env.NODE_ENV === 'staging') {
  connection = config.rabbitMQ.connection.staging
} else {
  connection = config.rabbitMQ.connection.development
}

mqLib.connect(process.env.RABBITMQ_CONNECTION || connection)
  .then(con => {
    winston.info('Successfully Connected to RabbitMQ.')
    return con.createChannel()
  })
  .then(channel => {
    channel.assertExchange(config.rabbitMQ.exchange, 'direct', { durable: true })
    channel.assertQueue(config.rabbitMQ.queue, { durable: true })
    config.rabbitMQ.binding_keys.forEach(bindingKey => {
      channel.bindQueue(config.rabbitMQ.queue, config.rabbitMQ.exchange, bindingKey)
    })
    channel.consume(config.rabbitMQ.queue, (message) => {
      if (message.content) {
        rabbitMQHelper.receiveMessage(message)
      }
    }, {
      noAck: true
    })
  })
  .catch(err => {
    console.log('Error in RabbitMQ: ', err)
  })
