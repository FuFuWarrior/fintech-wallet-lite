// Update with your config settings.
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

 development: {
    client: process.env.DB_CLIENT,
    connection: {
      host : process.env.DB_HOST,
      port : process.env.DB_PORT,
      user : process.env.DB_USER,
      password : process.env.DB_PASSWORD,
      database : process.env.DB_NAME,
      migrations: {
        directory: __dirname + '/migrations'
      },
      seeds: {
        directory: __dirname + '/seeds'
      }
    }
  },

  production: {
    client: process.env.DB_CLIENT,
    connection: {
      host : process.env.DB_HOST,
      port : process.env.DB_PORT,
      user : process.env.DB_USER,
      password : process.env.DB_PASSWORD,
      migrations: {
        directory: __dirname + '/migrations'
      },
      seeds: {
        directory: __dirname + '/seeds'
      }
    }
  }

};
