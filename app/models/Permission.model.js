'use strict'

module.exports = function (sequelize, DataTypes) {
  let Permission = sequelize.define('Permission',
    {
      RoleId: {
        type: DataTypes.INTEGER,
        require: true
      },
      ModuleActionId: {
        type: DataTypes.INTEGER,
        require: true
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    }, {
      associate: function (models) {
        Permission.belongsTo(models.Role, { foreignKey: 'RoleId' })
        Permission.belongsTo(models.ModuleAction, { foreignKey: 'ModuleActionId' })
      }
    })
  return Permission
}
