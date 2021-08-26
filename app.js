'use strict'

// Get dependencies
const ip = require('ip');
const express = require('express')
// const socket = require('socket.io')
const http = require('http')
const passport = require('./app/config/passport')
const app = express()

app.get('/api/v1/auth/health', function (req, res) {
  return res.status(200).send('Auth micro-service working 100%... \n 19 August, 2020 - 4:19 PM')
})
global.winston = require('./app/config/winston')
// Initialize Express
require('./app/config/express')(app, passport)

// Initializing socket io
// require('./app/config/socket.config')(app)

// Initializing sequelize
require('./app/config/sequelize.config')

// Initializing Security Dependencies.
require('./app/config/secure')(app)

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3001'

app.set('port', port)

/**
 * Create HTTP server.
 */

const server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */
console.log('Going to listen on port:', port)
server.listen(port, () => { console.log(`API running on ${ip.address()}:${port}`) })
console.log('After listen on port:', port)

module.exports = app
