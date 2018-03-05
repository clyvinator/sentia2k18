module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'Sentia2k18',
      script    : './server/server.js',
      watch: ['client', 'common', 'server'],
      ignore_watch: "db-backups",
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'production'
      }
    }
]
};
