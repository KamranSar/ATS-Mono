/* eslint-disable no-console */
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
//
// mssqlservice-model.js - Sequelize
// 
// See http://knexjs.org/  for more of what you can do here.
module.exports = function (app) {
  const dbMssql = app.get('mssqlClient');
  const newModel = dbMssql.define('a_people', {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    lastname: DataTypes.STRING,
    firstname: DataTypes.STRING,
    location: DataTypes.STRING,
   
  }, {
    tableName: 'a_people',
    timestamps: true,
    createdAt: true,
    updatedAt: true
  },
  {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  newModel.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return newModel;
};
