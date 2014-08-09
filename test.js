'use strict';
var fs = require('fs');
var test = require('ava');
var gzipSize = require('./');
var a = fs.readFileSync('test.js', 'utf8');

test('get the gzipped size', function (t) {
	t.plan(2);

	gzipSize(a, function (err, size) {
		t.assert(!err);
		t.assert(size < a.length);
	});
});

test('sync - get the gzipped size', function (t) {
	t.assert(gzipSize.sync(a) < a.length);
});

test('sync - match async version', function (t) {
	t.plan(2);

	gzipSize(a, function (err, size) {
		t.assert(!err);
		t.assert(gzipSize.sync(a) === size);
	});
});
