'use strict';
var assert = require('assert');
var fs = require('fs');
var gzipSize = require('./index');
var a = fs.readFileSync('test.js', 'utf8');

describe('gzipSize()', function () {
	it('should get the gzipped size', function (cb) {
		gzipSize(a, function (err, size) {
			assert(!err);
			assert(size < a.length);
			cb();
		});
	});
});

describe('gzipSize.sync()', function () {
	it('should get the gzipped size', function () {
		assert(gzipSize.sync(a) < a.length);
	});
	
	it('should match async version', function(cb) {
		gzipSize(a, function (err, size) {
			assert(!err);
			assert.equal(gzipSize.sync(a), size);
			cb();
		});
	});
});
