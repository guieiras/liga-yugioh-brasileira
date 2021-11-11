import Knex from 'knex'
import knexOptions from '../knexfile'

let database

if (process.env.NODE_ENV === 'production') {
  database = Knex(knexOptions)
} else {
  if (!global.database) { global.database = Knex(knexOptions) }

  database = global.database
}

export default database
