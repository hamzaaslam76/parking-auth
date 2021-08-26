'use strict'
const generalMiddleware = require('./general.middleware')
const _ = require('lodash')

const validateAddAppLastUsed = (req, res, done) => {
  const errorArray = []
  const body = req.body
  const validatedInsertObjects = []

  console.log(body.usages, _.isEmpty(body.usages), _.isArray(body.usages), body.usages.length < 1)

  // usages is required, validating it as not empty, valid String and length range.
  if (_.isEmpty(body.usages) || !_.isArray(body.usages) || body.usages.length < 1) {
    errorArray.push({
      field: 'usages',
      error: 5001,
      message: '\'usages\' is required as array of objects.'
    })
  } else {
    let usages = body.usages
    usages.forEach((usage, index) => {
      if (_.isEmpty(usage.start) || isNaN(Date.parse(usage.start))) {
        errorArray.push({
          field: 'usages.start',
          error: 5001,
          message: 'Please provide valid start at ' + index
        })
      }
      if (_.isEmpty(usage.end) || isNaN(Date.parse(usage.end))) {
        errorArray.push({
          field: 'usages.end',
          error: 5001,
          message: 'Please provide valid end at ' + index
        })
      }
      validatedInsertObjects.push({
        start: usage.start,
        end: usage.end,
        UserId: req.user.id
      })
    })
  }

  if (!_.isEmpty(errorArray)) {
    return generalMiddleware.standardErrorResponse(req, res, errorArray, 'appUsage.middleware.validateAddAppLastUsed')
  }

  req.validatedData = validatedInsertObjects

  done()
}

const validateGetAppLastUsed = (req, res, done) => {
  const errorArray = []
  const query = req.query
  const validatedConditions = {
    userIds: []
  }

  // start is required, validating it as not empty, valid date.
  if (_.isEmpty(query.start) || isNaN(Date.parse(query.start))) {
    errorArray.push({
      field: 'start',
      error: 5001,
      message: '\'start\' is required as date string.'
    })
  }

  // end is an optional string property, if it is given than validate it.
  if (query.hasOwnProperty('end') && query.end) {
    // end is required, validating it as not empty, valid date.
    if (_.isEmpty(query.end) || isNaN(Date.parse(query.end))) {
      errorArray.push({
        field: 'end',
        error: 5001,
        message: '\'end\' is required as date string.'
      })
    }
    validatedConditions.end = query.end
  }

  // user is required, validating it as not empty, valid String and length range.
  if (!query.user || query.user.length < 1 || query.user.length > 500) {
    errorArray.push({
      field: 'user',
      error: 5001,
      message: '\'user\' is required as ids joined with dashes, length must be between 1 and 500.'
    })
  } else {
    const ids = query.user.split('-')
    ids.forEach((id, index) => {
      // id is required, validating as not empty, valid numeric value with range.
      if (!id || isNaN(id) || id < 1 || id > 99999999999) {
        errorArray.push({
          field: 'id',
          error: 5001,
          message: '\'id\' is required as numeric, range must be between 1 and 99999999999 at index ' + index
        })
      } validatedConditions.userIds.push(id)
    })
  }

  if (!_.isEmpty(errorArray)) {
    return generalMiddleware.standardErrorResponse(req, res, errorArray, 'appUsage.middleware.validateGetAppLastUsed')
  }

  validatedConditions.start = query.start

  req.conditions = validatedConditions
  done()
}

const validateGetAppLastUsedGrouped = (req, res, done) => {
  const errorArray = []
  const query = req.query
  const validatedConditions = {}

  if (query.hasOwnProperty('history') && (query.history == 'true' || query.history == 'false' ||
      query.history == true || query.history == false)) {
    try {
      validatedConditions.history = JSON.parse(query.history)
    } catch (error) {
    }
  }

  // start is required, validating it as not empty, valid date.
  if (_.isEmpty(query.start) || isNaN(Date.parse(query.start))) {
    errorArray.push({
      field: 'start',
      error: 5001,
      message: '\'start\' is required as date string.'
    })
  }

  // end is an optional string property, if it is given than validate it.
  if (query.hasOwnProperty('end') && query.end) {
    // end is required, validating it as not empty, valid date.
    if (_.isEmpty(query.end) || isNaN(Date.parse(query.end))) {
      errorArray.push({
        field: 'end',
        error: 5001,
        message: '\'end\' is required as date string.'
      })
    }
    validatedConditions.end = query.end
  }

  // roleId is an optional numeric property, if it is given than validate it.
  if (query.hasOwnProperty('roleId') && query.roleId) {
    // Validating as not empty, valid numeric value with range.
    if (isNaN(query.roleId) || query.roleId < 0 || query.roleId > 9999999999) {
      errorArray.push({
        field: 'roleId',
        error: 5001,
        message: 'Please provide only valid \'roleId\' as numeric, range must be between 0 and 9999999999.'
      })
    }
    validatedConditions.RoleId = query.roleId
  }

  // user is an optional numeric property, if it is given than validate it.
  if (query.hasOwnProperty('user') && query.user) {
    // user is required, validating it as not empty, valid String and length range.
    if (query.user.length < 1 || query.user.length > 500) {
      errorArray.push({
        field: 'user',
        error: 5001,
        message: '\'user\' is required as ids joined with dashes, length must be between 1 and 500.'
      })
    } else {
      const ids = query.user.split('-')
      validatedConditions.userIds = []
      ids.forEach((id, index) => {
        // id is required, validating as not empty, valid numeric value with range.
        if (!id || isNaN(id) || id < 1 || id > 99999999999) {
          errorArray.push({
            field: 'id',
            error: 5001,
            message: '\'id\' is required as numeric, range must be between 1 and 99999999999 at index ' + index
          })
        }
        validatedConditions.userIds.push(id)
      })
    }
  }

  if (req.user && req.user.RoleId && req.user.RoleId == 2) {
    validatedConditions.interneeSupervisors = [req.user.employeeId]
  } else if (query.hasOwnProperty('supervisors') && query.supervisors) {
    const supervisors = query.supervisors.split('-')
    for (let i = 0; i < supervisors.length; i++) {
      const interneeId = supervisors[i]
      // is required, validating as not empty, valid numeric value with range.
      if (!interneeId || isNaN(interneeId)) {
        errorArray.push({
          field: 'supervisors',
          error: 5001,
          message: 'provide valid numeric supervisor id at index ' + i + ' of property supervisors.'
        })
      }
      validatedConditions.interneeSupervisors = Array.from(new Set(supervisors))
    }
  }

  if (!_.isEmpty(errorArray)) {
    return generalMiddleware.standardErrorResponse(req, res, errorArray, 'appUsage.middleware.validateGetAppLastUsedGrouped')
  }

  validatedConditions.start = query.start

  req.conditions = validatedConditions
  done()
}

module.exports = {
  validateAddAppLastUsed,
  validateGetAppLastUsed,
  validateGetAppLastUsedGrouped
}
