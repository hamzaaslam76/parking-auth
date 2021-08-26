'use strict'

// successResponse
function successResponse (req, res, message, data, type) {
  return res.jsonp(data != null ? {
    status: 'Success',
    message: message,
    data: data
  } : {
    status: 'Success',
    message: message
  })
}

function errorResponse (req, res, err, msg, type, status) {
  var message = ''
  let statusCode = parseInt(err.statusCode)

  // setting message
  if (err && err.message) {
    message = err.message
  } else if (msg) {
    message = msg
  } else {
    message = err.stack ? err.stack.split('\n') : 'Error Occurred'
  }

  // Setting status code
  if (isNaN(statusCode)) {
    statusCode = parseInt(status)
  }

  return res.status(statusCode).jsonp({
    status: 'Error',
    message: message,
    location: type
  })
}

exports.successResponse = successResponse
exports.errorResponse = errorResponse
