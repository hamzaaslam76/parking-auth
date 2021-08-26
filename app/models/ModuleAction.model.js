'use strict'

module.exports = function (sequelize, DataTypes) {
  let ModuleAction = sequelize.define('ModuleAction',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      ModuleId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      ActionId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      }
    }, {
      associate: function (models) {
        ModuleAction.belongsTo(models.Module, { foreignKey: 'ModuleId' })
        ModuleAction.belongsTo(models.Action, { foreignKey: 'ActionId' })
        ModuleAction.hasMany(models.Permission, { foreignKey: 'ModuleActionId', as: 'moduleActionPermission' })
      }
    }
  )
  return ModuleAction
}
