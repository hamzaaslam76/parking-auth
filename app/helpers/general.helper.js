/**
 * Created by Saleh on 07/02/2019.
 */
'use strict'

var PromiseReturns = require('bluebird')
var StandardError = require('standard-error')
var _ = require('lodash')
var fs = require('fs')
var nodemailer = require('nodemailer')
const sgMail = require('@sendgrid/mail')
// Check if user has permission or not
function checkIfUserHasPermission (permissionName, permissionsArray) {
  for (let i = 0; i < permissionsArray.length; i++) {
    if (permissionName === permissionsArray[i].moduleName) {
      return true
    }
  }
  return false
}

function rejectPromise (message, code = null) {
  // winston.error(message)
  return new PromiseReturns(function (resolve, reject) {
    reject(new StandardError({
      status: 'Error',
      message: message,
      statusCode: code
    }))
  })
}

function catchException (err) {
  // winston.error(err)
  return rejectPromise(err.message, err.statusCode)
}

function putS3Object (s3, params) {
  return new PromiseReturns(function (resolve, reject) {
    s3.putObject(params, function (err) {
      if (err) {
        return rejectPromiseReturns(reject, err)
      }
      resolve()
    })
  })
}

function uploadImageToS3 (imageFile) {
  return new PromiseReturns(function (resolve) {
    if (imageFile) {
      var file = imageFile
      var fileName = file.originalname
      var filePath = config.s3.host_name + config.s3.bucket + '/' + config.s3.paths.original + fileName
      var s3Key = config.s3.paths.original + fileName

      AWS.config.update(config.s3.credentials)
      var s3 = new AWS.S3({ params: { Bucket: config.s3.bucket } })
      var params = {
        Key: s3Key,
        Body: fs.createReadStream(file.path),
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: 'application/octet-stream'
      }
      var obj = {
        s3: s3,
        params: params,
        filePath: filePath
      }
      return resolve(obj)
    } else {
      resolve(null)
    }
  })
}

const sendEmail = async (fromEmail, toEmail, subject, textMessage, htmlPage) => {
  let mailService = {
    // service: 'gmail',
    host: 'mail.gplroad.com',
    port: 465,
    secure: true,
    auth: {
      user: 'admin@gplroad.com' || process.env.EMAIL_USER,
      pass: 'uOr0vPfwp4g]' || process.env.EMAIL_PASS
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    mailService.host = 'smtp.mailtrap.io'
    mailService.port = 2525
    mailService.auth.user = 'c07e8050785455'
    mailService.auth.pass = '497702da1f6e4a'
    mailService.secure = false
  }
  // create a transporter
  const transporter = nodemailer.createTransport(mailService)
  // define email option
  const mailOption = {
    from: fromEmail,
    to: toEmail,
    subject: subject,
    text: textMessage,
    html: htmlPage
  }
  // 3 actually send the email
  await transporter.sendMail(mailOption)
}

const getTemplate = (type, data) => {
  let html = ''
  let ref = 'https://parkingclient.gplroad.com/auth/verify/'
  if (process.env.NODE_ENV !== 'production') {
    ref = 'http://localhost:4200/auth/verify/'
  }

  switch (type) {
    case 'registration':
      html = `<h1>Account Verification</h1>
      <h2>Hello ${data.name}</h2>
      <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
      <a href=${ref}${data.otp}/${data.email}> Click here</a>`
      break
    case 'appRegistration':
      html = `<h1>Account Verification</h1>
      <h2>Hello ${data.name}</h2>
      <p>Your account verification OTP is</p>
      <p>${data.otp}</p>`
      break
    case 'webForgetPassword':
      html = `<h1>Password Reset</h1>
      <h2>Hello ${data.name}</h2>
      <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
      <a href=${ref}${data.otp}/${data.email}> Click here</a>`
      break
    case 'appForgetPassword':
      html = `<h1>Password Reset OTP</h1>
        <h2>Hello ${data.name}</h2>
        <p>Your Otp is</p>
        <p>${data.otp}</p>`
      break
    default:
  }
  return html
}

const sendEmailUsingSendGrid = async (fromEmail, toEmail, subject, textMessage, htmlPage) => {
  const API_KEY = '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' || process.env.SENDGRID_API_KEY
  sgMail.setApiKey(API_KEY)
  const msg = {
    to: toEmail, // Change to your recipient
    from: fromEmail, // Change to your verified sender
    subject: subject,
    text: textMessage,
    html: htmlPage
  }
  console.log('mail function call')
  return sgMail
    .send(msg)
    .then((response) => {
      console.log('send email')
    })
    .catch((error) => {
      console.error(error)
    })
}

module.exports = {
  checkIfUserHasPermission,
  rejectPromise,
  catchException,
  putS3Object,
  uploadImageToS3,
  sendEmail,
  getTemplate,
  sendEmailUsingSendGrid
}
