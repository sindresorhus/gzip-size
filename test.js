import fs from 'fs';
import test from 'ava';
import pEvent from 'p-event';
import m from '.';

const fixture = fs.readFileSync('test.js', 'utf8');

test('get the gzipped size', async t => {
	t.true(await m(fixture) < fixture.length);
});

test('sync - get the gzipped size', t => {
	t.true(m.sync(fixture) < fixture.length);
});

test('sync - match async version', async t => {
	t.is(m.sync(fixture), await m(fixture));
});

test('gzip compression level', t => {
	t.true(m.sync(fixture, {level: 6}) < m.sync(fixture, {level: 1}));
});

test('stream', async t => {
	const stream = fs.createReadStream('test.js').pipe(m.stream());
	await pEvent(stream, 'end');
	t.is(stream.gzipSize, m.sync(fixture));
});

test('gzip-size event', async t => {
	const stream = fs.createReadStream('test.js').pipe(m.stream());
	const size = await pEvent(stream, 'gzip-size');
	t.is(size, m.sync(fixture));
});

test('passthrough', async t => {
	let out = '';

	const stream = fs.createReadStream('test.js')
		.pipe(m.stream())
		.on('data', buf => {
			out += buf;
		});

	await pEvent(stream, 'end');
	t.is(out, fixture);
});
