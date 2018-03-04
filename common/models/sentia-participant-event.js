var _ = require('lodash');
var utils = require('./utils');
var async = require('async');
var log = require('bunyan').createLogger({
	name: "SentiaParticipantEvent"
});
var webError = {
	success: false,
	msg: "Something went wrong"
}

module.exports = function(SentiaParticipantEvent) {
	SentiaParticipantEvent.saveParticipationEntry = function(data, cb) {
		var requiredKeysArray = ['userId', 'info'];
		utils.hasSufficientParameters(data, requiredKeysArray, function(error, paramResult) {
			if (error) {
				return cb(null, error);
			} else {
				var collegeName;
				SentiaParticipantEvent.app.models.SentiaUser.findOne({
						where: {
							id: data.userId
						}
					})
					.then(function(sentiaUser) {
						if (sentiaUser && sentiaUser.college) {
							collegeName = sentiaUser.college;
						} else {
							return cb(null, webError);
						}
					})
					.catch(function(error) {
						if (error) {
							log.error(error);
							return cb(null, webError);
						}
					});
				async.map(data.info, function(participationObj, callbackMap) {
					var reqdKeys = ['name', 'email', 'mobileno', 'usn', 'events'];
					utils.hasSufficientParameters(participationObj, reqdKeys, function(error, paramResult) {
						if (error) {
							return callbackMap(error);
						} else {
							async.auto({
									checkParticipantInDB: function(callbackAuto) {
										SentiaParticipantEvent.app.models.SentiaParticipant.findOne({
												where: {
													usn: participationObj.usn
												}
											})
											.then(function(participantObj) {
												if (participantObj) {
													return callbackAuto(null, participantObj.participantID);
												} else {
													var newParticipantObj = {};
													newParticipantObj.name = participationObj.name;
													newParticipantObj.email = participationObj.email;
													newParticipantObj.mobileno = participationObj.mobileno;
													newParticipantObj.usn = participationObj.usn;
													newParticipantObj.college = collegeName;

													SentiaParticipantEvent.app.models.SentiaParticipant.create(newParticipantObj)
														.then(function(createdParticipantObj) {
															if (createdParticipantObj) {
																return callbackAuto(null, createdParticipantObj.participantID);
															} else {
																return callbackAuto("Error in creating participant entry");
															}
														})
														.catch(function(error) {
															return callbackAuto(error);
														})
												}
											})
											.catch(function(error) {
												log.error(error);
												return callbackAuto(error);
											});
									},
									findEventIDs: function(callbackAuto) {
										return callbackAuto(null, _.map(participationObj.events, function(eventString) {
											SentiaParticipantEvent.app.models.SentiaEvent.findOne({
													where: {
														eventName: eventString
													}
												})
												.then(function(eventObj) {
													if (eventObj) {
														return eventObj.eventID
													} else {
														return callbackAuto("Invalid event");
													}
												})
												.catch(function(error) {
													return callbackAuto(error)
												});
										}));
									},

									deleteAllParticipationEntries: ['checkParticipantInDB', function(callbackAuto, resultAuto) {
										if (resultAuto.checkParticipantInDB) {
											SentiaParticipantEvent.destroyAll({
													participantID: resultAuto.checkParticipantInDB
												})
												.then(function(deletedRes) {})
												.catch(function(error) {
													return callbackAuto(error);
												});
										}
									}],
									createParticipationEntries: ['deleteAllParticipationEntries', 'checkParticipantInDB', 'findEventIDs', function(callbackAuto, resultAuto) {
										SentiaParticipantEvent.create(_.map(resultAuto.findEventIDs, function(eventID) {
												return {
													participantID: resultAuto.checkParticipantInDB,
													eventID: eventID
												}
											}))
											.then(function(createdParticipationArray) {
												if (createdParticipationArray) {
													return callbackAuto(null, createdParticipationArray);
												} else {
													return callbackAuto("Error in creating participation entries");
												}
											})
											.catch(function(error) {
												if (error) {
													return callbackAuto(error);
												}
											})
									}]
								},
								function(error, resultAuto) {
									if (error) {
										return callbackMap(error);
									} else {
										return callbackMap(null, resultAuto);
									}
								});
						}
					})
				}, function(error, resultMap) {
					if (error) {
						log.error(error);
						return cb(null, webError);
					} else {
						return cb(null, {
							success: true,
							msg: "Saved",
							data: {}
						})
					}
				});
			}
		})
	}

	 SentiaParticipantEvent.remoteMethod(
    'saveParticipationEntry', {
      description: "save saveParticipationEntry",
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


}