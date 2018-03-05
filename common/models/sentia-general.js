var _ = require('lodash');
var async = require('async');
var utils = require('./utils');
var log = require('bunyan').createLogger({
  name: "SentiaEvent"
});
var webError = {
  success: false,
  msg: "Something went wrong"
};
module.exports = function(SentiaGeneral) {
  SentiaGeneral.addGeneralData = function(data, cb) {
    var requiredKeysArray = ['userId', 'info'];
    utils.hasSufficientParameters(data, requiredKeysArray, function(error, paramResult) {
      if (error) {
        log.error(error);
        return cb(null, error);
      } else {
        var collegeName;
        async.auto({
          findUserDetails: function(callback1) {
            SentiaGeneral.app.models.SentiaUser.findOne({
                where: {
                  id: data.userId
                }
              })
              .then(function(userDetails) {
                if (userDetails && userDetails.college) {
                  collegeName = userDetails.college;
                  return callback1(null, userDetails);
                } else {
                  log.error('ERROR - college name not found in db', userDetails);
                  return callback1('ERROR - college name not found in db');
                }
              })
              .catch(function(error) {
                return callback1(error);
              });
          },
          'addGeneralData': ['findUserDetails', function(userDetails, callback2) {
            async.map(data.info, function(participantObj, callbackMap) {
              requiredKeysArray = ['name', 'usn', 'mobileno'];
              utils.hasSufficientParameters(participantObj, requiredKeysArray, function(error, paramResult) {
                if (error) {
                  log.error(error);
                  return callbackMap(error);
                } else {
                  SentiaGeneral.findOne({
                      where: {
                        usn: participantObj.usn
                      }
                    })
                    .then(function(generalDetails) {
                      if (generalDetails) {
                        var updateEventObj = {};
                        updateEventObj = generalDetails;
                        generalDetails.event = participantObj.events;
                        generalDetails.updateAttributes(updateEventObj, function(error, updateDetails) {
                          if (error) {
                            log.error(error);
                            return callbackMap(error);
                          } else {
                            log.info('Events successfully updated', updateDetails);
                            return callbackMap(null, updateDetails);
                          }
                        });
                      } else {
                        var createGeneralObj = {};
                        createGeneralObj.name = participantObj.name;
                        createGeneralObj.usn = participantObj.usn;
                        createGeneralObj.mobileno = participantObj.mobileno;
                        createGeneralObj.event = participantObj.event;
                        createGeneralObj.email = participantObj.email;
                        createGeneralObj.college = collegeName;
                        SentiaGeneral.create(createGeneralObj)
                          .then(function(Obj) {
                            log.info(Obj);
                            return callbackMap(null, Obj);
                          })
                          .catch(function(error) {
                           
                            callbackMap(error);
                          });
                      }
                    })
                    .catch(function(error) {
                      log.error(error);
                      return callbackMap(error);
                    });
                }
              });
            }, function(error, mapResult) {
              if (error) {
                log.error(error);
                return callback2(error);
              } else {
                log.info(mapResult);
                return callback2(null, mapResult);
              }
            });
          }]
        }, function(error, result) {
          if (error) {
            log.error(error);
            return cb(null, webError);
          } else {
            log.info(result);
            return cb(null, {
              success: true,
              msg: "successfully saved",
              data: {
                "userId": data.userId,
                "info": [
                  result.addGeneralData
                ]
              }
            });
          }
        });
      }
    });
  }

  SentiaGeneral.getGeneralData = function(data, cb) {
    var requiredKeysArray = ['userId'];
    utils.hasSufficientParameters(data, requiredKeysArray, function (error, paramResult) {
      if(error) {
        log.error(error);
        return cb(null, error);
      }
      else {
        SentiaGeneral.app.models.SentiaUser.findOne({
          where: {
            id: data.userId
          }
        })
        .then(function (userDetails) {
          if(userDetails && userDetails.college) {
            SentiaGeneral.find({
              where: {
                college: userDetails.college
              }
            })
            .then(function (resultObj) {
              return cb(null, {
                "userId": data.userId,
                "info": resultObj
              });
            })
            .catch(function (error) {
              log.error(error);
              return cb(null, webError);
            });
          }
          else {
            return cb(null, {
              success: false,
              msg: "Invalid id",
              data: {}
            })
          }
        })
        .catch(function (error) {
          log.error(error);
          return cb(null,webError);
        });
      }
    });
  }

  SentiaGeneral.remoteMethod(
    'addGeneralData', {
      description: 'add GeneralData',
      accepts: {
        arg: 'data',
        type: 'object',
        required: true,
        http: {
          source: 'body'
        }
      },
      returns: {
        arg: 'result',
        type: 'object',
        root: true
      },
      http: {
        verb: 'post'
      }
    }
  );

  SentiaGeneral.remoteMethod(
    'getGeneralData', {
      description: 'get GeneralData',
      accepts: {
        arg: 'data',
        type: 'object',
        required: true,
        http: {
          source: 'body'
        }
      },
      returns: {
        arg: 'result',
        type: 'object',
        root: true
      },
      http: {
        verb: 'post'
      }
    }
  );
}
