const { loadEnvConfig } = require('@next/env')

loadEnvConfig(process.cwd())

module.exports = {
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  },
  migrations: {
    tableName: 'knex_migrations'
  }
}
