'use-strict'

module.exports = function (sequelize, DataTypes) {
  let AppUsage = sequelize.define('AppUsage', {
    UserId: DataTypes.INTEGER(11),
    start: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    associate: function (models) {
      AppUsage.belongsTo(models.User, { foreignKey: 'UserId', as: 'user' })
    }
  })
  return AppUsage
}
