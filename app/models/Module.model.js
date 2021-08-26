'use strict'

module.exports = function (sequelize, DataTypes) {
  let Module = sequelize.define('Module',
    {
      title: {
        type: DataTypes.INTEGER(20)
      },
      identifier: {
        type: DataTypes.INTEGER(20)
      },
      description: {
        type: DataTypes.INTEGER(100)
      }
    }, {
      associate: function (models) {
        Module.belongsToMany(models.Action, {
          as: 'actions',
          through: 'ModuleAction',
          foreignKey: 'ModuleId'
        })
      }
    }
  )
  return Module
}
