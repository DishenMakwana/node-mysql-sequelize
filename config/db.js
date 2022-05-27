const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DIALECT,
    logging: false, // if you like
    // pool: {
    //     max: 5,
    //     min: 0,
    //     idle: 10000
    //   },
  }
);

sequelize.authenticate().then(
  function () {
    console.info('Database Connection has been established successfully.');
  },
  function (err) {
    console.error('Unable to connect to the database:', err);
  }
);

module.exports = sequelize;
