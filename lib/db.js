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

const select = async (tableName, columns = [], where = {}) => {
  try {
    const result = await knex(tableName).select(columns).where(where);
    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
    return err;
  }
};

const insert = async (tableName, rows) => {
  try {
    const result = await knex(tableName).insert(rows);
    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
    return err;
  }
};

const upsert = async (tableName, rows, onConflictColumns, mergeColumns) => {
  try {
    const result = await knex(tableName)
      .insert(rows).onConflict(onConflictColumns).merge(mergeColumns);
    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
    return err;
  }
};

/* Methods used for testing: */

const createTable = async (newTableName, existingTableName) => {
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
  select,
  insert,
  upsert,
  createTable,
  dropTable,
  closeConnection,
};
