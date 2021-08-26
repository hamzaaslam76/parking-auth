/**
 * Created by Saleh on 07/02/2019.
 */
'use strict'

const config = require('../config/environment.config')
const jwt = require('jsonwebtoken')
const formidable = require('formidable')
const fs = require('fs')

let newConfig = {
  jwtOptions: {
    'secretOrKey': config.jwtOptions.secretOrKey || process.env.secretOrKey,
    'ignoreExpiration': config.jwtOptions.ignoreExpiration || process.env.ignoreExpiration
  }
}

function uploadFile (file) {
  return new Promise(function (resolve, reject) {
    var stream = fs.createReadStream(file.path)
    var name = Date.now().toString() + '.pdf'
    var data = {
      Key: name,
      ACL: 'public-read',
      Body: stream,
      ContentType: file.type,
      Bucket: process.env.Bucket || config.Bucket
    }
    s3.upload(data, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

const generatePassword = () => {
  let password = generator.generate({
    length: 7,
    numbers: true
  })
  return password
}

// sign jwt token
const signLoginData = (userInfo) => {
  return new Promise((resolve, reject) => {
    var token = jwt.sign(userInfo, newConfig.jwtOptions.secretOrKey, { expiresIn: 180000000 })
    return resolve(token)
  })
}

// a middleware tp attach files and field to form data requests
const attachBodyAndFiles = (req, res, next) => {
  let form = new formidable.IncomingForm()
  form.parse(req, function (err, fields, files) {
    req.body = fields
    req.files = files
    next()
  })
}

module.exports.generatePassword = generatePassword
module.exports.signLoginData = signLoginData
module.exports.uploadFile = uploadFile // upload using aws javascript sdk
module.exports.attachBodyAndFiles = attachBodyAndFiles
