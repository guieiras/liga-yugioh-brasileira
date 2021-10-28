const { loadEnvConfig } = require('@next/env')

loadEnvConfig(process.cwd())

module.exports = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
  },
  migrations: {
    tableName: 'knex_migrations'
  }
}
