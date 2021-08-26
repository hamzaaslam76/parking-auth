// file usage example: node FileGenerator.js <file name> <file name>
var fs = require('fs')

var myArgs = process.argv.slice(2)

const getRouteContent = fileName => {
  return `'use strict'

    const ${fileName}Middleware = require('../middlewares/${fileName}.middleware')
    const ${fileName}Controller = require('../controllers/${fileName}.controller')
    
    module.exports = function (app, apiVersion) {
      const route = apiVersion
      // add ${fileName}
      app.post(route + '/${fileName}', ${fileName}Middleware.validateAdd, ${fileName}Controller.add)
    
    }
    `
}

const getMiddlewareContent = fileName => {
  return `'use strict'
    const generalMiddleware = require('./general.middleware')
    const _ = require('lodash')
    
    const validateAdd = (req, res, done) => {
        const errorArray = []
        const body = req.body
        const validatedBody = {}
        
        console.log(body)
        // name is required, validating it as not empty, valid String and length range.
        if (_.isEmpty(body.name) || !_.isString(body.name) || body.name.length < 2 || body.name.length > 50) {
          errorArray.push({
            field: 'name',
            error: 5001,
            message: 'name is required as string, length must be between 2 and 50.'
          })
        }
    
        if (!_.isEmpty(errorArray)) {
          return generalMiddleware.standardErrorResponse(res, errorArray, '${fileName}.middleware.validateAdd')
        }
        validatedBody.name = body.name
        req.body = validatedBody
        done()
      }
    module.exports = {
      validateAdd
    }
    
    `
}

const getControllerContent = fileName => {
  return `'use strict'
    const SERVER_RESPONSE = require('../config/serverResponses')
    const ${fileName}Helper = require('../helpers/${fileName}.helper')
    const StandardError = require('standard-error')
    const generalController = require('./general.controller')
    // add ${fileName}
    const add = function (req, res) {
  return ${fileName}Helper.add${fileName}(req.body.${fileName})
    .then(function (data) {
      generalController.successResponse(req, res, '${fileName}s added successfully.', data, '${fileName}.controller.add')
    }).catch(StandardError, function (err) {
      generalController.errorResponse(res, err, null, '${fileName}.controller.add', SERVER_RESPONSE.VALIDATION_ERROR)
    }).catch(function (err) {
      generalController.errorResponse(res, err, 'Please check originalError for details', '${fileName}.controller.add', SERVER_RESPONSE.INTERNAL_SERVER_ERROR)
    })
}
    module.exports = {
      add
    }
    `
}

const getHelperContent = fileName => {
  return `'use strict'
        const db = require('../config/sequelize.config')
        const Op = db.Sequelize.Op
        const generalHelpingMethods = require('./general.helper')
        const _ = require('lodash')
        function add (${fileName}) {
          
              
              }
          
          
        module.exports = {
           add
          }
        
        `
}

myArgs.forEach(element => {
  // Helper Function
  const a = getHelperContent(element)
  fs.writeFile(`./app/helpers/${element}.helper.js`, a, err => {
    if (err) throw err
    console.log(`${element}.helper.js created successfully.`)
  }
  )

  // Middleware
  fs.writeFile(`./app/middlewares/${element}.middleware.js`, getMiddlewareContent(element), err => {
    if (err) throw err
    console.log(`${element}.middleware.js created successfully.`)
  }
  )

  // Route
  fs.writeFile(`./app/routes/${element}.route.js`, getRouteContent(element), err => {
    if (err) throw err
    console.log(`${element}.route.js created successfully.`)
  }
  )

  // Controller
  fs.writeFile(`./app/controllers/${element}.controller.js`, getControllerContent(element), err => {
    if (err) throw err
    console.log(`${element}.controller.js created successfully.`)
  }
  )
})
