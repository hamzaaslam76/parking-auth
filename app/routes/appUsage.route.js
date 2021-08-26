'use strict'

const appUsageMiddleware = require('../middlewares/appUsage.middleware')
const appUsageController = require('../controllers/appUsage.controller')
const passport = require('../config/passport')

module.exports = function (app, apiVersion) {
  const route = apiVersion

  // get last app usage of user
  app.get(route + '/user/app-usage', passport.authenticate('jwt', { session: false }), appUsageMiddleware.validateGetAppLastUsed, appUsageController.getAppLastUsed)

  // get last app usage of each user (grouped by user)
  app.get(route + '/user/app-usage/grouped', passport.authenticate('jwt', { session: false }), appUsageMiddleware.validateGetAppLastUsedGrouped, appUsageController.getAppLastUsedGrouped)

  // add last app usage of user
  app.post(route + '/user/app-usage', passport.authenticate('jwt', { session: false }), appUsageMiddleware.validateAddAppLastUsed, appUsageController.addAppLastUsed)
}
