var _ = require('lodash');

	var hasSufficientParameters = function(data, required, callback) {
		var missingArray = [];
		for(var i = 0; i < required.length; i++) {
			if(!data.hasOwnProperty(required[i]) || data[required[i]] === null) {
				missingArray.push(required[i]);
			}
		}
		if(missingArray.length) {
			return callback({
				success: false,
				msg: "Insufficient parameters",
				data: missingArray
			})
		}
		else {
			return callback(null);
		}
	};
exports.hasSufficientParameters = hasSufficientParameters;