'use strict'
// const faker = require('faker')

module.exports = async function dbseed (db, sequelize) {
  //   // Inserting predefined data
  const roles = [{
    id: 1,
    title: 'Super Admin',
    description: '',
    isActive: true,
    ownRecordsOnly: true,
    isDeleted: false,
    isDeleteAble: false
  }, {
    id: 2,
    title: 'Parking Admin',
    description: '',
    isActive: true,
    ownRecordsOnly: true,
    isDeleted: false,
    isDeleteAble: false
  }, {
    id: 3,
    title: 'User',
    description: '',
    isActive: true,
    ownRecordsOnly: true,
    isDeleted: false,
    isDeleteAble: false
  }, {
    id: 4,
    title: 'Inspector',
    description: '',
    isActive: true,
    ownRecordsOnly: true,
    isDeleted: false,
    isDeleteAble: false
  }
  ]

  await db.Role.bulkCreate(roles)
}
