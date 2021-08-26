'use strict'

module.exports = function (sequelize, DataTypes) {
  const TravelHistory = sequelize.define('TravelHistory', {
    lat: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    lng: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    locationMode: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    againstActivity: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    osVersion: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    appVersion: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    device: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    networkType: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    batteryLevel: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    timestamp: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    insideJurisdiction: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    associate: function (models) {
      TravelHistory.belongsTo(models.User, { foreignKey: 'UserId' })
    }
  })
  return TravelHistory
}
