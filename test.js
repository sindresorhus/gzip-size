'use strict';
var fs = require('fs');
var spawn = require('child_process').spawn;
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

tap.test('stream', function (t) {
	t.plan(1);

	fs.createReadStream('test.js')
		.pipe(gzipSize.stream())
		.on('end', function () {
			t.equal(this.gzipSize, gzipSize.sync(a));
		});
});

tap.test('gzip-size event', function (t) {
	t.plan(1);

	fs.createReadStream('test.js')
		.pipe(gzipSize.stream())
		.on('gzip-size', function (size) {
			t.equal(size, gzipSize.sync(a));
		});
});

tap.test('passthrough', function (t) {
	t.plan(1);

	var out = '';
	fs.createReadStream('test.js')
		.pipe(gzipSize.stream())
		.on('data', function (buf) { out += buf; })
		.on('end', function () {
			t.equal(out, a);
		});
});

tap.test('cli - stream', function (t) {
	t.plan(3);

	var ps = spawn(process.execPath, [
		__dirname + '/cli.js'
	]);

	fs.createReadStream('test.js').pipe(ps.stdin);

	var out = '';
	var err = '';
	ps.stdout.on('data', function (buf) { out += buf; });
	ps.stderr.on('data', function (buf) { err += buf; });

	ps.on('exit', function (code) {
		t.notOk(err);
		t.equal(code, 0);
		t.same(out, gzipSize.sync(a));
	});
});

tap.test('cli - file', function (t) {
	t.plan(3);

	var ps = spawn(process.execPath, [
		__dirname + '/cli.js',
		'test.js'
	]);

	var out = '';
	var err = '';
	ps.stdout.on('data', function (buf) { out += buf; });
	ps.stderr.on('data', function (buf) { err += buf; });

	ps.on('exit', function (code) {
		t.notOk(err);
		t.equal(code, 0);
		t.same(out, gzipSize.sync(a));
	});
});
