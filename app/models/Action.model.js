'use strict'

module.exports = function (sequelize, DataTypes) {
  let Action = sequelize.define('Action',
    {
      title: {
        type: DataTypes.INTEGER(20)
      },
      identifier: {
        type: DataTypes.INTEGER(20)
      }
    }, {
      associate: function (models) {
        Action.belongsToMany(models.Module, {
          through: 'ModuleAction',
          foreignKey: 'ActionId'
        })
      }
    }
  )
  return Action
}
