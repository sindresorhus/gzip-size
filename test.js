import fs from 'fs';
import test from 'ava';
import pEvent from 'p-event';
import gzipSize from '.';

const fixture = fs.readFileSync('test.js', 'utf8');

test('get the gzipped size', async t => {
	t.true(await gzipSize(fixture) < fixture.length);
});

test('gzip compression level', async t => {
	t.true(await gzipSize(fixture, {level: 6}) < await gzipSize(fixture, {level: 1}));
});

test('sync - get the gzipped size', t => {
	t.true(gzipSize.sync(fixture) < fixture.length);
});

test('sync - match async version', async t => {
	t.is(gzipSize.sync(fixture), await gzipSize(fixture));
});

test('sync - gzip compression level', t => {
	t.true(gzipSize.sync(fixture, {level: 6}) < gzipSize.sync(fixture, {level: 1}));
});

test('stream', async t => {
	const stream = fs.createReadStream('test.js').pipe(gzipSize.stream());
	await pEvent(stream, 'end');
	t.is(stream.gzipSize, gzipSize.sync(fixture));
});

test('gzip-size event', async t => {
	const stream = fs.createReadStream('test.js').pipe(gzipSize.stream());
	const size = await pEvent(stream, 'gzip-size');
	t.is(size, gzipSize.sync(fixture));
});

test('passthrough', async t => {
	let out = '';

	const stream = fs.createReadStream('test.js')
		.pipe(gzipSize.stream())
		.on('data', buffer => {
			out += buffer;
		});

	await pEvent(stream, 'end');
	t.is(out, fixture);
});

test('file - get the gzipped size', async t => {
	t.true(await gzipSize.file('test.js') < fixture.length);
});

test('fileSync - get the gzipped size', t => {
	t.is(gzipSize.fileSync('test.js'), gzipSize.sync(fixture));
});

test('file - match async version', async t => {
	t.is(await gzipSize.file('test.js'), await gzipSize(fixture));
});
