'use strict'

module.exports = function (sequelize, DataTypes) {
  let Role = sequelize.define('Role',
    {
      name: {
        type: DataTypes.STRING(20)
      },
      description: {
        type: DataTypes.STRING(100)
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      isDeleteAble: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }, {
      associate: function (models) {
        Role.hasMany(models.Permission, { foreignKey: 'RoleId', as: 'rolePermissions' })
        Role.hasMany(models.User, { foreignKey: 'RoleId', as: 'roleUsers' })
      }
    }
  )
  return Role
}
