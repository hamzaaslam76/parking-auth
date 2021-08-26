'use strict'

const passport = require('../config/passport')
const moduleMiddleware = require('../middlewares/module.middleware')
const moduleController = require('../controllers/module.controller')

module.exports = function (app, apiVersion) {
  const route = apiVersion + '/module'
  // get module
  app.get(route, passport.authenticate('jwt', { session: false }), moduleMiddleware.validateGetModule, moduleController.getModules)
}
