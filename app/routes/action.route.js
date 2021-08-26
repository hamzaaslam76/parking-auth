'use strict'

const passport = require('../config/passport')
const actionMiddleware = require('../middlewares/action.middleware')
const actionController = require('../controllers/action.controller')

module.exports = function (app, apiVersion) {
  const route = apiVersion + '/action'
  // get get
  app.get(route, passport.authenticate('jwt', { session: false }), actionMiddleware.validateGetAction, actionController.getActions)
}
