import fs from 'node:fs';
import test from 'ava';
import {pEvent} from 'p-event';
import {
	gzipSize,
	gzipSizeSync,
	gzipSizeFromFile,
	gzipSizeFromFileSync,
	gzipSizeStream,
} from './index.js';

const fixture = fs.readFileSync('test.js', 'utf8');

test('get the gzipped size', async t => {
	t.true(await gzipSize(fixture) < fixture.length);
});

test('gzip compression level', async t => {
	t.true(await gzipSize(fixture, {level: 6}) < await gzipSize(fixture, {level: 1}));
});

test('sync - get the gzipped size', t => {
	t.true(gzipSizeSync(fixture) < fixture.length);
});

test('sync - match async version', async t => {
	t.is(gzipSizeSync(fixture), await gzipSize(fixture));
});

test('sync - gzip compression level', t => {
	t.true(gzipSizeSync(fixture, {level: 6}) < gzipSizeSync(fixture, {level: 1}));
});

test('stream', async t => {
	const stream = fs.createReadStream('test.js').pipe(gzipSizeStream());
	await pEvent(stream, 'end');
	t.is(stream.gzipSize, gzipSizeSync(fixture));
});

test('gzip-size event', async t => {
	const stream = fs.createReadStream('test.js').pipe(gzipSizeStream());
	const size = await pEvent(stream, 'gzip-size');
	t.is(size, gzipSizeSync(fixture));
});

test('passthrough', async t => {
	let out = '';

	const stream = fs.createReadStream('test.js')
		.pipe(gzipSizeStream())
		.on('data', buffer => {
			out += buffer;
		});

	await pEvent(stream, 'end');
	t.is(out, fixture);
});

test('file - get the gzipped size', async t => {
	t.true(await gzipSizeFromFile('test.js') < fixture.length);
});

test('fileSync - get the gzipped size', t => {
	t.is(gzipSizeFromFileSync('test.js'), gzipSizeSync(fixture));
});

test('file - match async version', async t => {
	t.is(await gzipSizeFromFile('test.js'), await gzipSize(fixture));
});
