/**
 * Main config for the project
 * @type {Object}
 */
module.exports = {
  /** @type {String} Private app name */
  appName: 'gamejam-server',
  /** @type {Number} HTTP Port */
  httpPort: 3000,
  /** @type {Number} Socket port */
  socketPort: 3030,
  /** @type {String} Environment variable */
  environment: 'development',

  mongo: {
    host: 'localhost',
    port: '27017',
    database: 'test_dev',
    username: '',
    password: '',
    uri: function () {
      if (this.username.length >= 1)
        return `mongodb://${this.username}:${this.password}@${this.host}:${this.port}/${this.database}`;
      return `mongodb://${this.host}:${this.port}/${this.database}`;
    },
    options: {
      server: {
        autoReconnect: true,
        poolSize: 10,
        socket_option: {
          keepAlive: true
        }
      }
    }
  }
}