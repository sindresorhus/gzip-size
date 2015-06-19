#!/usr/bin/env node
'use strict';
var fs = require('fs');
var zlib = require('zlib');
var concat = require('concat-stream');
var meow = require('meow');

var cli = meow({
	help: [
		'Usage',
		'  $ gzip-size <file>',
		'  $ cat <file> | gzip-size',
		'',
		'Example',
		'  $ gzip-size index.js',
		'  211'
	]
});

var input = cli.input[0];

function report(data) {
	console.log(data.length);
}

if (!input && process.stdin.isTTY) {
	console.error('Expected a filename');
	process.exit(1);
}

if (input) {
	fs.createReadStream(input).pipe(zlib.createGzip()).pipe(concat(report));
} else {
	process.stdin.pipe(zlib.createGzip()).pipe(concat(report));
}
