'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'Tests',
      [
        {
          data_one: '1',
          data_two: '2',
          data_three: '3'
        },
        {
          data_one: '4',
          data_two: '5',
          data_three: '6'
        }
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Tests', null, {})
  }
}
