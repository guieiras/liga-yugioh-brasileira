import Knex from 'knex';

function createConnection() {
  return Knex({
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD
    }
  });
}

let database;

if (process.env.NODE_ENV === 'production') {
  database = createConnection()
} else {
  if (!global.database) {
    global.database = createConnection();
  }

  database = global.database;
}

export default database;
