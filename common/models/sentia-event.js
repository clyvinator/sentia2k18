var _ = require('lodash');
var utils = require('./utils');
var log = require('bunyan').createLogger({name: "SentiaEvent"});
var webError = {
  success: false,
  msg: "Something went wrong"
}

module.exports = function(SentiaEvent) {
  SentiaEvent.addEvent = function (data, cb) {
    var requiredKeysArray = ['eventName', 'dayNum'];
    utils.hasSufficientParameters(data, requiredKeysArray, function (error, paramResult) {
      if(error) {
        log.error(error);
        return cb(null, error);
      }
      else {
        SentiaEvent.findOne({
          where: {
            eventName: data.eventName
          },
          fields: {
            eventName: true,
            dayNum: true
          }
        })
        .then(function(event) {
          if(event) {
            return cb(null, {
              success: false,
              msg: "Event already exists",
              data: event
            });
          }
          else {
            SentiaEvent.create(data)
            .then(function(event) {
              if(event) {
                return cb(null, {
                  success: true,
                  msg: "Successfully added event",
                  data: event
                })
              }
              else {
                return cb(null, webError);
              }
            })
            .catch(function(error) {
              if(error) {
                log.error(error);
                return cb(null, webError);
              }
            });
          }
        })
        .catch(function(error) {
          if(error) {
            log.error(error);
            return cb(null, webError);
          }
        });
      }
    });
  }

  SentiaEvent.updateEvent = function(data, cb) {
    var requiredKeysArray = ['eventName', 'dayNum'];
    utils.hasSufficientParameters(data, requiredKeysArray, function (error, paramResult) {
      if(error) {
        log.error(error);
        return cb(null, error);
      }
      else {
        SentiaEvent.findOne({
          where: {
            eventName: data.eventName
          }
        })
        .then(function(event) {
          if(event) {
            event.updateAttributes(data)
            .then(function(updatedEvent) {
              if(updatedEvent) {
                return cb(null, {
                  success: true,
                  msg: "Successfully updated event",
                  data: updatedEvent
                });
              }
              else {
                return cb(null, webError);
              }
            })
            .catch(function(error) {
              if(error) {
                log.error(error);
                return cb(null, webError);
              }
            });
          }
          else {
            return cb(null, {
              success: false,
              msg: "Event doesn't exist",
              data: {}
            })
          }
        })
        .catch(function(error) {
          if(error) {
            log.error(error);
            return cb(null, webError);
          }
        });
      }
    });
  }

  SentiaEvent.getEventList = function(cb) {
    SentiaEvent.find({
      where: {
        eventName: {
          neq: null
        }
      }
    })
    .then(function(eventList) {
      return cb(null, {
        success: true,
        msg: "Successfully fetched event list",
        data: eventList
      });
    })
    .catch(function(error) {
      log.error(error);
      return cb(null, webError);
    });
  }

  SentiaEvent.getEventDetails = function(data, cb) {
    var requiredKeysArray = ['eventName'];
    utils.hasSufficientParameters(data, requiredKeysArray, function(error, paramResult) {
      if(error) {
        log.error(error);
        return cb(null, error);
      }
      else {
        SentiaEvent.findOne({
          where: {
            eventName: data.eventName
          }
        })
        .then(function(event) {
          if(event) {
            return cb(null, {
              success: true,
              msg: "Successfully fetched event details",
              data: event
            });
          }
          else {
            return cb(null, {
              success: false,
              msg: "Event not found",
              data: {}
            })
          }
        })
        .catch(function(error) {
          if(error) {
            log.error(error);
            return cb(null, webError);
          }
        });
      }
    })
  }


  SentiaEvent.remoteMethod(
    'addEvent', {
      description: "Add an event",
      accepts: {
        arg: 'data',
        type: 'object',
        required: true,
        root: true,
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

  SentiaEvent.remoteMethod(
    'updateEvent', {
      description: "Updates existing event",
      accepts: {
        arg: 'data',
        type: 'object',
        required: true,
        root: true,
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

  SentiaEvent.remoteMethod(
    'getEventList', {
      description: "Returns list of events",
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

  SentiaEvent.remoteMethod(
    'getEventDetails', {
      description: "returns existing event details for one event",
      accepts: {
        arg: 'data',
        type: 'object',
        required: true,
        root: true,
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


};
