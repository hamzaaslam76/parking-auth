'use strict'

const SERVER_RESPONSE = require('../config/serverResponses')
const roleHelper = require('../helpers/role.helper')
const StandardError = require('standard-error')
const generalController = require('./general.controller')

// **************
// Create Role
// **************

const addRole = function (req, res) {
  return roleHelper.addRole(req.body.role, req.body.moduleActionsIds, req.user.id)
    .then((data) => {
      generalController.successResponse(req, res, 'Role created successfully.', data, 'role.controller.addRole')
    }).catch(StandardError, (err) => {
      generalController.errorResponse(req, res, err, null, 'role.controller.addRole', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch((err) => {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'role.controller.addRole', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}

// ***********
// get role
// ***********

const getRoles = function (req, res) {
  return roleHelper.getRoles(req.conditions)
    .then((data) => {
      generalController.successResponse(req, res, 'Role get successfully.', data, 'role.controller.getRole')
    }).catch(StandardError, (err) => {
      generalController.errorResponse(req, res, err, null, 'role.controller.getRole', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch((err) => {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'role.controller.getRole', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}

// *****************
// get role Details
// *****************

const getRoleDetails = function (req, res) {
  return roleHelper.getRoleDetails(req.conditions)
    .then((data) => {
      generalController.successResponse(req, res, 'Role Details Fetched successfully.', data, 'role.controller.getRoleDetails')
    }).catch(StandardError, (err) => {
      generalController.errorResponse(req, res, err, null, 'role.controller.getRoleDetails', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch((err) => {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'role.controller.getRoleDetails', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}

// *************
// Update Role
// *************

const updateRole = function (req, res) {
  return roleHelper.updateRole(req.body.role, req.body.moduleActionsIds, req.params.id)
    .then(function (data) {
      generalController.successResponse(req, res, 'Role updated successfully.', data, 'role.controller.updateRole')
    }).catch(StandardError, function (err) {
      generalController.errorResponse(req, res, err, null, 'role.controller.updateRole', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch(function (err) {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'role.controller.updateRole', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}

// *************
// Delete Role
// *************

const deleteRole = function (req, res) {
  return roleHelper.deleteRole(req.user.id, req.conditions)
    .then(function (data) {
      generalController.successResponse(req, res, 'Role deleted successfully.', data, 'role.controller.deleteRole')
    }).catch(StandardError, function (err) {
      generalController.errorResponse(req, res, err, null, 'role.controller.deleteRole', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch(function (err) {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'role.controller.deleteRole', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}

// ***********
// get Module
// ***********

module.exports = {
  addRole,
  getRoles,
  updateRole,
  deleteRole,
  getRoleDetails
}
