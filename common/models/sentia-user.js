var _ = require('lodash');
var utils = require('./utils');
var log = require('bunyan').createLogger({
  name: "Sentiauser"
});
var webError = {
  success: false,
  msg: "Something went wrong"
}

module.exports = function(Sentiauser) {
  Sentiauser.disableRemoteMethodByName("create", true);
  Sentiauser.disableRemoteMethodByName("upsert", true);
  Sentiauser.disableRemoteMethodByName("updateAll", true);
  Sentiauser.disableRemoteMethodByName("updateAttributes", false);
  Sentiauser.disableRemoteMethodByName("find", true);
  Sentiauser.disableRemoteMethodByName("findById", true);
  Sentiauser.disableRemoteMethodByName("findOne", true);
  Sentiauser.disableRemoteMethodByName("deleteById", true);
  Sentiauser.disableRemoteMethodByName("confirm", true);
  Sentiauser.disableRemoteMethodByName("count", true);
  Sentiauser.disableRemoteMethodByName("exists", true);
  Sentiauser.disableRemoteMethodByName("createChangeStream", true);
  Sentiauser.disableRemoteMethodByName("replaceOrCreate", true);
  Sentiauser.disableRemoteMethodByName("upsertWithWhere", true);
};