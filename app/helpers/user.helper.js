'use strict'

const SERVER_RESPONSE = require('../config/serverResponses')
const db = require('../config/sequelize.config')
const generalHelpingMethods = require('./general.helper')
const helpingHelperMethods = require('./helping.helper')
const _ = require('lodash')
const Op = db.Sequelize.Op
const uuid = require('uuid/v4')

// User signUp
function signUp (input) {
  let now = new Date()
  now.setMinutes(now.getMinutes() + 10) // timestamp
  now = new Date(now) // Date object
  let userObj = {
    fName: input.fName,
    lName: input.lName,
    email: input.email || '',
    otp: input.otp,
    otpValidTill: now,
    phone: input.phone,
    language: input.language,
    RoleId: input.RoleId || 2
    // signupDevice: input.signupDevice || null
  }

  const userFindConditions = []
  if (userObj.email) {
    userFindConditions.push({
      email: userObj.email
    })
  }

  if (userObj.phone) {
    userFindConditions.push({
      phone: userObj.phone
    })
  }

  // check if input phone already exist
  return db.User.findOne({
    where: {
      [Op.or]: userFindConditions,
      isDeleted: false
    }
  })
    // execute all these functions
    .then(async (user) => {
      const errorsArray = []
      // check user existence
      if (user) {
        if (user.phone === userObj.phone) {
          // user phone already exist.
          errorsArray.push({
            field: 'phone',
            error: 1500,
            message: 'phone already exist'
          })
        }

        if (user.email === userObj.email) {
          // user email already exist.
          errorsArray.push({
            field: 'email',
            error: 1505,
            message: 'email already exist'
          })
        }

        return generalHelpingMethods.rejectPromise(errorsArray, SERVER_RESPONSE.CONFLICT)
      }

      let newUser = db.User.build(userObj)
      newUser.salt = newUser.makeSalt()
      newUser.hashedPassword = newUser.encryptPassword(input.password, newUser.salt)
      await newUser.save()
      const data = {
        name: newUser.fName,
        email: newUser.email,
        otp: newUser.otp
      }
      // send verification email/sms code here
      let html = generalHelpingMethods.getTemplate('registration', data)
      if (newUser.RoleId === 3 || newUser.RoleId === 4) {
        html = generalHelpingMethods.getTemplate('appRegistration', data)
      }
      await generalHelpingMethods.sendEmailUsingSendGrid('hamzaaslam769@gmail.com', newUser.email, 'Please confirm your account', 'message', html)

      // end send email
      return {
        id: newUser.id,
        fName: newUser.fName,
        lName: newUser.lName,
        email: newUser.email,
        phone: newUser.phone,
        password: newUser.password,
        RoleId: newUser.RoleId,
        isVerified: newUser.isVerified,
        isBlocked: newUser.isBlocked,
        language: newUser.language
      }
    })
    .catch(generalHelpingMethods.catchException)
}

// user Login
const login = (input) => {
  let email = input.email
  let password = input.password
  let userData = {}

  // check if email exist and isDeleted equal to false
  return db.User.findOne({ where: { email: email, isDeleted: false } })
    .then((user) => {
      if (!user || !user.salt || !user.hashedPassword) {
        // user not found, throw error
        return generalHelpingMethods.rejectPromise([{
          field: 'email',
          error: 1540,
          message: 'Invalid email or Password'
        }])
      } else if (!user.authenticate(password)) {
        // user not authenticated, throw error
        return generalHelpingMethods.rejectPromise([{
          field: 'phone',
          error: 1543,
          message: 'Invalid email or Password'
        }])
      } else {
        // convert mongoose document object to plain json object and return user
        return user.toJSON()
      }
    })
    .then((user) => {
      userData.userInfo = user
      return db.Role.findOne({
        where: {
          id: user.RoleId,
          isDeleted: false,
          isActive: true }
      })
    })
    .then(async (role) => {
      if (!role) {
        // Active and not deleted role not found, throw error
        return generalHelpingMethods.rejectPromise([{
          field: 'Role',
          error: 1546,
          message: 'Role is not defined'
        }])
      }
      userData.userInfo.role = role.name
      let query = ''
      if (role.id === 2) {
        query = `select id from Clients where UserId = ${userData.userInfo.id} and isProfile = true`
      } else if (role.id == 4) {
        query = `select id from Inspectors where UserId = ${userData.userInfo.id}`
      }

      if (query) {
        await db.sequelize.query(query, {
          type: db.sequelize.QueryTypes.SELECT
        })
          .then((result) => {
            if (result && result.length) {
              userData.userInfo.employeeId = result[0].id
            }
          })
      }

      await db.Permission.findAll({
        where: { RoleId: userData.userInfo.RoleId },
        attributes: ['ModuleActionId']
      })
        .then(async (result) => {
          if (result) {
            let moduleActionIds = result.map(x => x.ModuleActionId)
            await db.Module.findAll({
              attributes: ['title', 'identifier'],
              include: [
                {
                  model: db.Action,
                  required: true,
                  as: 'actions',
                  attributes: ['title', 'identifier'],
                  through: {
                    where: { id: moduleActionIds },
                    attributes: []
                  }
                }
              ]
            }).then(result => {
              userData.userInfo.permissions = result
            })
          } else {
            userData.userInfo.permissions = []
          }
        })

      const tokenData = {
        id: userData.userInfo.id,
        fName: userData.userInfo.fName,
        lName: userData.userInfo.lName,
        email: userData.userInfo.email,
        phone: userData.userInfo.phone,
        RoleId: userData.userInfo.RoleId,
        role: role.name
      }

      if (userData.userInfo.employeeId) {
        tokenData.employeeId = userData.userInfo.employeeId
      }

      userData.userInfo = {
        ...tokenData,
        permissions: userData.userInfo.permissions,
        isVerified: userData.userInfo.isVerified,
        isBlocked: userData.userInfo.isBlocked,
        language: userData.userInfo.language
      }

      return helpingHelperMethods.signLoginData({ data: tokenData })
    })
    .then((tokenData) => {
      userData.tokenInfo = tokenData
      return userData
    })
    .catch(generalHelpingMethods.catchException)
}

// user phone Login
function loginPhone (input) {
  let phone = input.phone
  let password = input.password
  let userData = {}
  let roleData = {}

  // check if phone exist and isDeleted equal to false
  return db.User.findOne({ where: { phone: phone, isDeleted: false } })
    .then((user) => {
      if (!user || !user.salt || !user.hashedPassword) {
        // user not found, throw error
        return generalHelpingMethods.rejectPromise([{
          field: 'phone',
          error: 1540,
          message: 'Invalid phone or Password'
        }])
      } else if (!user.authenticate(password)) {
        // user not authenticated, throw error
        return generalHelpingMethods.rejectPromise([{
          field: 'phone',
          error: 1543,
          message: 'Invalid phone or Password'
        }])
      } else {
        // convert mongoose document object to plain json object and return user
        return user.toJSON()
      }
    })
    .then((user) => {
      console.log('user', user)
      userData.userInfo = user
      return db.Role.findOne({ where: { id: user.RoleId, isDeleted: false } })
    })
    .then((role) => {
      console.log('role', role)
      if (!role) {
        // Active and not deleted role not found, throw error
        return generalHelpingMethods.rejectPromise([{
          field: 'Role',
          error: 1546,
          message: 'Role is not defined'
        }])
      }
      roleData = role
      let query = ''

      if (role.id === 2) {
        query = 'SELECT `id`,`RegionId` FROM `Supervisors` WHERE `UserId`=' + userData.userInfo.id
      } else if (role.id === 3) {
        query = 'SELECT `id`,`RegionId` FROM `Internees` WHERE `UserId`=' + userData.userInfo.id
      } else {
        // Active and not deleted role not found, throw error
        return generalHelpingMethods.rejectPromise([{
          field: 'Role',
          error: 1547,
          message: 'You are not authorized to login here'
        }])
      }

      return db.sequelize.query(query, {
        type: db.sequelize.QueryTypes.SELECT
      })
    })
    .then(async (employee) => {
      if (_.isEmpty(employee)) {
        // Active and not deleted role not found, throw error
        return generalHelpingMethods.rejectPromise([{
          field: 'Role',
          error: 1547,
          message: 'No associated employee found'
        }])
      }

      userData.userInfo.role = roleData.title
      // userData.userInfo.permissions = role.permissions

      let tokenData = {
        id: userData.userInfo.id,
        fName: userData.userInfo.fName,
        lName: userData.userInfo.lName,
        email: userData.userInfo.email,
        phone: userData.userInfo.phone,
        RoleId: userData.userInfo.RoleId,
        role: userData.userInfo.role,
        employeeId: employee[0].id,
        regionId: employee[0].RegionId
      }

      const sql = 'SELECT r.name as UC, r1.name as Tehsil, r1.id as TehsilId, r2.name as District, r2.id as DistrictId FROM Regions r' +
        ' INNER JOIN Regions r1 ON r.ParentId = r1.id' +
        ' INNER JOIN Regions r2 ON r1.ParentId = r2.id' +
        ' WHERE r.id=' + employee[0].RegionId

      const region = await db.sequelize.query(sql, {
        type: db.sequelize.QueryTypes.SELECT
      })

      console.log('region', region)
      if (!_.isEmpty(region)) {
        tokenData = {
          ...tokenData,
          ...region[0]
        }
      }
      console.log(tokenData)

      userData.userInfo = {
        ...tokenData,
        isVerified: userData.userInfo.isVerified,
        isBlocked: userData.userInfo.isBlocked,
        language: userData.userInfo.language
      }

      return helpingHelperMethods.signLoginData({ data: tokenData })
    })
    .then((tokenData) => {
      userData.tokenInfo = tokenData
      // console.log(userData)
      return userData
    })
}

// get users
function getUsers (conditions, limit = 500, offset = 0) {
  console.log('conditions', conditions.roles)
  const includes = []

  if (conditions.roles) {
    includes.push({ model: db.Role, as: 'role', where: { isDeleted: false } })
  }
  // Check if user exist in conditions
  return db.User.findAll({
    where: conditions,
    // include: [{ model: db.Role, as: 'role', required: false, where: { isDeleted: false } }],
    limit: limit,
    offset: offset
  })
    .then(async (users) => {
      const count = await db.User.count({
        where: conditions
      })
      // return user
      return {
        records: users,
        count: count
      }
    })
}

// Forgot Password
function forgotPassword (conditions) {
  // Check if user exist in conditions
  return db.User.findOne({ where: conditions })
    .then((user) => {
      if (!user) {
        // user not found, throw error
        return generalHelpingMethods.rejectPromise([{
          field: 'Role',
          error: 1561,
          message: 'No user found against this phone/email'
        }])
      }
      // console.log(user)
      let now = new Date()
      now.setMinutes(now.getMinutes() + 10) // timestamp
      now = new Date(now) // Date object

      user.otpValidTill = now
      user.otp = uuid()
      if (user.dataValues.RoleId === 3 || user.dataValues.RoleId === 4) {
        user.otp = Math.round(Math.random() * 9000 + 1000)
      }
      return user.save().then(async (response) => {
        let html
        const data = {
          name: response.dataValues.fName,
          email: response.dataValues.email,
          otp: response.otp
        }
        if (response.dataValues.RoleId === 3 || response.dataValues.RoleId === 4) {
          html = generalHelpingMethods.getTemplate('appForgetPassword', data)
        } else {
          html = generalHelpingMethods.getTemplate('webForgetPassword', data)
        }
        // Send email
        await generalHelpingMethods.sendEmailUsingSendGrid('<admin@gplroad.com>', response.dataValues.email, 'Please confirm your account', 'message', html)
        console.log('Send email', user)
        return true
      })
    })
}

// check reset passwords
const resetPassword = (input) => {
  // check if email exist and isDeleted equal to false
  return db.User.findOne({
    where: {
      email: input.email,
      isDeleted: false
    }
  })
    .then(async (user) => {
      if (!user) {
        // user not found, throw error
        return generalHelpingMethods.rejectPromise([{
          field: '',
          error: 1569,
          message: 'User not found'
        }])
      }

      // Validate otp
      if (user.otp !== input.otp || !input.otp || Date.parse(user.otpValidTill) < Date.parse(new Date())) {
        return generalHelpingMethods.rejectPromise([{
          field: 'otp',
          error: 1570,
          message: 'Otp not valid or expired'
        }])
      }

      user.salt = user.makeSalt()
      // hashing password, encrypted
      user.hashedPassword = user.encryptPassword(input.password, user.salt)
      user.isVerified = true
      user.otp = ''

      // save user
      await user.save()
      return user.toJSON()
    })
}

// check reset passwords
const resetPasswordPhone = (input) => {
  // check if phone exist and isDeleted equal to false
  return db.User.findOne({
    where: {
      phone: input.phone,
      isBlocked: false,
      isDeleted: false
    }
  })
    .then(async (user) => {
      if (!user) {
        // user not found, throw error
        return generalHelpingMethods.rejectPromise([{
          field: '',
          error: 1569,
          message: 'User not found'
        }])
      }

      // Validate otp
      if (user.otp !== input.otp || !input.otp || Date.parse(user.otpValidTill) < Date.parse(new Date())) {
        return generalHelpingMethods.rejectPromise([{
          field: 'otp',
          error: 1570,
          message: 'Otp not valid or expired'
        }])
      }

      user.salt = user.makeSalt()
      // hashing password, encrypted
      user.hashedPassword = user.encryptPassword(input.password, user.salt)
      user.isVerified = true
      user.otp = null
      user.otpValidTill = null

      // save user
      await user.save()
      return user.toJSON()
    })
}

function getLoggedInUser (conditions) {
  // Find user against id.
  console.log('conditions', conditions)
  return db.User.findOne({
    where: {
      id: conditions.UserId,
      isDeleted: false
    }
  })
    .then((user) => {
      console.log('user', user)
      return user
    })
}

// Check password
const checkPassword = (input) => {
  let email = input.email
  let password = input.password
  // check if email exist and isDeleted equal to false
  return db.User.findOne({
    where: {
      email: email,
      isDeleted: false
    }
  })
    .then((user) => {
      if (!user) {
        // user not found, throw error
        return generalHelpingMethods.rejectPromise([{
          field: 'Role',
          error: 1564,
          message: 'User not found'
        }])
      }

      if (!user.authenticate(password)) {
        return 'false'
      }
      return true
    })
}

// check reset passwords
const changePassword = (input) => {
  // check if phone exist and isDeleted equal to false
  return db.User.findOne({
    where: {
      email: input.email,
      isDeleted: false
    }
  })
    .then(async (user) => {
      if (!user) {
        // user not found, throw error
        return generalHelpingMethods.rejectPromise([{
          field: '',
          error: 1903,
          message: 'User not found'
        }])
      }

      // Validate password
      if (!user.authenticate(input.password)) {
        return generalHelpingMethods.rejectPromise([{
          field: 'password',
          error: 1906,
          message: 'Password not valid'
        }])
      }

      user.salt = user.makeSalt()
      // hashing newPassword, encrypted
      user.hashedPassword = user.encryptPassword(input.newPassword, user.salt)

      // save user
      await user.save()
      return user.toJSON()
    })
}

const updateUser = (id, data) => {
  return db.User.findOne({
    where: {
      id: id,
      isDeleted: false
    }
  })
    .then(async (user) => {
      if (_.isEmpty(user)) {
        // User not found, return error
        return generalHelpingMethods.rejectPromise([{
          field: 'id',
          error: 1572,
          message: 'User not found.'
        }])
      }

      if (data.password) {
        user.salt = user.makeSalt()
        // hashing newPassword, encrypted
        user.hashedPassword = user.encryptPassword(data.password, user.salt)
        await user.save()
      }

      // Update user
      user.set(data)
      await user.save()

      return user.toJSON()
    })
}

// update current user profile
const updateCurrentUserProfile = (conditions, data) => {
  console.log('print conditions', conditions)
  return db.User.findOne({
    where: conditions
  })
    .then(async (user) => {
      if (_.isEmpty(user)) {
        // User not found, return error
        return generalHelpingMethods.rejectPromise([{
          field: 'id',
          error: 1572,
          message: 'User not found.'
        }])
      }
      // Update user
      user.set(data)
      await user.save()
      return user.toJSON()
    })
}

const deleteUser = (input) => {
  return db.User.findOne({
    where: {
      id: input.id,
      isDeleted: false
    }
  })
    .then((user) => {
      if (_.isEmpty(user)) {
        // Employee not found, return error
        return generalHelpingMethods.rejectPromise([{
          field: 'id',
          error: 1575,
          message: 'No user found against given id.'
        }])
      }
      // employee found, change value of isDeleted to true
      user.isDeleted = true
      // save employee
      user.save()
      return true
    })
}

// Verify email
function verifyOtp (input, res) {
  let email = input.email
  let otp = input.otp

  // check if phone exist and isDeleted equal to false
  return db.User.findOne({ where: { email: email, isVerified: false, isDeleted: false } })
    .then((user) => {
      if (!user) {
        // user not found, throw error
        return false
      }

      // user.otp = parseInt(user.otp, 10)

      // matching otp against user verification code
      if (otp !== user.otp || Date.parse(user.otpValidTill) < Date.parse(new Date())) {
        return false
      }

      user.otp = ''
      user.isVerified = true
      user.save()
      return true
    })
}

const confirmUserHelper = (otp) => {
  console.log('helper ', otp)
  return db.User.findOne({ where: { otp, isBlocked: false } })
    .then((user) => {
      if (!user) {
        // user not found, throw error
        return generalHelpingMethods.rejectPromise([{
          field: 'otp',
          error: 1583,
          message: 'Invalid otp'
        }])
      }

      user.isVerified = true
      user.save()

      // Send otp
      return true
    })
}

// Resend otp
function resendOtp (input) {
  let email = input.email

  // check if phone exist and isDeleted equal to false
  return db.User.findOne({ where: { email: email, isBlocked: false } })
    .then((user) => {
      if (!user) {
        // user not found, throw error
        return generalHelpingMethods.rejectPromise([{
          field: 'email',
          error: 1583,
          message: 'Invalid email'
        }])
      }

      let now = new Date()
      now.setMinutes(now.getMinutes() + 10) // timestamp
      now = new Date(now) // Date object

      user.otpValidTill = now
      user.otp = uuid()
      if (user.dataValues.RoleId === 3 || user.dataValues.RoleId === 4) {
        user.otp = Math.round(Math.random() * 9000 + 1000)
      }
      return user.save().then(async (response) => {
        let html
        const data = {
          name: response.dataValues.fName,
          email: response.dataValues.email,
          otp: response.otp
        }
        if (response.dataValues.RoleId === 3 || response.dataValues.RoleId === 4) {
          html = generalHelpingMethods.getTemplate('appForgetPassword', data)
        } else {
          html = generalHelpingMethods.getTemplate('webForgetPassword', data)
        }
        // Send email
        await generalHelpingMethods.sendEmailUsingSendGrid('<admin@gplroad.com>', response.dataValues.email, 'Please confirm your account', 'message', html)
        console.log('Send email', user)
        return true
      })
    })
}

// Resend otp
function resendOtpPhone (input) {
  let phone = input.phone

  // check if phone exist and isDeleted equal to false
  return db.User.findOne({ where: { phone: phone, isBlocked: false } })
    .then(async (user) => {
      if (!user) {
        // user not found, throw error
        return generalHelpingMethods.rejectPromise([{
          field: 'phone',
          error: 1583,
          message: 'Invalid Phone'
        }])
      }

      // if otp is expired generate new otp with next 10 min validity
      if (!user.otp || Date.parse(user.otpValidTill) < Date.parse(new Date())) {
        let now = new Date()
        now.setMinutes(now.getMinutes() + 10) // timestamp
        now = new Date(now) // Date object

        user.otpValidTill = now
        // TODO;
        // user.otp = Math.round(Math.random() * 9000 + 1000)
        user.otp = 9999
        await user.save()
      }

      // TODO; Send otp

      return true
    })
}

// add New User function
function addNewUser (input) {
  console.log('user----->', input)
  // insert User
  let userObj = {
    fName: input.fName,
    lName: input.lName,
    email: input.email,
    // otp: Math.round(Math.random() * 9000 + 1000),
    // otpValidTill: now,
    phone: input.phone,
    cnic: input.cnic,
    RoleId: input.RoleId,
    isVerified: input.isVerified,
    isBlocked: input.isBlocked
  }

  // check if input email already exist
  return db.User.findOne({ where: { email: userObj.email } })
    // execute all these functions
    .then(async (user) => {
      const errorsArray = []
      // // check user existence
      if (user) {
        // user phone already exist.
        errorsArray.push({
          field: 'email',
          error: 1500,
          message: 'email already exist'
        })
      }

      if (!_.isEmpty(errorsArray)) {
        return generalHelpingMethods.rejectPromise(errorsArray, SERVER_RESPONSE.CONFLICT)
      }

      let newUser = db.User.build(userObj)
      newUser.salt = newUser.makeSalt()
      newUser.hashedPassword = newUser.encryptPassword(input.password, newUser.salt)
      await newUser.save()

      if (input.RoleId === 2) { // This is supervisor
        db.sequelize.query('INSERT INTO Supervisors (firstName, lastName, email, phoneNo, UserId, createdAt, updatedAt) VALUES (:fName, :lName, :email, :phone, :userId, :dateTime, :dateTime);', {
          replacements: {
            ...userObj, userId: newUser.id, dateTime: new Date().toLocaleString()
          },
          type: db.sequelize.QueryTypes.INSERT
        })
      }

      return {
        id: newUser.id,
        fName: newUser.fName,
        lName: newUser.lName,
        email: newUser.email,
        phone: newUser.phone,
        RoleId: newUser.RoleId,
        // role: 'Client',
        isVerified: newUser.isVerified,
        isBlocked: newUser.isBlocked
      }
    })
    .catch((error) => {
      console.log('error ======>>', error)
    })
}

const refreshTokenHelper = (id) => {
  let userData = {}

  // check if email exist and isDeleted equal to false
  return db.User.findOne({ where: { id, isDeleted: false } })
    .then((user) => {
      if (!user) {
        // user not found, throw error
        return generalHelpingMethods.rejectPromise([{
          field: 'id',
          error: 1540,
          message: 'Invalid user id'
        }])
      } else {
        // convert mongoose document object to plain json object and return user
        return user.toJSON()
      }
    })
    .then((user) => {
      userData.userInfo = user
      return db.Role.findOne({
        where: {
          id: user.RoleId,
          isDeleted: false,
          isActive: true }
      })
    })
    .then(async (role) => {
      if (!role) {
        // Active and not deleted role not found, throw error
        return generalHelpingMethods.rejectPromise([{
          field: 'Role',
          error: 1546,
          message: 'Role is not defined'
        }])
      }
      userData.userInfo.role = role.name
      let query = ''
      if (role.id === 2) {
        query = `select id from Clients where UserId = ${userData.userInfo.id} and isProfile = true`
      }

      if (query) {
        await db.sequelize.query(query, {
          type: db.sequelize.QueryTypes.SELECT
        })
          .then((result) => {
            if (result && result.length) {
              userData.userInfo.employeeId = result[0].id
            }
          })
      }

      await db.Permission.findAll({
        where: { RoleId: userData.userInfo.RoleId },
        attributes: ['ModuleActionId']
      })
        .then(async (result) => {
          if (result) {
            let moduleActionIds = result.map(x => x.ModuleActionId)
            await db.Module.findAll({
              attributes: ['title', 'identifier'],
              include: [
                {
                  model: db.Action,
                  required: true,
                  as: 'actions',
                  attributes: ['title', 'identifier'],
                  through: {
                    where: { id: moduleActionIds },
                    attributes: []
                  }
                }
              ]
            }).then(result => {
              userData.userInfo.permissions = result
            })
          } else {
            userData.userInfo.permissions = []
          }
        })

      const tokenData = {
        id: userData.userInfo.id,
        fName: userData.userInfo.fName,
        lName: userData.userInfo.lName,
        email: userData.userInfo.email,
        phone: userData.userInfo.phone,
        RoleId: userData.userInfo.RoleId,
        role: role.name
      }

      if (userData.userInfo.employeeId) {
        tokenData.employeeId = userData.userInfo.employeeId
      }

      userData.userInfo = {
        ...tokenData,
        permissions: userData.userInfo.permissions,
        isVerified: userData.userInfo.isVerified,
        isBlocked: userData.userInfo.isBlocked,
        language: userData.userInfo.language
      }

      return helpingHelperMethods.signLoginData({ data: tokenData })
    })
    .then((tokenData) => {
      userData.tokenInfo = tokenData
      return userData
    })
    .catch(generalHelpingMethods.catchException)
}

module.exports = {
  signUp,
  login,
  getUsers,
  forgotPassword,
  checkPassword,
  resetPassword,
  resetPasswordPhone,
  changePassword,
  getLoggedInUser,
  updateUser,
  deleteUser,
  verifyOtp,
  resendOtp,
  resendOtpPhone,
  addNewUser,
  loginPhone,
  updateCurrentUserProfile,
  confirmUserHelper,
  refreshTokenHelper
}
