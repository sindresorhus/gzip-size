/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return */
import fs from 'node:fs';
import {expectType} from 'tsd';
import {gzipSize, gzipSizeSync, gzipSizeFromFile, gzipSizeFromFileSync, gzipSizeStream} from './index.js';

expectType<Promise<number>>(gzipSize('foo'));
expectType<Promise<number>>(gzipSize('foo', {chunkSize: 1}));
expectType<number>(gzipSizeSync('foo'));
expectType<number>(gzipSizeSync('foo', {chunkSize: 1}));
const gstream = fs
	.createReadStream('index.d.ts')
	.pipe(gzipSizeStream())
	.pipe(gzipSizeStream({chunkSize: 1}))
	.on('gzip-size', size => expectType<number>(size));
expectType<number | undefined>(gstream.gzipSize);
expectType<Promise<number>>(gzipSizeFromFile('index.d.ts'));
expectType<Promise<number>>(gzipSizeFromFile('index.d.ts', {chunkSize: 1}));
expectType<number>(gzipSizeFromFileSync('index.d.ts'));
expectType<number>(gzipSizeFromFileSync('index.d.ts', {chunkSize: 1}));
