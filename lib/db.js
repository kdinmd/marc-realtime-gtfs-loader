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

const replace = async (activeTableName, shadowTableName, rows) => {
  const trx = await knex.transaction();

  if (rows && rows.length > 0) {
    const tempTableName = `temp_${activeTableName}`;
    const insertionResult = await trx(shadowTableName).insert(rows);
    console.log(insertionResult);

    const renameActiveToTempResult = await trx.schema.renameTable(activeTableName, tempTableName);
    console.log(renameActiveToTempResult);

    const renameShadowToActiveResult = await trx.schema
      .renameTable(shadowTableName, activeTableName);
    console.log(renameShadowToActiveResult);

    const renameTempToShadowResult = await trx.schema.renameTable(tempTableName, shadowTableName);
    console.log(renameTempToShadowResult);

    const truncateShadowResult = await trx(shadowTableName).truncate();
    console.log(truncateShadowResult);
  } else {
    const truncateActiveResult = await trx(activeTableName).truncate();
    console.log(truncateActiveResult);
  }
  const commitResult = await trx.commit();
  console.log(commitResult);
};

module.exports = {
  select,
  insert,
  upsert,
  replace,
};
