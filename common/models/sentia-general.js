var _ = require('lodash');
var async = require('async');
var utils = require('./utils');
var log = require('bunyan').createLogger({
  name: "SentiaDemo"
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
                  callback1(null, userDetails);
                } else {
                  log.error('ERROR', error);
                  return callback1(error);
                }
              })
              .catch(function(error) {
                log.error('ERROR', error);
                return callback1(error);
              });
          },
          getEventsList: function(callback2) {
            SentiaGeneral.app.models.SentiaEvent.find({
                where: {
                  eventName: {
                    neq: null
                  }
                },
                fields: {
                  eventName: true
                }
              })
              .then(function(eventList) {
                if (!eventList) {
                  callback2(true, eventList);
                } else {
                  callback2(null, eventList);
                }
              })
              .catch(function(error) {
                log.error(error);
                return callback2(error);
              });
          },
          addGeneralData: ['findUserDetails', 'getEventsList', function(userDetails, callback3) {
            var eventArray = [];
            var flag = true;
            eventArray = _.map(userDetails.getEventsList, 'eventName');
            async.map(data.info, function(participantObj, callbackMap) {
              requiredKeysArray = ['name', 'usn', 'mobileno'];
              participantObj.event = _.uniq(participantObj.event);
              for (var i = 0; i < participantObj.event.length; i++) {
                if (eventArray.indexOf(participantObj.event[i]) < 0) {
                  flag = false;
                }
              }
              if (flag) {
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
                          updateEventObj.event = participantObj.event.length ? participantObj.event : null;
                          generalDetails.updateAttributes(updateEventObj, function(error, updateDetails) {
                            if (error) {
                              log.error(error);
                              return callbackMap(error);
                            } else {
                              return callbackMap(null, updateDetails);
                            }
                          });
                        } else {
                          var createGeneralObj = {};
                          createGeneralObj.name = participantObj.name;
                          createGeneralObj.usn = participantObj.usn;
                          createGeneralObj.mobileno = participantObj.mobileno;
                          createGeneralObj.event = participantObj.event.length ? participantObj.event : null;
                          createGeneralObj.email = participantObj.email;
                          createGeneralObj.college = collegeName;
                          SentiaGeneral.create(createGeneralObj)
                            .then(function(Obj) {
                              return callbackMap(null, Obj);
                            })
                            .catch(function(error) {
                              log.error(error);
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
              }
              if (!flag) {
                log.error('INVALID EVENT');
                return callbackMap(null, {
                  success: false,
                  msg: 'Invalid Event',
                  data: participantObj.event
                });
              }
            }, function(error, mapResult) {
              if (error) {
                log.error(error);
                return callback3(error);
              } else {
                return callback3(null, mapResult);
              }
            });
          }]
        }, function(error, result) {
          if (error) {
            log.error(error);
            return cb(null, webError);
          } else {
            return cb(null, {
              userId: data.userId,
              info: [
                result.addGeneralData
              ]
            });
          }
        });
      }
    });
  }

  SentiaGeneral.getCollegeData = function(data, cb) {
    var requiredKeysArray = ['userId'];
    utils.hasSufficientParameters(data, requiredKeysArray, function(error, paramResult) {
      if (error) {
        log.error(error);
        return cb(null, error);
      } else {
        SentiaGeneral.app.models.SentiaUser.findOne({
            where: {
              id: data.userId
            }
          })
          .then(function(userDetails) {
            if (userDetails && userDetails.college) {
              SentiaGeneral.find({
                  where: {
                    college: userDetails.college
                  }
                })
                .then(function(resultObj) {
                  return cb(null, {
                    count: resultObj.length,
                    info: resultObj
                  });
                })
                .catch(function(error) {
                  log.error(error);
                  return cb(null, webError);
                });
            }
            else {
              return cb(null, {
                success: true,
                msg: "No details found",
                data: {}
              });
            }
          })
          .catch(function(error) {
            log.error(error);
            return cb(null, webError);
          });
      }
    });
  }

  SentiaGeneral.getGeneralData = function(cb) {
    SentiaGeneral.find({
        where: {
          usn: {
            neq: null
          }
        }
      })
      .then(function(resultObj) {
        if (resultObj) {
          return cb(null, {
            count: resultObj.length,
            info: resultObj
          });
        } else {
          return cb(null, {
            success: true,
            msg: "No participants found"
          });
        }
      })
      .catch(function(error) {
        log.error(error);
        return cb(null, webError);
      });
  }

  SentiaGeneral.getSentiaUsers = function(cb) {
    SentiaGeneral.app.models.SentiaUser.find({
        where: {
          email: {
            neq: null
          }
        }
      })
      .then(function(userDetails) {
        if (userDetails) {
          return cb(null, {
            count: userDetails.length,
            info: userDetails
          });
        } else {
          return cb(null, {
            success: true,
            msg: "No co-ordinators found",
            count: 0
          });
        }
      })
      .catch(function(error) {
        log.error(error);
        return cb(null, webError);
      });
  }

  SentiaGeneral.getDeptEvents = function(data, cb) {
    utils.hasSufficientParameters(data, ['dept'], function(error, paramResult) {
      if (error) {
        return cb(null, {
          success: false,
          msg: "Insufficient participants",
          data: error.data
        });
      } else {
        async.auto({
            getEvents: function(callback1) {
              SentiaGeneral.app.models.SentiaEvent.find({
                  where: {
                    dept: data.dept
                  }
                })
                .then(function(events) {
                  if (!events) {
                    callback1(error);
                  } else {
                    return callback1(null, events);
                  }
                })
                .catch(function(error) {
                  log.error(error);
                  return callback1(error);
                });
            },
            getdeptList: ['getEvents', function(events, callback2) {
              SentiaGeneral.find({
                  where: {
                    event: {
                      neq: null
                    }
                  },
                  fields: {
                    name: true,
                    usn: true,
                    mobileno: true,
                    college: true,
                    event: true
                  }
                })
                .then(function(eventDetails) {
                  var Obj = {};
                  async.map(eventDetails, function(deptEvents, callbackMap) {
                    if (deptEvents.event !== null) {
                      for (var i = 0; i < deptEvents.event.length; i++) {
                        if (!(_.map(events.getEvents, 'eventName').indexOf(deptEvents.event[i]) < 0)) {
                          Obj = deptEvents;
                        }
                      }
                      if (_.isEmpty(Obj)) {
                        callbackMap(null, null);
                      } else {
                        callbackMap(null, Obj);
                      }
                    } else {
                      return callbackMap(error);
                    }
                  }, function(error, mapResult) {
                    if (error) {
                      return callback2(error);
                    } else {
                      return callback2(null, _.compact(_.uniq(mapResult)));
                    }
                  });
                })
                .catch(function(error) {
                  return callback2(error);
                });
            }]
          },
          function(error, result) {
            if (error) {
              return cb(null, webError);
            } else if (!result.getdeptList.length) {
              return cb(null, {
                success: false,
                msg: "No participants found"
              });
            } else {
              return cb(null, {
                success: true,
                msg: "successfully executed",
                data: result.getdeptList
              });
            }
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
      description: 'get details of all the participants of Sentia',
      returns: {
        arg: 'result',
        type: 'object',
        root: true
      },
      http: {
        verb: 'get'
      }
    }
  );

  SentiaGeneral.remoteMethod(
    'getCollegeData', {
      description: 'get details of all the participants of a particular college of Sentia',
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
    'getSentiaUsers', {
      description: 'get details of all the co-ordinators of various colleges of Sentia',
      returns: {
        arg: 'result',
        type: 'object',
        root: true
      },
      http: {
        verb: 'get'
      }
    }
  );

  SentiaGeneral.remoteMethod(
    'getDeptEvents', {
      description: 'get details of all the participants of a particular college of Sentia',
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

  SentiaGeneral.disableRemoteMethodByName("create", true);
  SentiaGeneral.disableRemoteMethodByName("upsert", true);
  SentiaGeneral.disableRemoteMethodByName("updateAll", true);
  SentiaGeneral.disableRemoteMethodByName("updateAttributes", false);
  SentiaGeneral.disableRemoteMethodByName("find", true);
  SentiaGeneral.disableRemoteMethodByName("findById", true);
  SentiaGeneral.disableRemoteMethodByName("findOne", true);
  SentiaGeneral.disableRemoteMethodByName("deleteById", true);
  SentiaGeneral.disableRemoteMethodByName("confirm", true);
  SentiaGeneral.disableRemoteMethodByName("count", true);
  SentiaGeneral.disableRemoteMethodByName("exists", true);
  SentiaGeneral.disableRemoteMethodByName("createChangeStream", true);
  SentiaGeneral.disableRemoteMethodByName("replaceOrCreate", true);
  SentiaGeneral.disableRemoteMethodByName("upsertWithWhere", true);


}
