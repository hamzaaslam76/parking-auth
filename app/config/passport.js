'use strict'

const passport = require('passport')
const config = require('./environment.config')
const passportJWT = require('passport-jwt')
const db = require('./sequelize.config')
const _ = require('lodash')

// Handling passport strategy
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const newConfig = {
  jwtOptions: {
    secretOrKey: process.env.secretOrKey || config.jwtOptions.secretOrKey,
    ignoreExpiration: process.env.ignoreExpiration || config.jwtOptions.ignoreExpiration,
    passReqToCallback: process.env.passReqToCallback || config.jwtOptions.passReqToCallback
  }
}

newConfig.jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()

var strategy = new JwtStrategy(newConfig.jwtOptions, (req, jwtPayload, next) => {
  if (!_.isEmpty(jwtPayload.data)) {
    jwtPayload = jwtPayload.data
  }
  next(null, jwtPayload)
})

passport.use(strategy)

module.exports = passport
