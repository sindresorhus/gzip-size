import fs from 'fs';
import test from 'ava';
import fn from './';

const a = fs.readFileSync('test.js', 'utf8');

test('get the gzipped size', t => {
	t.plan(2);

	fn(a, (err, size) => {
		t.ifError(err);
		t.true(size < a.length);
	});
});

test('sync - get the gzipped size', t => {
	t.plan(1);
	t.true(fn.sync(a) < a.length);
});

test('sync - match async version', t => {
	t.plan(2);

	fn(a, (err, size) => {
		t.ifError(err);
		t.is(fn.sync(a), size);
	});
});

test('stream', t => {
	t.plan(1);

	fs.createReadStream('test.js')
		.pipe(fn.stream())
		.on('end', function () {
			t.is(this.gzipSize, fn.sync(a));
		});
});

test('gzip-size event', t => {
	t.plan(1);

	fs.createReadStream('test.js')
		.pipe(fn.stream())
		.on('gzip-size', size => {
			t.is(size, fn.sync(a));
		});
});

test('passthrough', t => {
	t.plan(1);

	let out = '';

	fs.createReadStream('test.js')
		.pipe(fn.stream())
		.on('data', buf => {
			out += buf;
		})
		.on('end', () => {
			t.is(out, a);
		});
});
