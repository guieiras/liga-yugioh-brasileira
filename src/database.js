import Knex from 'knex'

function createConnection () {
  return Knex({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    }
  })
}

let database

if (process.env.NODE_ENV === 'production') {
  database = createConnection()
} else {
  if (!global.database) {
    global.database = createConnection()
  }

  database = global.database
}

export default database
