import fs from 'fs';
import test from 'ava';
import m from '.';

const a = fs.readFileSync('test.js', 'utf8');

test.cb('get the gzipped size', t => {
	m(a, (err, size) => {
		t.ifError(err);
		t.true(size < a.length);
		t.end();
	});
});

test('sync - get the gzipped size', t => {
	t.plan(1);
	t.true(m.sync(a) < a.length);
});

test.cb('sync - match async version', t => {
	m(a, (err, size) => {
		t.ifError(err);
		t.is(m.sync(a), size);
		t.end();
	});
});

test('gzip compression level', t => {
	t.true(m.sync(a, {level: 6}) <= m.sync(a, {level: 1}));
});

test.cb('stream', t => {
	fs.createReadStream('test.js')
		.pipe(m.stream())
		.on('end', function () {
			t.is(this.gzipSize, m.sync(a));
			t.end();
		});
});

test.cb('gzip-size event', t => {
	fs.createReadStream('test.js')
		.pipe(m.stream())
		.on('gzip-size', size => {
			t.is(size, m.sync(a));
			t.end();
		});
});

test.cb('passthrough', t => {
	let out = '';

	fs.createReadStream('test.js')
		.pipe(m.stream())
		.on('data', buf => {
			out += buf;
		})
		.on('end', () => {
			t.is(out, a);
			t.end();
		});
});
