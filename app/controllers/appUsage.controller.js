'use strict'
const SERVER_RESPONSE = require('../config/serverResponses')
const appUsageHelper = require('../helpers/appUsage.helper')
const StandardError = require('standard-error')
const generalController = require('./general.controller')

const addAppLastUsed = function (req, res) {
  return appUsageHelper.addAppLastUsed(req.user.id, req.validatedData)
    .then(function (data) {
      generalController.successResponse(req, res, 'Successfully added the last used of app', data, 'appUsage.controller.addAppLastUsed')
    }).catch(StandardError, function (err) {
      generalController.errorResponse(req, res, err, null, 'appUsage.controller.addAppLastUsed', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch(function (err) {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'appUsage.controller.addAppLastUsed', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}

const getAppLastUsed = function (req, res) {
  return appUsageHelper.getAppLastUsed(req.conditions)
    .then(function (data) {
      generalController.successResponse(req, res, 'Successfully fetched the last used of app', data, 'appUsage.controller.getAppLastUsed')
    }).catch(StandardError, function (err) {
      generalController.errorResponse(req, res, err, null, 'appUsage.controller.getAppLastUsed', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch(function (err) {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'appUsage.controller.getAppLastUsed', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}

const getAppLastUsedGrouped = function (req, res) {
  return appUsageHelper.getAppLastUsedGrouped(req.conditions)
    .then(function (data) {
      generalController.successResponse(req, res, 'Successfully fetched the app used', data, 'appUsage.controller.getAppLastUsedGrouped')
    }).catch(StandardError, function (err) {
      generalController.errorResponse(req, res, err, null, 'appUsage.controller.getAppLastUsedGrouped', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch(function (err) {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'appUsage.controller.getAppLastUsedGrouped', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}

module.exports = {
  addAppLastUsed,
  getAppLastUsed,
  getAppLastUsedGrouped
}
