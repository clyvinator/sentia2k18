var moment = require('moment');
var async = require('async');
var _ = require('lodash');
'use strict';

module.exports = function(SentiaEvents) {
  SentiaEvents.addEvents = function (data, cb) {
    var requiredKeysArray = [];
    utils.hasSufficientParameters(data, requiredKeysArray, function (error, paramResult) {
      if(error) {
        log.error(error);
        return cb(null, {
          success: false,
          msg: "Insufficient parameters",
          data: error.data
        });
      }
      else {

      }
    });
  };
  SentiaEvents.remoteMethod(
    'addEvents', {
      description: "Add an event",
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
  )
};
