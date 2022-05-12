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

const getRowCount = (result) => {
  if (result && result.rowCount) {
    return result.rowCount;
  }

  return 0;
};
const select = async (tableName, columns = [], where = {}) => {
  try {
    const result = await knex(tableName).select(columns).where(where);
    console.log(`${getRowCount(result)} Rows selected from ${tableName}`);
    return result;
  } catch (err) {
    console.error(err);
    return err;
  }
};

const insert = async (tableName, rows) => {
  try {
    const result = await knex(tableName).insert(rows);
    console.log(`${getRowCount(result)} Rows inserted into ${tableName}`);
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
    console.log(`${getRowCount(result)} Rows upserted for ${tableName}`);
    return result;
  } catch (err) {
    console.error(err);
    return err;
  }
};

const replace = async (activeTableName, shadowTableName, rows) => {
  try {
    let insertionResult;
    const trx = await knex.transaction();

    if (rows && rows.length > 0) {
      const tempTableName = `temp_${activeTableName}`;
      insertionResult = await trx(shadowTableName).insert(rows);
      await trx.schema.renameTable(activeTableName, tempTableName);
      await trx.schema.renameTable(shadowTableName, activeTableName);
      await trx.schema.renameTable(tempTableName, shadowTableName);
      await trx(shadowTableName).truncate();
    } else {
      const truncateActiveResult = await trx(activeTableName).truncate();
      console.log(truncateActiveResult);
    }
    await trx.commit();

    if (insertionResult && insertionResult.length > 0) {
      console.log(`${insertionResult.length} Rows replaced existing rows in ${activeTableName}`);
    } else {
      console.log(`Existing rows removed from ${activeTableName}`);
    }

    return insertionResult;
  } catch (err) {
    console.error(err);
    return err;
  }
};

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
  select,
  insert,
  upsert,
  replace,
  createTableLike,
  dropTable,
  closeConnection,
};
