'use strict'
const express = require('express')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')

module.exports = function (app) {
  // Helmet
  app.use(helmet())
  // Rate Limiting
  const limit = rateLimit({
    max: 100, // max requests
    windowMs: 60 * 60 * 1000, // 1 Hour of 'ban' / lockout
    message: 'Too many requests' // message to send
  })
  app.use(limit) // Setting limiter all the route
  // Body Parser
  app.use(express.json({ limit: '400kb' })) // Body limit is 400kb
  // Data Sanitization against XSS attacks
  app.use(xss())
}
