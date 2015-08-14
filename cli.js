#!/usr/bin/env node
'use strict';
var fs = require('fs');
var gzipSize = require('./');
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

if (!input && process.stdin.isTTY) {
	console.error('Expected a filename');
	process.exit(1);
}

var source = input ? fs.createReadStream(input) : process.stdin;
source.pipe(gzipSize.stream()).on('gzip-size', function (size) {
	console.log(size);
});
