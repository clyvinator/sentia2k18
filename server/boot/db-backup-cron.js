var cronJob = require('cron').CronJob;
var log = require('bunyan').createLogger({
  name: "mysqlBackupCron"
});
var moment = require('moment');
var mysqlDump = require('mysqldump');
var dbBackupCron = new cronJob('0 */12 * * *', function() {
  mysqlDump({
    host: '35.154.52.251',
    user: 'root',
    password: 'amazon',
    database: 'Sentia_2k18',
    dest: './db-backups/backup_data_' + moment().format('DD MM YYYY, h:mm:ss a') + '.sql'
  }, function(error) {
    if (error) {
      log.error(error);
    }
  });
  log.info("CRON ran successfully");
}, function() {}, true);
