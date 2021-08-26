'use strict'
const generalMiddleware = require('./general.middleware')
const SERVER_RESPONSE = require('../config/serverResponses')
const _ = require('lodash')

// ***********************
// validate ADD Role
// ***********************

const validateAddRole = (req, res, next) => {
  const body = req.body
  console.log('body Role----->', body)
  const validatedData = {
    role: {},
    moduleActionsIds: []
  }

  // get all the errors in an array
  const errorArray = []

  // title is required, validating it as not empty, valid String and length range.
  if (_.isEmpty(body.title) || !_.isString(body.title) || body.title.length < 2 || body.title.length > 50) {
    errorArray.push({
      field: 'title',
      error: 60500,
      message: '\'title\' is required as string, length must be between 2 and 50.'
    })
  }

  // ownRecordsOnly is required, validating it as not empty, valid Boolean value true or false.
  if (_.isEmpty(body.ownRecordsOnly) || !_.isString(body.ownRecordsOnly) || (body.ownRecordsOnly != 'true' && body.ownRecordsOnly != 'false')) {
    errorArray.push({
      field: 'ownRecordsOnly',
      error: 1000,
      message: '\'ownRecordsOnly\' is required as Boolean true or false.'
    })
  }

  // isActive is required, validating it as not empty, valid Boolean value true or false.
  if (_.isEmpty(body.isActive) || !_.isString(body.isActive) || (body.isActive != 'true' && body.isActive != 'false')) {
    errorArray.push({
      field: 'isActive',
      error: 1000,
      message: '\'isActive\' is required as Boolean true or false.'
    })
  }

  if (body.hasOwnProperty('moduleActionsIds')) {
  // moduleActionsIds are required As Array
    if (_.isEmpty(body.moduleActionsIds) || !_.isArray(body.moduleActionsIds) || body.moduleActionsIds.length < 1) {
      errorArray.push({
        field: 'moduleActionsIds',
        error: 90240,
        message: '\'moduleActionsIds\' is required as Array Provide Valid Array of moduleActionsIds.'
      })
    }
    const ids = body.moduleActionsIds
    for (const id in ids) {
      if (!id || isNaN(id)) {
        errorArray.push({
          field: 'moduleActionsIds',
          error: 90250,
          message: 'Please provide only valid numeric ids in Property moduleActionsIds only.'
        })
      }
    }
    validatedData.moduleActionsIds = body.moduleActionsIds
  }

  // description is an optional string property, if it is given than validate it.
  if (body.hasOwnProperty('description') && !_.isEmpty(body.description)) {
    // Validating as not empty, valid String and length range.
    if (!_.isString(body.description) || body.description.length < 5 || body.description.length > 250) {
      errorArray.push({
        field: 'description',
        error: 60510,
        message: 'Please provide only valid \'description\' as string, length must be between 5 and 250.'
      })
    }
    validatedData.role.description = body.description
  }

  // Check if error exists
  if (errorArray.length) {
    return generalMiddleware.standardErrorResponse(req, res, errorArray, 'role.middleware.validateAddRole', SERVER_RESPONSE.VALIDATION_ERROR)
  }

  validatedData.role.title = body.title
  validatedData.role.ownRecordsOnly = body.ownRecordsOnly
  validatedData.role.isActive = body.isActive
  validatedData.role.isDeleteAble = body.isDeleteAble
  req.body = validatedData
  next()
}

// ******************
// Validate Get Role
// ******************

const validateGetRoles = (req, res, next) => {
  let role = req.query

  let validatedConditions = {}
  const errorArray = []
  // _id is an optional mongo db collection id, if it is given than validate it.
  if (role.hasOwnProperty('id')) {
  // Validating as not empty, mongo db collection id.
    if (_.isEmpty(role.id) || isNaN(role.id)) {
      errorArray.push({
        field: 'id',
        error: 60550,
        message: 'Please provide only valid \'id\'.'
      })
    }
    validatedConditions.id = role.id
  }

  // Check if error exists
  if (errorArray.length) {
    return generalMiddleware.standardErrorResponse(req, res, errorArray, 'role.middleware.validateGetRole', SERVER_RESPONSE.VALIDATION_ERROR)
  }

  req.conditions = validatedConditions
  next()
}

// ****************************
// Validate Get Role Details
// ****************************

const validateGetRolesDetail = (req, res, next) => {
  let role = req.params
  let validatedConditions = {}
  const errorArray = []

  // Validating as not empty, mongo db collection id.
  if (_.isEmpty(role.id) || isNaN(role.id)) {
    errorArray.push({
      field: 'id',
      error: 60550,
      message: 'Please provide only valid \'id\'.'
    })
  }
  validatedConditions.id = role.id

  // Check if error exists
  if (errorArray.length) {
    return generalMiddleware.standardErrorResponse(req, res, errorArray, 'role.middleware.validateGetRolesDetail', SERVER_RESPONSE.VALIDATION_ERROR)
  }
  req.conditions = validatedConditions
  next()
}

// *********************
// Validate update role
// *********************

const validateUpdateRole = (req, res, next) => {
  const body = req.body
  let validatedRole = {}
  const errorArray = []

  // id is required, validating it as not empty, valid mongo db collection id.
  if (_.isEmpty(req.params.id)) {
    errorArray.push({
      field: 'id',
      error: 60560,
      message: 'Valid \'id\' is required.'
    })
  }

  if (body.hasOwnProperty('title')) {
  // title is required, validating it as not empty, valid String and length range.
    if (_.isEmpty(body.title) || !_.isString(body.title) || body.title.length < 2 || body.title.length > 50) {
      errorArray.push({
        field: 'title',
        error: 60500,
        message: '\'title\' is required as string, length must be between 2 and 50.'
      })
    }
    validatedRole.title = body.title
  }

  if (body.hasOwnProperty('description')) {
    // description is required, validating it as not empty, valid String and length range.
    if (_.isEmpty(body.description) || !_.isString(body.description) || body.description.length < 2 || body.description.length > 250) {
      errorArray.push({
        field: 'description',
        error: 60500,
        message: '\'description\' is required as string, length must be between 2 and 250.'
      })
    }
    validatedRole.description = body.description
  }

  // ownRecordsOnly is an optional string property, if it is given than validate it.
  if (body.hasOwnProperty('ownRecordsOnly')) {
    // ownRecordsOnly is required, validating it as not empty, valid Boolean value true or false.
    if (_.isEmpty(body.ownRecordsOnly) || !_.isString(body.ownRecordsOnly) || (body.ownRecordsOnly != 'true' && body.ownRecordsOnly != 'false')) {
      errorArray.push({
        field: 'ownRecordsOnly',
        error: 1000,
        message: '\'ownRecordsOnly\' is required as Boolean true or false.'
      })
    }
    validatedRole.ownRecordsOnly = body.ownRecordsOnly
  }

  // isActive is an optional string property, if it is given than validate it.
  if (body.hasOwnProperty('isActive')) {
  // isActive is required, validating it as not empty, valid Boolean value true or false.
    if (_.isEmpty(body.isActive) || !_.isString(body.isActive) || (body.isActive != 'true' && body.isActive != 'false')) {
      errorArray.push({
        field: 'isActive',
        error: 1000,
        message: '\'isActive\' is required as Boolean true or false.'
      })
    }
    validatedRole.isActive = body.isActive
  }

  if (body.hasOwnProperty('moduleActionsIds')) {
    // moduleActionsIds are required As Array
    if (_.isEmpty(body.moduleActionsIds) || !_.isArray(body.moduleActionsIds) || body.moduleActionsIds.length < 1) {
      errorArray.push({
        field: 'moduleActionsIds',
        error: 90240,
        message: '\'moduleActionsIds\' is required as Array Provide Valid Array of moduleActionsIds.'
      })
    }

    const ids = body.moduleActionsIds
    for (const id in ids) {
      if (!id || isNaN(id)) {
        errorArray.push({
          field: 'moduleActionsIds',
          error: 90250,
          message: 'Please provide only valid numeric ids in Property moduleActionsIds only.'
        })
      }
    }
  }

  // Check if error exists
  if (errorArray.length) {
    return generalMiddleware.standardErrorResponse(req, res, errorArray, 'role.middleware.validateUpdateRole', SERVER_RESPONSE.VALIDATION_ERROR)
  }

  if (_.isEmpty(validatedRole) && _.isEmpty(body.moduleActionsIds)) {
    return generalMiddleware.standardErrorResponse(req, res, [{
      field: 'general',
      error: 60620,
      message: 'No data provided to update role.'
    }], 'role.middleware.validateUpdateRole', SERVER_RESPONSE.VALIDATION_ERROR)
  }

  req.body = { role: validatedRole, moduleActionsIds: body.moduleActionsIds }
  next()
}

// Validate delete role
const validateDeleteRole = (req, res, next) => {
  const errorArray = []
  const validatedBody = {}
  const id = req.params
  // id is required, validating it as not empty, valid mongo db collection id.
  if (!id.id || isNaN(id.id)) {
    errorArray.push({
      field: '',
      error: 90280,
      message: '\'id\' is required as Number.'
    })
  }
  validatedBody.id = id.id

  // Check if error exists
  if (errorArray.length) {
    return generalMiddleware.standardErrorResponse(req, res, errorArray, 'role.middleware.validateDeleteRole', SERVER_RESPONSE.VALIDATION_ERROR)
  }
  req.conditions = validatedBody
  next()
}

module.exports = {
  validateAddRole,
  validateGetRoles,
  validateUpdateRole,
  validateDeleteRole,
  validateGetRolesDetail
}
