'use strict'
const SERVER_RESPONSE = require('../config/serverResponses')
const userHelper = require('../helpers/user.helper')
const StandardError = require('standard-error')
const generalController = require('./general.controller')

// Create New User
const signUp = function (req, res) {
  return userHelper.signUp(req.validatedBody)
    .then((data) => {
      generalController.successResponse(req, res, 'User signUp successfully.', data, 'user.controller.signUp')
    }).catch(StandardError, (err) => {
      generalController.errorResponse(req, res, err, null, 'user.controller.signUp', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch((err) => {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'user.controller.signUp', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}

// User Login
const login = function (req, res) {
  return userHelper.login(req.body)
    .then((data) => {
      generalController.successResponse(req, res, 'User login successfully.', data, 'user.controller.login')
    }).catch(StandardError, (err) => {
      generalController.errorResponse(req, res, err, null, 'user.controller.login', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch((err) => {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'user.controller.login', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}

// User CNIC Login
const loginPhone = function (req, res) {
  return userHelper.loginPhone(req.body)
    .then((data) => {
      generalController.successResponse(req, res, 'User login successfully.', data, 'user.controller.login')
    }).catch(StandardError, (err) => {
      generalController.errorResponse(req, res, err, null, 'user.controller.login', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch((err) => {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'user.controller.login', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}

// Change Password
const changePassword = function (req, res) {
  return userHelper.changePassword(req.body, req.user.data)
    .then(function (data) {
      generalController.successResponse(req, res, 'Password changed successfully.', data, 'user.controller.changePassword')
    }).catch(StandardError, function (err) {
      generalController.errorResponse(req, res, err, null, 'user.controller.changePassword', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch(function (err) {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'user.controller.changePassword', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}

// Verify email
const verifyOtp = function (req, res) {
  return userHelper.verifyOtp(req.body)
    .then(function (data) {
      generalController.successResponse(req, res, 'Email Verified successfully.', data, 'user.controller.verifyOtp')
    }).catch(StandardError, function (err) {
      generalController.errorResponse(req, res, err, null, 'user.controller.verifyOtp', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch(function (err) {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'user.controller.verifyOtp', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}

// Resend Otp
const resendOtp = function (req, res) {
  return userHelper.resendOtp(req.body)
    .then(function (data) {
      generalController.successResponse(req, res, 'Otp Sent successfully.', data, 'user.controller.verifyOtp')
    }).catch(StandardError, function (err) {
      generalController.errorResponse(req, res, err, null, 'user.controller.resendOtp', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch(function (err) {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'user.controller.resendOtp', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}

// Resend Otp on Phone
const resendOtpPhone = function (req, res) {
  return userHelper.resendOtpPhone(req.body)
    .then(function (data) {
      generalController.successResponse(req, res, 'Otp Sent successfully.', data, 'user.controller.verifyOtp')
    }).catch(StandardError, function (err) {
      generalController.errorResponse(req, res, err, null, 'user.controller.resendOtpPhone', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch(function (err) {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'user.controller.resendOtpPhone', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}

// Get Users
const getUsers = function (req, res) {
  return userHelper.getUsers(req.conditions, req.limit, req.offset)
    .then(function (data) {
      generalController.successResponse(req, res, 'Users fetched successfully.', data, 'user.controller.getUsers')
    }).catch(StandardError, function (err) {
      generalController.errorResponse(req, res, err, null, 'user.controller.getUsers', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch(function (err) {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'user.controller.getUsers', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}

// Forgot Password
const forgotPassword = function (req, res) {
  return userHelper.forgotPassword(req.conditions)
    .then(function (data) {
      generalController.successResponse(req, res, 'Reset pin sent successfully.', data, 'user.controller.forgotPassword')
    }).catch(StandardError, function (err) {
      generalController.errorResponse(req, res, err, null, 'user.controller.forgotPassword', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch(function (err) {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'user.controller.forgotPassword', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}

// reset password
const resetPassword = function (req, res) {
  return userHelper.resetPassword(req.body)
    .then(function (data) {
      generalController.successResponse(req, res, 'Successfully update the user password', data, 'user.controller.resetPassword')
    }).catch(StandardError, function (err) {
      generalController.errorResponse(req, res, err, null, 'user.controller.resetPassword', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch(function (err) {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'user.controller.resetPassword', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}

// reset password using OTP
const resetPasswordPhone = function (req, res) {
  return userHelper.resetPasswordPhone(req.body)
    .then(function (data) {
      generalController.successResponse(req, res, 'Successfully update the user password', data, 'user.controller.resetPasswordPhone')
    }).catch(StandardError, function (err) {
      generalController.errorResponse(req, res, err, null, 'user.controller.resetPasswordPhone', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch(function (err) {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'user.controller.resetPasswordPhone', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}

// Get data of logged in user.
const getLoggedInUser = function (req, res) {
  return userHelper.getLoggedInUser(req.conditions)
    .then(function (data) {
      generalController.successResponse(req, res, 'Successfully found user.', data, 'user.controller.getLoggedInUser')
    }).catch(StandardError, function (err) {
      generalController.errorResponse(req, res, err, null, 'user.controller.getLoggedInUser', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch(function (err) {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'user.controller.getLoggedInUser', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}

// Check input password is correct.
const checkPassword = function (req, res) {
  return userHelper.checkPassword(req.body)
    .then(function (data) {
      generalController.successResponse(req, res, 'Successfully check the user password', data, 'user.controller.checkPassword')
    }).catch(StandardError, function (err) {
      generalController.errorResponse(req, res, err, null, 'user.controller.checkPassword', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch(function (err) {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'user.controller.checkPassword', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}

const updateUser = function (req, res) {
  return userHelper.updateUser(req.body.id, req.body.data)
    .then(function (data) {
      generalController.successResponse(req, res, 'Successfully update the user info', data, 'user.controller.updateUser')
    }).catch(StandardError, function (err) {
      generalController.errorResponse(req, res, err, null, 'user.controller.updateUser', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch(function (err) {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'user.controller.updateUser', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}
const updateCurrentUserProfile = function (req, res) {
  return userHelper.updateCurrentUserProfile(req.conditions, req.validatedBody)
    .then(function (data) {
      generalController.successResponse(req, res, 'Successfully update the user info', data, 'user.controller.updateCurrentUserProfile')
    }).catch(StandardError, function (err) {
      generalController.errorResponse(req, res, err, null, 'user.controller.updateCurrentUserProfile', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch(function (err) {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'user.controller.updateCurrentUserProfile', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}

const checkCurrentPassword = function (req, res) {
  return userHelper.checkPassword({ phone: req.user.phone, password: req.body.password })
    .then(function (data) {
      generalController.successResponse(req, res, 'User password matched', data, 'user.controller.checkCurrentPassword')
    }).catch(StandardError, function (err) {
      generalController.errorResponse(req, res, err, null, 'user.controller.checkCurrentPassword', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch(function (err) {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'user.controller.checkCurrentPassword', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}

const changeCurrentPassword = function (req, res) {
  return userHelper.changePassword(req.body)
    .then(function (data) {
      generalController.successResponse(req, res, 'User password changed successfully', data, 'user.controller.changeCurrentPassword')
    }).catch(StandardError, function (err) {
      generalController.errorResponse(req, res, err, null, 'user.controller.changeCurrentPassword', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch(function (err) {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'user.controller.changeCurrentPassword', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}

const deleteUser = (req, res) => {
  return userHelper.deleteUser(req.params)
    .then(function (data) {
      generalController.successResponse(req, res, 'User deleted successfully', data, 'user.controller.deleteUser')
    }).catch(StandardError, function (err) {
      generalController.errorResponse(req, res, err, null, 'user.controller.deleteUser', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch(function (err) {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'user.controller.deleteUser', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}

// Add New User
const addNewUser = function (req, res) {
  return userHelper.addNewUser(req.body)
    .then((data) => {
      generalController.successResponse(req, res, 'New User successfully Created.', data, 'user.controller.addNewUser')
    }).catch(StandardError, (err) => {
      generalController.errorResponse(req, res, err, null, 'user.controller.addNewUser', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch((err) => {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'user.controller.addNewUser', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}
const refreshToken = (req, res) => {
  return userHelper.refreshTokenHelper(req.user.id)
    .then((data) => {
      generalController.successResponse(req, res, 'User refreshToken successfully.', data, 'user.controller.refreshToken')
    }).catch(StandardError, (err) => {
      generalController.errorResponse(req, res, err, null, 'user.controller.refreshToken', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch((err) => {
      generalController.errorResponse(req, res, err, 'Please check originalError for details', 'user.controller.refreshToken', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}
module.exports = {
  signUp,
  login,
  loginPhone,
  getUsers,
  forgotPassword,
  changePassword,
  checkPassword,
  resetPassword,
  resetPasswordPhone,
  getLoggedInUser,
  updateUser,
  checkCurrentPassword,
  changeCurrentPassword,
  deleteUser,
  verifyOtp,
  resendOtp,
  resendOtpPhone,
  addNewUser,
  updateCurrentUserProfile,
  refreshToken
}
