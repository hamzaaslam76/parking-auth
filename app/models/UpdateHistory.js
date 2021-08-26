'use strict'

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('UpdateHistory', {
    updatedTable: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    updatedAttribute: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    previousValue: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    updatedValue: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  })
}
