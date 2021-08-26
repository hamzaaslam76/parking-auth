'use strict'

const userMiddleware = require('../middlewares/user.middleware')
const userController = require('../controllers/user.controller')
const passport = require('../config/passport')

module.exports = function (app, apiVersion) {
  const route = apiVersion
  console.log('route', route)

  // ------------- Public Apis Start -------------

  // Apis for the internee App.
  // user login phone
  app.post(route + '/login/phone', userMiddleware.validatePhoneLoginCredentials, userController.loginPhone)

  // resend verification otp.
  app.post(route + '/resend-otp/phone', userMiddleware.resendOtpPhone, userController.resendOtpPhone)

  // forgot password
  app.post(route + '/forgot-password/phone', userMiddleware.validateForgotPasswordPhone, userController.forgotPassword)

  // reset password using otp
  app.post(route + '/reset-password/phone', userMiddleware.validateResetPasswordPhone, userController.resetPasswordPhone)

  // Apis for admins
  // user login
  app.post(route + '/login', userMiddleware.validateLoginCredentials, userController.login)

  // user-signup
  app.post(route + '/sign-up', userMiddleware.validateSignUp, userController.signUp)

  // resend verification otp.
  app.post(route + '/resend-otp', userMiddleware.resendOtp, userController.resendOtp)

  // reset password using otp
  app.post(route + '/reset-password', userMiddleware.validateResetPassword, userController.resetPassword)

  // verify account
  app.post(route + '/verify-otp', userMiddleware.verifyOtp, userController.verifyOtp)

  // forgot password
  app.post(route + '/forgot-password', userMiddleware.validateForgotPassword, userController.forgotPassword)

  // ------------- Public Apis End -------------

  // add new user
  app.post(route + '/users', passport.authenticate('jwt', { session: false }), userMiddleware.validateAddNewUser, userController.addNewUser)

  // get users
  app.get(route + '/users', passport.authenticate('jwt', { session: false }), userMiddleware.validateGetUsers, userController.getUsers)

  // get loggedIn User
  app.get(route + '/user/current', passport.authenticate('jwt', { session: false }), userMiddleware.validateGetUserCurrent, userController.getLoggedInUser)

  // update loggedIn User
  app.put(route + '/user/current', passport.authenticate('jwt', { session: false }), userMiddleware.validateCurrentUserProfile, userController.updateCurrentUserProfile)

  // update user
  app.put(route + '/user/:id', passport.authenticate('jwt', { session: false }), userMiddleware.validateUpdateUser, userController.updateUser)

  // check user password
  app.post(route + '/check-password', passport.authenticate('jwt', { session: false }), userMiddleware.validateLoginCredentials, userController.checkPassword)

  // change password
  app.post(route + '/change-password', passport.authenticate('jwt', { session: false }), userMiddleware.validateChangePassword, userController.changeCurrentPassword)

  // delete user
  app.delete(route + '/user/:id', passport.authenticate('jwt', { session: false }), userMiddleware.validateDeleteUser, userController.deleteUser)

  app.get(`${route}/refresh-token`, passport.authenticate('jwt', { session: false }), userController.refreshToken)
}
