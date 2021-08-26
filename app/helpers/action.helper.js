'use strict'
const db = require('../config/sequelize.config')

// *******************************
// To Get Modules
// *******************************

function getActions (conditions) {
  // Check if Category exist in conditions
  return db.Action.findAll({
    where: conditions
    // include: [{
    //   model: db.Module,
    //   as: 'module',
    //   through: {
    //     attributes: ['id']
    //   }
    // }]
  })
}

module.exports = {
  getActions
}
