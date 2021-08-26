'use strict'
const SERVER_RESPONSE = require('../config/serverResponses')
const winston = require('../config/winston')
const rabbitMQ = require('../helpers/rabbitMQ.helper')
function standardErrorResponse (req, res, err, type, statusCode) {
  let code = SERVER_RESPONSE.VALIDATION_ERROR
  statusCode = parseInt(statusCode)
  if (!isNaN(statusCode)) {
    code = statusCode
  }
  const logData = {
    time: new Date(),
    request: {
      body: req.body || {},
      query: req.query || {},
      params: req.params || {},
      method: req.method,
      url: req.url,
      user: req.user || {}
    },
    response: err,
    location: type,
    reason: 'Validation Error'
  }

  // winston.info(logData)
  logError(logData)

  return res.status(code)
    .send({
      status: 'Error',
      message: err,
      location: type
    })
}
const logError = (data) => {
  rabbitMQ.sendMessage(data, 'logstash')
}
module.exports = {
  standardErrorResponse
}
