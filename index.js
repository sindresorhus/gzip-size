'use strict';
var stream = require('stream');
var zlib = require('zlib');

var duplexer = require('duplexer');

function getOptions(opts) {
	return Object.assign({
		level: 9
	}, opts);
}

module.exports = function (str, cb, opts) {
	if (!str) {
		cb(null, 0);
		return;
	}

	zlib.gzip(str, getOptions(opts), function (err, data) {
		if (err) {
			cb(err, 0);
			return;
		}

		cb(err, data.length);
	});
};

module.exports.sync = function (str, opts) {
	return zlib.gzipSync(str, getOptions(opts)).length;
};

module.exports.stream = function (opts) {
	var input = new stream.PassThrough();
	var output = new stream.PassThrough();
	var wrapper = duplexer(input, output);

	var gzipSize = 0;
	var gzip = zlib.createGzip(getOptions(opts))
		.on('data', function (buf) {
			gzipSize += buf.length;
		})
		.on('error', function () {
			wrapper.gzipSize = 0;
		})
		.on('end', function () {
			wrapper.gzipSize = gzipSize;
			wrapper.emit('gzip-size', gzipSize);
			output.end();
		});

	input.pipe(gzip);
	input.pipe(output, {end: false});

	return wrapper;
};
