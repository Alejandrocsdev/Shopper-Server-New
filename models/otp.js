'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Otp extends Model {
    static associate(models) {}
  }
  Otp.init(
    {
      phone: {
        allowNull: false,
        type: DataTypes.STRING
      },
      hashedOtp: {
        allowNull: false,
        type: DataTypes.STRING
      },
      expireTime: {
        allowNull: false,
        type: DataTypes.BIGINT
      },
      attempts: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    {
      sequelize,
      modelName: 'Otp',
      tableName: 'Otps',
      underscored: true
    }
  )
  return Otp
}
