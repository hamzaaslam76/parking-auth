'use strict'
const generalMiddleware = require('./general.middleware')
const _ = require('lodash')

// module Middleware
const validateGetModule = (req, res, done) => {
  const errorArray = []
  const query = req.query
  const validatedConditions = {}

  // id is an optional numeric property, if it is given than validate it.
  if (query.hasOwnProperty('id')) {
    if (query.id !== 'null') {
      // Validating as not empty, valid numeric value with range.
      if (query.id != null && (!query.id || isNaN(query.id))) {
        errorArray.push({
          field: 'id',
          error: 50500,
          message: 'Please provide only valid \'id\' as numeric.'
        })
      }
    }
    validatedConditions.id = query.id === 'null' ? null : query.id
  }

  if (!_.isEmpty(errorArray)) {
    return generalMiddleware.standardErrorResponse(req, res, errorArray, 'module.middleware.validateGetModule')
  }

  req.conditions = validatedConditions

  done()
}

module.exports = {
  validateGetModule
}
