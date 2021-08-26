'use strict'

var fs = require('fs')
var path = require('path')
var Sequelize = require('sequelize')
var _ = require('lodash')
var appConfig = require('./config')
var config = require('./environment.config')
var winston = require('./winston')
var dbseed = require('./dbseed')
var db = {}
var configDb = {}

winston.info('Initializing Sequelize...')
winston.info(process.env.NODE_ENV)

if (process.env.NODE_ENV === 'production') {
  configDb = config.db.production
} else if (process.env.NODE_ENV === 'staging') {
  configDb = config.db.staging
} else if (process.env.NODE_ENV === 'testing') {
  configDb = config.db.testing
} else {
  configDb = config.db.development
}

let sequelize =
  new Sequelize(process.env.DB_DATABASE || configDb.database, process.env.DB_USERNAME || configDb.username, process.env.DB_PASSWORD || configDb.password, {
    host: process.env.DB_HOSTNAME || configDb.host,
    port: 3306,
    dialect: 'mysql'
    // dialectOptions: {
    //   ssl: {
    //     ca: fs.readFileSync(process.cwd() + '/BaltimoreCyberTrustRoot.crt.pem')
    //   }
    // }
    // query:{raw:true}
  })

// loop through all files in models directory ignoring hidden files and this file
fs.readdirSync(appConfig.computedConfig.modelsDir)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
  })
  // import model files and save model names
  .forEach(function (file) {
    // winston.info('Loading model file ' + file)
    var model = sequelize.import(path.join(appConfig.computedConfig.modelsDir, file))
    db[model.name] = model
  })

// invoke associations on each of the models
Object.keys(db).forEach(function (modelName) {
  if (db[modelName].options.hasOwnProperty('associate')) {
    db[modelName].options.associate(db)
  }
})

// Synchronizing any model changes with database.
// set FORCE_DB_SYNC=true in the environment, or the program parameters to drop the database,
//   and force model changes into it, if required
// Caution: Do not set FORCE_DB_SYNC to true for every run to avoid losing data with restarts
sequelize
  .sync({
    force: config.FORCE_DB_SYNC === 'true',
    // force: false,
    logging: config.enableSequelizeLog === 'true' ? winston.verbose : false
  })
  .then(function () {
    if (config.FORCE_DB_SYNC === 'true') {
      winston.info('Database was force dropped: Seeding database...')
      dbseed(db, sequelize)
    }

    winston.info('Database ' + (config.FORCE_DB_SYNC === 'true' ? '*DROPPED* and ' : '') + 'synchronized')
  }).catch(function (err) {
    winston.error('An error occurred: ', err)
  })

// assign the sequelize variables to the db object and returning the db.
module.exports = _.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db)
