import {expectType} from 'tsd';
import * as fs from 'fs';
import gzipSize = require('.');

expectType<Promise<number>>(gzipSize('foo'));
expectType<Promise<number>>(gzipSize('foo', {chunkSize: 1}));
expectType<number>(gzipSize.sync('foo'));
expectType<number>(gzipSize.sync('foo', {chunkSize: 1}));
const gstream = fs
	.createReadStream('index.d.ts')
	.pipe(gzipSize.stream())
	.pipe(gzipSize.stream({chunkSize: 1}))
	.on('gzip-size', size => expectType<number>(size));
expectType<number | undefined>(gstream.gzipSize);
expectType<Promise<number>>(gzipSize.file('index.d.ts'));
expectType<Promise<number>>(gzipSize.file('index.d.ts', {chunkSize: 1}));
expectType<number>(gzipSize.fileSync('index.d.ts'));
expectType<number>(gzipSize.fileSync('index.d.ts', {chunkSize: 1}));
