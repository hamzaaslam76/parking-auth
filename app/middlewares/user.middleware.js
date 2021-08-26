'use strict'
const generalMiddleware = require('./general.middleware')
const emailReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const _ = require('lodash')
const uuid = require('uuid/v4')

// signUp validation
const validateSignUp = (req, res, done) => {
  const body = req.body
  // get all the errors in an array
  const errorArray = []
  const validatedData = {}
  // fName is required, validating it as not empty, valid String and length range.
  if (_.isEmpty(body.fName) || !_.isString(body.fName) || body.fName.length < 2 || body.fName.length > 100) {
    errorArray.push({
      field: 'fName',
      error: 1000,
      message: '\'fName\' is required as string, length must be between 2 and 100.'
    })
  }

  // lName is an optional string property, if it is given than validate it.
  if (body.hasOwnProperty('lName') && body.lName) {
    // Validating as not empty, valid String and length range.
    if (!_.isString(body.lName) || body.lName.length < 2 || body.lName.length > 100) {
      errorArray.push({
        field: 'lName',
        error: 1003,
        message: 'Please provide only valid \'lName\' as string, length must be between 2 and 100.'
      })
    }
    validatedData.lName = body.lName
  }

  // email is an required string property, if it is given than validate it.
  if (body.hasOwnProperty('email') && body.email) {
    // Validating as not empty, valid String and length range.
    if (_.isEmpty(body.email) || !_.isString(body.email) || body.email.length < 5 || body.email.length > 100 || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(body.email))) {
      errorArray.push({
        field: 'email',
        error: 1006,
        message: 'Please provide only valid \'email\' as string, length must be between 5 and 100.'
      })
    }
    validatedData.email = body.email
  }

  // validating as optional string field
  if (body.hasOwnProperty('phone') && body.phone) {
    if (body.phone.length < 11 || body.phone.length > 16) {
      errorArray.push({
        field: 'phone',
        error: 1009,
        message: 'The phone should be string with min 11 and max 16 characters.'
      })
    }
    validatedData.phone = body.phone
  }

  // language is required, validating it as not empty, valid String and length range.
  // if (_.isEmpty(body.language) || !_.isString(body.language) || (body.language != 'eng' && body.language != 'urd')) {
  //   errorArray.push({
  //     field: 'language',
  //     error: 1012,
  //     message: '\'language\' is required as string, must be eng/urd.'
  //   })
  // }

  // RoleId is required, validating as not empty, valid numeric value with range.
  if (!body.RoleId || isNaN(body.RoleId) || body.RoleId < 1 || body.RoleId > 9999999) {
    errorArray.push({
      field: 'RoleId',
      error: 1013,
      message: '\'RoleId\' is required as numeric, range must be between 1 and 9999999.'
    })
  }

  // password is required, validating it as not empty, valid String and length range.
  if (_.isEmpty(body.password) || !_.isString(body.password) || body.password.length < 8 || body.password.length > 16) {
    errorArray.push({
      field: 'password',
      error: 1015,
      message: '\'password\' is required as string, length must be between 8 and 16.'
    })
  }

  // device is an optional string property, if it is given than validate it.
  // if (body.hasOwnProperty('device') && body.device) {
  //   // Validating as not empty, valid String and length range.
  //   if (body.device.length < 1 || body.device.length > 200) {
  //     errorArray.push({
  //       field: 'device',
  //       error: 1017,
  //       message: 'Please provide only valid \'device\' as string, length must be between 1 and 200.'
  //     })
  //   }
  //   validatedData.signupDevice = body.device
  // }

  // send array if error(s)
  if (errorArray.length) {
    return generalMiddleware.standardErrorResponse(req, res, errorArray, 'user.middleware.validateSignUp')
  }

  validatedData.fName = body.fName
  validatedData.lName = body.lName
  validatedData.email = body.email
  validatedData.phone = body.phone
  validatedData.password = body.password
  // validatedData.language = body.language
  validatedData.RoleId = body.RoleId

  if (validatedData.RoleId === 3) {
    validatedData.otp = Math.round(Math.random() * 9000 + 1000)
  } else {
    validatedData.otp = uuid()
  }

  req.validatedBody = validatedData
  done()
}
// signUp validation
const validateCurrentUserProfile = (req, res, done) => {
  const body = req.body
  const validatedQuery = {
    id: req.user.id,
    isDeleted: false
  }
  // get all the errors in an array
  const errorArray = []
  const validatedData = {}
  // fName is required, validating it as not empty, valid String and length range.
  if (_.isEmpty(body.fName) || !_.isString(body.fName) || body.fName.length < 2 || body.fName.length > 100) {
    errorArray.push({
      field: 'fName',
      error: 1000,
      message: '\'fName\' is required as string, length must be between 2 and 100.'
    })
  }
  // lName is an optional string property, if it is given than validate it.
  if (body.hasOwnProperty('lName') && body.lName) {
    // Validating as not empty, valid String and length range.
    if (!_.isString(body.lName) || body.lName.length < 2 || body.lName.length > 100) {
      errorArray.push({
        field: 'lName',
        error: 1003,
        message: 'Please provide only valid \'lName\' as string, length must be between 2 and 100.'
      })
    }
  }
  if (errorArray.length) {
    return generalMiddleware.standardErrorResponse(req, res, errorArray, 'user.middleware.validateCurrentUserProfile')
  }
  validatedData.fName = body.fName
  validatedData.lName = body.lName
  req.validatedBody = validatedData
  req.conditions = validatedQuery
  done()
}

// validate login credentials
const validateLoginCredentials = (req, res, done) => {
  const body = req.body
  // get all the errors in an array
  const validatedBody = {}
  const errorArray = []

  // email is required, validating it as not empty, valid String and length range.
  if (_.isEmpty(body.email) || !_.isString(body.email) || body.email.length < 5 || body.email.length > 100 || !(emailReg.test(body.email))) {
    errorArray.push({
      field: 'email',
      error: 1059,
      message: 'Please provide only valid \'email\' as string, length must be between 5 and 100.'
    })
  }

  // password is required, validating it as not empty, valid String and length range.
  if (_.isEmpty(body.password) || !_.isString(body.password)) {
    errorArray.push({
      field: 'password',
      error: 1033,
      message: '\'password\' is required.'
    })
  }

  if (errorArray.length) {
    return generalMiddleware.standardErrorResponse(req, res, errorArray, 'user.middleware.validateLoginCredentials')
  }
  validatedBody.email = body.email
  validatedBody.password = body.password
  return done()
}
// validate phone login credentials
const validatePhoneLoginCredentials = (req, res, done) => {
  const body = req.body
  // get all the errors in an array
  const validatedBody = {}
  const errorArray = []

  // phone is required, validating as not empty, length range.
  if (_.isEmpty(body.phone) || !_.isString(body.phone) || body.phone.length < 11 || body.phone.length > 11) {
    errorArray.push({
      field: 'phone',
      error: 5001,
      message: 'Please provide only valid \'phone\' as numeric, range must be between 1 and 16.'
    })
  }

  // password is required, validating it as not empty, valid String and length range.
  if (_.isEmpty(body.password) || !_.isString(body.password)) {
    errorArray.push({
      field: 'password',
      error: 1033,
      message: '\'password\' is required.'
    })
  }

  if (errorArray.length) {
    return generalMiddleware.standardErrorResponse(req, res, errorArray, 'user.middleware.validateLoginCredentials')
  }
  validatedBody.phone = body.phone
  validatedBody.password = body.password
  return done()
}

// validate get user
const validateGetUsers = (req, res, done) => {
  const errorArray = []
  const query = req.query
  console.log('query', query)
  const validatedQuery = {}
  let limit = 500
  let offset = 0

  // id is an optional numeric property, if it is given than validate it.
  if (query.hasOwnProperty('id')) {
    // Validating as not empty, valid numeric value with range.
    if (!query.id || isNaN(query.id)) {
      errorArray.push({
        field: 'id',
        error: 1050,
        message: 'Please provide only valid \'id\' as numeric.'
      })
    }
    validatedQuery.id = query.id
  }

  // fName is an optional string property, if it is given than validate it.
  if (query.hasOwnProperty('fName')) {
    // Validating as not empty, valid String and length range.
    if (_.isEmpty(query.fName) || !_.isString(query.fName) || query.fName.length < 2 || query.fName.length > 100) {
      errorArray.push({
        field: 'fName',
        error: 1053,
        message: 'Please provide only valid \'fName\' as string, length must be between 2 and 100.'
      })
    }
    validatedQuery.fName = query.fName
  }

  // lName is an optional string property, if it is given than validate it.
  if (query.hasOwnProperty('lName')) {
    // Validating as not empty, valid String and length range.
    if (_.isEmpty(query.lName) || !_.isString(query.lName) || query.lName.length < 2 || query.lName.length > 100) {
      errorArray.push({
        field: 'lName',
        error: 1056,
        message: 'Please provide only valid \'lName\' as string, length must be between 2 and 100.'
      })
    }
    validatedQuery.lName = query.lName
  }

  // email is an optional string property, if it is given than validate it.
  if (query.hasOwnProperty('email')) {
    // Validating as not empty, valid String and length range.
    if (_.isEmpty(query.email) || !_.isString(query.email) || query.email.length < 5 || query.email.length > 100 || !(emailReg.test(query.email))) {
      errorArray.push({
        field: 'email',
        error: 1059,
        message: 'Please provide only valid \'email\' as string, length must be between 5 and 100.'
      })
    }
    validatedQuery.email = query.email
  }

  // roles is array of roleIds.
  if (query.hasOwnProperty('roles') && query.roles) {
    const roles = query.roles.split('-')
    for (let i = 0; i < roles.length; i++) {
      const roleId = roles[i]
      // is required, validating as not empty, valid numeric value with range.
      if (!roleId || isNaN(roleId)) {
        errorArray.push({
          field: 'roleId',
          error: 5001,
          message: 'provide valid numeric role id at index ' + i + ' of property roles.'
        })
      }
      validatedQuery.RoleId = Array.from(new Set(roles))
    }
  }

  // phone is an optional string property, if it is given than validate it.
  if (query.hasOwnProperty('phone')) {
    // Validating as not empty, valid String and length range.
    if (_.isEmpty(query.phone) || !_.isString(query.phone) || query.phone.length < 11 || query.phone.length > 11) {
      errorArray.push({
        field: 'phone',
        error: 1062,
        message: 'Please provide only valid \'phone\' as string, length must be between 5 and 10.'
      })
    }
    validatedQuery.phone = query.phone
  }

  // isVerified is an optional string property, if it is given than validate it.
  if (query.hasOwnProperty('isVerified')) {
    // Validating as not empty, valid String and length range.
    if (!query.isVerified || (query.isVerified != 'true' && query.isVerified != 'false')) {
      errorArray.push({
        field: 'isVerified ',
        error: 1068,
        message: 'Please provide only valid \'isVerified \' as boolean.'
      })
    }
    try {
      validatedQuery.isVerified = JSON.parse(query.isVerified)
    } catch (error) {
      console.error(error)
    }
  }

  // isBlocked is an optional string property, if it is given than validate it.
  if (query.hasOwnProperty('isBlocked')) {
    // Validating as not empty, valid String and length range.
    if (!query.isBlocked || (query.isBlocked != 'true' && query.isBlocked != 'false')) {
      errorArray.push({
        field: 'isBlocked ',
        error: 1071,
        message: 'Please provide only valid \'isBlocked \' as boolean.'
      })
    }
    try {
      validatedQuery.isBlocked = JSON.parse(query.isBlocked)
    } catch (error) {
      console.error(error)
    }
  }

  if (!_.isEmpty(errorArray)) {
    return generalMiddleware.standardErrorResponse(req, res, errorArray, 'user.middleware.validateGetUsers')
  }

  if (query.limit && query.limit > 0) {
    limit = parseInt(query.limit)
  }

  if (query.offset && query.offset > 0) {
    offset = parseInt(query.offset)
  }

  validatedQuery.isDeleted = false
  req.conditions = validatedQuery
  console.log('validatedQuery', validatedQuery)
  req.limit = limit
  req.offset = offset
  done()
}

// validate get user address
const validateGetUserCurrent = (req, res, done) => {
  const errorArray = []
  // const query = req.query
  const validatedQuery = {
    UserId: req.user.id,
    isDeleted: false
  }

  if (!_.isEmpty(errorArray)) {
    return generalMiddleware.standardErrorResponse(req, res, errorArray, 'user.middleware.validateGetUserCurrent')
  }

  req.conditions = validatedQuery
  done()
}

// Validate forgot password
const validateForgotPassword = (req, res, done) => {
  const errorArray = []
  const body = req.body
  const validatedBody = {}

  console.log(_.isEmpty(body.email), !_.isString(body.email), body.email.length < 5, body.email.length > 100, !(emailReg.test(body.email)))

  // email is required, validating it as not empty, valid String and length range.
  if (_.isEmpty(body.email) || !_.isString(body.email) || body.email.length < 5 || body.email.length > 100 || !(emailReg.test(body.email))) {
    errorArray.push({
      field: 'email',
      error: 1059,
      message: 'Please provide only valid \'email\' as string, length must be between 5 and 100.'
    })
  }

  if (!_.isEmpty(errorArray)) {
    return generalMiddleware.standardErrorResponse(req, res, errorArray, 'user.middleware.validateForgotPassword')
  }

  validatedBody.email = body.email
  validatedBody.isDeleted = false
  req.conditions = validatedBody
  done()
}

// Validate forgot password
const validateForgotPasswordPhone = (req, res, done) => {
  const errorArray = []
  const body = req.body
  const validatedBody = {}

  // phone is an optional string property, if it is given than validate it.
  // Validating as not empty, valid String and length range.
  if (!body.phone || isNaN(body.phone) || body.phone.length < 11 || body.phone.length > 11) {
    errorArray.push({
      field: 'phone',
      error: 1090,
      message: 'Please provide only valid \'phone\' as 03001231234, length must be 11.'
    })
  }

  if (!_.isEmpty(errorArray)) {
    return generalMiddleware.standardErrorResponse(res, errorArray, 'user.middleware.validateForgotPasswordPhone')
  }
  validatedBody.phone = body.phone
  validatedBody.isDeleted = false
  req.conditions = validatedBody
  done()
}

// validate login credentials
const validateResetPassword = (req, res, done) => {
  const body = req.body
  // get all the errors in an array
  const validateBody = {}
  const errorArray = []

  // email is required, validating it as not empty, valid String and length range.
  if (_.isEmpty(body.email) || !_.isString(body.email) || body.email.length < 5 || body.email.length > 100 || !(emailReg.test(body.email))) {
    errorArray.push({
      field: 'email',
      error: 1059,
      message: 'Please provide only valid \'email\' as string, length must be between 5 and 100.'
    })
  }

  // password is required, validating it as not empty, valid String and length range.
  if (_.isEmpty(body.password) || !_.isString(body.password) || body.password.length < 8 || body.password.length > 16) {
    errorArray.push({
      field: 'password',
      error: 1333,
      message: '\'password\' is required as string, length must be between 8 and 16.'
    })
  }

  // otp is required, validating as not empty, valid numeric value with range.
  if (!body.otp || isNaN(body.otp) || body.otp < 1000 || body.otp > 9999) {
    errorArray.push({
      field: 'otp',
      error: 1193,
      message: '\'otp\' is required as numeric, range must be between 1000 and 9999.'
    })
  }

  if (errorArray.length) {
    return generalMiddleware.standardErrorResponse(req, res, errorArray, 'user.middleware.validateResetPassword')
  }

  validateBody.email = body.email
  validateBody.password = body.password
  validateBody.otp = body.otp
  req.body = validateBody
  return done()
}

// validate login credentials
const validateResetPasswordPhone = (req, res, done) => {
  const body = req.body
  // get all the errors in an array
  const errorArray = []

  // phone is required, validating it as not empty, valid String and length range.
  if (_.isEmpty(body.phone) || !_.isString(body.phone) || body.phone.length < 11 || body.phone.length > 11) {
    errorArray.push({
      field: 'phone',
      error: 1330,
      message: '\'phone\' is required as string, length must be 11.'
    })
  }

  // password is required, validating it as not empty, valid String and length range.
  if (_.isEmpty(body.password) || !_.isString(body.password) || body.password.length < 8 || body.password.length > 16) {
    errorArray.push({
      field: 'password',
      error: 1333,
      message: '\'password\' is required as string, length must be between 8 and 16.'
    })
  }

  // otp is required, validating as not empty, valid numeric value with range.
  if (!body.otp || isNaN(body.otp) || body.otp < 1000 || body.otp > 9999) {
    errorArray.push({
      field: 'otp',
      error: 1336,
      message: '\'otp\' is required as numeric, range must be between 1000 and 9999.'
    })
  }

  if (errorArray.length) {
    return generalMiddleware.standardErrorResponse(res, errorArray, 'user.middleware.validateResetPasswordPhone')
  }

  return done()
}

// Update User Validations
const validateUpdateUser = (req, res, done) => {
  const errorArray = []
  const body = req.body
  let id = req.params.id
  const validatedData = {}

  if (req.user.RoleId === 1) {
    // password is an optional numeric property, if it is given than validate it.
    if (body.hasOwnProperty('password') && body.password) {
      // password is required, validating it as not empty, valid String and length range.
      if (body.password.length < 8) {
        errorArray.push({
          field: 'password',
          error: 1015,
          message: '\'password\' is required as string, length must be between 8 and 16.'
        })
      }
      validatedData.password = body.password
    }
  }

  // if (req.user.role == 'Admin') {
  //   // isVerified is an optional string property, if it is given than validate it.
  //   if (body.hasOwnProperty('isVerified')) {
  //     // Validating as not empty, valid String and length range.
  //     if (!body.isVerified || (body.isVerified != 'true' && body.isVerified != 'false')) {
  //       errorArray.push({
  //         field: 'isVerified ',
  //         error: 1148,
  //         message: 'Please provide only valid \'isVerified \' as boolean.'
  //       })
  //     }
  //     try {
  //       validatedData.isVerified = JSON.parse(body.isVerified)
  //     } catch (error) {
  //       console.error(error)
  //     }
  //   }

  //   // isBlocked is an optional string property, if it is given than validate it.
  //   if (body.hasOwnProperty('isBlocked')) {
  //     // Validating as not empty, valid String and length range.
  //     if (!body.isBlocked || (body.isBlocked != 'true' && body.isBlocked != 'false')) {
  //       errorArray.push({
  //         field: 'isBlocked ',
  //         error: 1152,
  //         message: 'Please provide only valid \'isBlocked \' as boolean.'
  //       })
  //     }
  //     try {
  //       validatedData.isBlocked = JSON.parse(body.isBlocked)
  //     } catch (error) {
  //       console.error(error)
  //     }
  //   }
  // } else {
  //   if (id != req.user.id) {
  //     errorArray.push({
  //       field: 'id',
  //       error: 1131,
  //       message: 'You are not allowed to edit this record.'
  //     })
  //   }
  // }

  // id is required, validating as not empty, valid numeric value with range.
  if (!id || isNaN(id)) {
    errorArray.push({
      field: 'id',
      error: 1132,
      message: '\'id\' is required as numeric in params.'
    })
  }

  // fName is an optional string property, if it is given than validate it.
  if (body.hasOwnProperty('fName')) {
    // Validating as not empty, valid String and length range.
    if (_.isEmpty(body.fName) || !_.isString(body.fName) || body.fName.length < 2 || body.fName.length > 100) {
      errorArray.push({
        field: 'fName',
        error: 1133,
        message: 'Please provide only valid \'fName\' as string, length must be between 2 and 100.'
      })
    }
    validatedData.fName = body.fName
  }

  // lName is an optional string property, if it is given than validate it.
  if (body.hasOwnProperty('lName') && !_.isEmpty(body.lName)) {
    // Validating as not empty, valid String and length range.
    if (!_.isString(body.lName) || body.lName.length < 2 || body.lName.length > 100) {
      errorArray.push({
        field: 'lName',
        error: 1136,
        message: 'Please provide only valid \'lName\' as string, length must be between 2 and 100.'
      })
    }
    validatedData.lName = body.lName
  }

  // phone is an optional string property, if it is given than validate it.
  if (body.hasOwnProperty('phone') && !_.isEmpty(body.phone)) {
    // Validating as not empty, valid String and length range.
    if (!_.isString(body.phone) || body.phone.length < 2 || body.phone.length > 100) {
      errorArray.push({
        field: 'phone',
        error: 1136,
        message: 'Please provide only valid \'phone\' as string, length must be between 2 and 100.'
      })
    }
    validatedData.phone = body.phone
  }

  // RoleId is an optional numeric property, if it is given than validate it.
  if (body.hasOwnProperty('RoleId')) {
    // Validating as not empty, valid numeric value with range.
    if (!body.RoleId || isNaN(body.RoleId) || body.RoleId < 1 || body.RoleId > 99999999999) {
      errorArray.push({
        field: 'RoleId',
        error: 5001,
        message: 'Please provide only valid \'RoleId\' as numeric, range must be between 1 and 99999999999.'
      })
    }
    validatedData.RoleId = body.RoleId
  }

  if (body.hasOwnProperty('isVerified') && (body.isVerified == 'true' || body.isVerified == 'false')) {
    try {
      validatedData.isVerified = JSON.parse(body.isVerified)
    } catch (error) {
    }
  }

  if (body.hasOwnProperty('isBlocked') && (body.isBlocked == 'true' || body.isBlocked == 'false')) {
    try {
      validatedData.isBlocked = JSON.parse(body.isBlocked)
    } catch (error) {
    }
  }

  // email is an optional string property, if it is given than validate it.
  if (body.hasOwnProperty('email')) {
    // Validating as not empty, valid String and length range.
    if (_.isEmpty(body.email) || !_.isString(body.email) || body.email.length < 5 || body.email.length > 100 || !(emailReg.test(body.email))) {
      errorArray.push({
        field: 'email',
        error: 1139,
        message: 'Please provide only valid \'email\' as string, length must be between 5 and 100.'
      })
    }
    validatedData.email = body.email
  }

  // Send error Array if error(s).
  if (!_.isEmpty(errorArray)) {
    return generalMiddleware.standardErrorResponse(req, res, errorArray, 'user.middleware.validateUpdateUser')
  }

  if (_.isEmpty(validatedData)) {
    return generalMiddleware.standardErrorResponse(req, res, [{
      field: 'general',
      error: 1154,
      message: 'No data provided to update.'
    }], 'user.middleware.validateUpdateUser')
  }

  req.body = {
    data: validatedData,
    id: id
  }
  return done()
}

const validateChangePassword = (req, res, done) => {
  const body = req.body
  // get all the errors in an array
  const errorArray = []

  if (req.user.role == 'Admin') {
    // phone is required, validating it as not empty, valid String and length range.
    if (_.isEmpty(body.email) || !_.isString(body.email) || body.email.length < 5 || body.email.length > 100 || !(emailReg.test(body.email))) {
      errorArray.push({
        field: 'email',
        error: 1059,
        message: 'Please provide only valid \'email\' as string, length must be between 5 and 100.'
      })
    }
  } else {
    req.body.email = req.user.email
  }

  // password is required, validating it as not empty, valid String and length range.
  if (_.isEmpty(body.password) || !_.isString(body.password)) {
    errorArray.push({
      field: 'password',
      error: 1172,
      message: '\'password\' is required.'
    })
  }

  // newPassword is required, validating it as not empty, valid String and length range.
  if (_.isEmpty(body.newPassword) || !_.isString(body.newPassword) || body.newPassword.length < 8 || body.newPassword.length > 16) {
    errorArray.push({
      field: 'newPassword',
      error: 1373,
      message: '\'newPassword\' is required as string, length must be between 8 and 16.'
    })
  }

  if (errorArray.length) {
    return generalMiddleware.standardErrorResponse(req, res, errorArray, 'user.middleware.validateChangePassword')
  }
  req.body.password = body.password
  req.body.newPassword = body.newPassword

  return done()
}

const verifyOtp = (req, res, done) => {
  const errorArray = []
  const body = req.body
  const validatedBody = {}

  // Validating as not empty, valid String and length range.
  if (_.isEmpty(body.email) || !_.isString(body.email) || body.email.length < 5 || body.email.length > 100 || !(emailReg.test(body.email))) {
    errorArray.push({
      field: 'email',
      error: 1059,
      message: 'Please provide only valid \'email\' as string, length must be between 5 and 100.'
    })
  }

  // otp is required, validating as not empty, valid numeric value with range.
  if (!body.otp) {
    errorArray.push({
      field: 'otp',
      error: 1193,
      message: '\'otp\' is required as numeric, range must be between 1000 and 9999.'
    })
  }

  if (!_.isEmpty(errorArray)) {
    return generalMiddleware.standardErrorResponse(req, res, errorArray, 'user.middleware.verifyOtp')
  }

  validatedBody.email = body.email
  validatedBody.otp = body.otp
  validatedBody.isDeleted = false
  req.conditions = validatedBody
  done()
}

const resendOtp = (req, res, done) => {
  const errorArray = []
  const body = req.body
  const validatedBody = {}

  // Validating as not empty, valid String and length range.
  if (_.isEmpty(body.email) || !_.isString(body.email) || body.email.length < 5 || body.email.length > 100 || !(emailReg.test(body.email))) {
    errorArray.push({
      field: 'email',
      error: 1059,
      message: 'Please provide only valid \'email\' as string, length must be between 5 and 100.'
    })
  }

  if (!_.isEmpty(errorArray)) {
    return generalMiddleware.standardErrorResponse(req, res, errorArray, 'user.middleware.resendOtp')
  }

  validatedBody.email = body.email
  validatedBody.isDeleted = false
  req.conditions = validatedBody
  done()
}

const resendOtpPhone = (req, res, done) => {
  const errorArray = []
  const body = req.body
  const validatedBody = {}

  // Validating as not empty, valid String and length range.
  if (!body.phone || isNaN(body.phone) || body.phone.length < 11 || body.phone.length > 11) {
    errorArray.push({
      field: 'phone',
      error: 1200,
      message: 'Please provide only valid \'phone\' as 03001231234, length must be 11.'
    })
  }

  if (!_.isEmpty(errorArray)) {
    return generalMiddleware.standardErrorResponse(res, errorArray, 'user.middleware.resendOtpPhone')
  }

  validatedBody.phone = body.phone
  validatedBody.isDeleted = false
  req.conditions = validatedBody
  done()
}

const validateDeleteUser = (req, res, done) => {
  const errorArray = []
  const params = req.params

  if (req.user.role != 'Admin') {
    // errorArray.push({
    //   field: 'd',
    //   error: 1350,
    //   message: 'You are not allowed to delete record.'
    // })
  }

  if (!params.id || isNaN(params.id)) {
    errorArray.push({
      field: 'id',
      error: 1351,
      message: 'Please provide only valid \'id\' as numeric.'
    })
  }

  if (!_.isEmpty(errorArray)) {
    return generalMiddleware.standardErrorResponse(req, res, errorArray, 'user.middleware.validateDeleteUser')
  }
  done()
}

// New User validation
const validateAddNewUser = (req, res, done) => {
  const body = req.body
  // console.log('body------', body)
  const validatedBody = {}
  // get all the errors in an array
  const errorArray = []

  // fName is required, validating it as not empty, valid String and length range.
  if (_.isEmpty(body.fName) || !_.isString(body.fName) || body.fName.length < 2 || body.fName.length > 100) {
    errorArray.push({
      field: 'fName',
      error: 1000,
      message: '\'fName\' is required as string, length must be between 2 and 100.'
    })
  }

  // lName is an optional string property, if it is given than validate it.
  if (body.hasOwnProperty('lName') && body.lName != '') {
    // Validating as not empty, valid String and length range.
    if (!_.isString(body.lName) || body.lName.length < 2 || body.lName.length > 100) {
      errorArray.push({
        field: 'lName',
        error: 1003,
        message: 'Please provide only valid \'lName\' as string, length must be between 2 and 100.'
      })
    }
  }

  // email is an optional string property, if it is given than validate it.
  if (body.hasOwnProperty('email') && body.email != '') {
    // Validating as not empty, valid String and length range.
    if (!_.isString(body.email) || body.email.length < 5 || body.email.length > 100 || !(emailReg.test(body.email))) {
      errorArray.push({
        field: 'email',
        error: 1006,
        message: 'Please provide only valid \'email\' as string, length must be between 5 and 100.'
      })
    }
  }

  // phone is required, validating it as not empty, valid String and length range.
  if (_.isEmpty(body.phone) || !_.isString(body.phone) || body.phone.length < 10 || body.phone.length > 14) {
    errorArray.push({
      field: 'phone',
      error: 1009,
      message: '\'phone\' is required as string, length must be 11.'
    })
  }

  // RoleId is an optional numeric property, if it is given than validate it.
  // Validating as not empty, valid numeric value with range.
  if (_.isEmpty(body.RoleId) || isNaN(body.RoleId) || body.RoleId < 1 || body.RoleId > 99999999999) {
    errorArray.push({
      field: 'RoleId',
      error: 5001,
      message: 'Please provide only valid \'RoleId\' as numeric, range must be between 1 and 99999999999.'
    })
  }

  // isVerified is required, validating it as not empty, valid Boolean value true or false.
  if (_.isEmpty(body.isVerified) || !_.isString(body.isVerified) || (body.isBlocked != 'true' && body.isBlocked != 'false')) {
    errorArray.push({
      field: 'isVerified',
      error: 1000,
      message: '\'isVerified\' is required as Boolean true or false.'
    })
  }

  // isBlocked is required, validating it as not empty, valid Boolean value true or false.
  if (_.isEmpty(body.isBlocked) || !_.isString(body.isBlocked) || (body.isBlocked != 'true' && body.isBlocked != 'false')) {
    errorArray.push({
      field: 'isBlocked',
      error: 1000,
      message: '\'isBlocked\' is required as Boolean true or false.'
    })
  }

  // password is required, validating it as not empty, valid String and length range.
  if (_.isEmpty(body.password) || !_.isString(body.password) || body.password.length < 8) {
    errorArray.push({
      field: 'password',
      error: 1015,
      message: '\'password\' is required as string, length must be between 8 and 16.'
    })
  }

  // send array if error(s)
  if (errorArray.length) {
    return generalMiddleware.standardErrorResponse(req, res, errorArray, 'user.middleware.validateSignUp')
  }
  validatedBody.fName = body.fName
  validatedBody.lName = body.lName
  validatedBody.password = body.password
  validatedBody.email = body.email
  validatedBody.phone = body.phone
  validatedBody.RoleId = body.RoleId
  validatedBody.isBlocked = body.isBlocked
  validatedBody.isVerified = body.isVerified
  req.body = validatedBody
  done()
}

module.exports = {
  validateSignUp,
  validateLoginCredentials,
  validateGetUsers,
  validateGetUserCurrent,
  validateForgotPassword,
  validateForgotPasswordPhone,
  validateResetPassword,
  validateResetPasswordPhone,
  validateUpdateUser,
  validateChangePassword,
  verifyOtp,
  resendOtp,
  resendOtpPhone,
  validateDeleteUser,
  validateAddNewUser,
  validatePhoneLoginCredentials,
  validateCurrentUserProfile
}
