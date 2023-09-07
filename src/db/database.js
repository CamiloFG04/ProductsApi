const { Sequelize } = require('sequelize');


const db = new Sequelize('api', 'root', '', {
  host: 'localhost',
  dialect: 'mysql' 
});

async function connection() {
  try {
    await db.authenticate();
    await db.sync();
    console.log(`All good`);
  } catch (error) {
    throw new Error(error)
  }
}

connection();

module.exports = db;