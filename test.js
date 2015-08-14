'use strict';
var fs = require('fs');
var tap = require('tap');
var gzipSize = require('./');
var a = fs.readFileSync('test.js', 'utf8');

tap.test('get the gzipped size', function (t) {
	t.plan(2);

	gzipSize(a, function (err, size) {
		t.assert(!err);
		t.assert(size < a.length);
	});
});

tap.test('sync - get the gzipped size', function (t) {
	t.plan(1);

	t.assert(gzipSize.sync(a) < a.length);
});

tap.test('sync - match async version', function (t) {
	t.plan(2);

	gzipSize(a, function (err, size) {
		t.assert(!err);
		t.assert(gzipSize.sync(a) === size);
	});
});
