'use strict'
const SERVER_RESPONSE = require('../config/serverResponses')
const moduleHelper = require('../helpers/module.helper')
const StandardError = require('standard-error')
const generalController = require('./general.controller')

// Get Modules
const getModules = function (req, res) {
  return moduleHelper.getModules(req.conditions)
    .then(function (data) {
      generalController.successResponse(req, res, 'Module fetched successfully.', data, 'module.controller.getModules')
    }).catch(StandardError, function (err) {
      generalController.errorResponse(req, res, err, null, 'module.controller.getModules', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch(function (err) {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'module.controller.getModules', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}

module.exports = {
  getModules
}
