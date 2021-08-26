'use strict'
const SERVER_RESPONSE = require('../config/serverResponses')
const actionHelper = require('../helpers/action.helper')
const StandardError = require('standard-error')
const generalController = require('./general.controller')

// Get Modules
const getActions = function (req, res) {
  return actionHelper.getActions(req.conditions)
    .then(function (data) {
      generalController.successResponse(req, res, 'Action fetched successfully.', data, 'module.controller.getActions')
    }).catch(StandardError, function (err) {
      generalController.errorResponse(req, res, err, null, 'module.controller.getActions', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch(function (err) {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'module.controller.getActions', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}

module.exports = {
  getActions
}