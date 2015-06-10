'use strict';
var zlib = require('zlib');

module.exports = function (str, cb) {
	if (!str) {
		cb(null, 0);
		return;
	}

	zlib.gzip(str, {level: 9}, function (err, data) {
		if (err) {
			cb(err, 0);
			return;
		}

		cb(err, data.length);
	});
};

module.exports.sync = function (str) {
	return zlib.gzipSync(str, {level: 9}).length;
};
