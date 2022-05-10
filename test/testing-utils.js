const fs = require('fs');

const connectionOptions = {
  client: 'pg',
  connection: {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: {
      ca: fs.readFileSync(process.env.CA_PATH).toString(),
    },
  },
  pool: { min: 0, max: 5 },
};
const knex = require('knex')(connectionOptions);

/* Methods used for testing: */

const createTableLike = async (newTableName, existingTableName) => {
  try {
    const result = await knex.schema.createTableLike(newTableName, existingTableName);
    console.log(`Table ${newTableName} created`);
    return result;
  } catch (err) {
    console.error(err);
    return err;
  }
};

const dropTable = async (tableName) => {
  try {
    const result = await knex.schema.dropTableIfExists(tableName);
    console.log(`Table ${tableName} dropped`);
    return result;
  } catch (err) {
    console.error(err);
    return err;
  }
};

// Eliminates 'A worker process has failed to exit gracefully' jest message
const closeConnection = async () => {
  await knex.destroy();
};

module.exports = {
  createTableLike,
  dropTable,
  closeConnection,
};
