'use strict';

const PassThrough = require('stream').PassThrough;

// We define these manually to ensure they're always copied
// even if they would move up the prototype chain
// https://nodejs.org/api/http.html#http_class_http_incomingmessage
const knownProps = [
	'destroy',
	'setTimeout',
	'socket',
	'headers',
	'trailers',
	'rawHeaders',
	'statusCode',
	'httpVersion',
	'httpVersionMinor',
	'httpVersionMajor',
	'rawTrailers',
	'statusMessage'
];

const copyProps = (fromStream, toStream) => {
	const toProps = Object.keys(toStream);
	const fromProps = new Set(Object.keys(fromStream).concat(knownProps));

	for (const prop of fromProps) {
		// Don't overwrite existing properties
		if (toProps.indexOf(prop) !== -1) {
			continue;
		}

		toStream[prop] = typeof fromStream[prop] === 'function' ? fromStream[prop].bind(fromStream) : fromStream[prop];
	}
};

const cloneResponse = response => {
	const clone = new PassThrough();
	copyProps(response, clone);

	return response.pipe(clone);
};

cloneResponse.knownProps = knownProps;

module.exports = cloneResponse;
