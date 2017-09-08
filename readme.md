# gzip-size [![Build Status](https://travis-ci.org/sindresorhus/gzip-size.svg?branch=master)](https://travis-ci.org/sindresorhus/gzip-size)

> Get the gzipped size of a string or buffer


## Install

```
$ npm install gzip-size
```


## Usage

```js
cosnt gzipSize = require('gzip-size');
const string = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.';

console.log(string.length);
//=> 191

console.log(gzipSize.sync(string));
//=> 78
```


## API

### gzipSize(input, callback, options)
### gzipSize.sync(input, options)

#### input

Type: `string` `Buffer`

#### options

Type: `Object`

[List of options](https://nodejs.org/api/zlib.html#zlib_class_options)

#### callback(error, size)

Type: `Function`

### gzipSize.stream(options)

Returns a [`stream.PassThrough`](https://nodejs.org/api/stream.html#stream_class_stream_passthrough). The stream emits a `gzip-size` event and has a `gzipSize` property.


## Related

- [gzip-size-cli](https://github.com/sindresorhus/gzip-size-cli) - CLI for this module


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
