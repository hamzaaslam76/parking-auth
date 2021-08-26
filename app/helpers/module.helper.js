'use strict'
const db = require('../config/sequelize.config')

// *******************************
// To Get Modules
// *******************************

function getModules (conditions) {
  // Check if Category exist in conditions
  return db.Module.findAll({
    where: conditions,
    include: [{
      model: db.Action,
      as: 'actions',
      through: {
        attributes: ['id']
      }
    }]
  })
}

module.exports = {
  getModules
}
