var namespace = require("can-namespace");

/**
 * @module {function} can-deparam can-deparam
 * @parent can-infrastructure
 * @signature `deparam(params)`
 *
 * @param {String} params a form-urlencoded string of key-value pairs
 * @return {Object} The params formatted into an object
 *
 * Takes a string of name value pairs and returns a Object literal that represents those params.
 *
 * ```js
 * var deparam = require("can-deparam");
 *
 * console.log(JSON.stringify(deparam("?foo=bar&number=1234"))); // -> '{"foo" : "bar", "number": 1234}'
 * console.log(JSON.stringify(deparam("#foo[]=bar&foo[]=baz"))); // -> '{"foo" : ["bar", "baz"]}'
 * console.log(JSON.stringify(deparam("foo=bar%20%26%20baz"))); // -> '{"foo" : "bar & baz"}'
 * ```
 */
var digitTest = /^\d+$/,
	keyBreaker = /([^\[\]]+)|(\[\])/g,
	paramTest = /([^?#]*)(#.*)?$/,
	prep = function (str) {
		return decodeURIComponent(str.replace(/\+/g, ' '));
	};
module.exports = namespace.deparam = function (params) {
	var data = {}, pairs, lastPart;
	if (params && paramTest.test(params)) {
		pairs = params.split('&');
		pairs.forEach(function (pair) {
			var parts = pair.split('='),
				key = prep(parts.shift()),
				value = prep(parts.join('=')),
				current = data;
			if (key) {
				parts = key.match(keyBreaker);
				for (var j = 0, l = parts.length - 1; j < l; j++) {
					if (!current[parts[j]]) {
						// If what we are pointing to looks like an `array`
						current[parts[j]] = digitTest.test(parts[j + 1]) || parts[j + 1] === '[]' ? [] : {};
					}
					current = current[parts[j]];
				}
				lastPart = parts.pop();
				if (lastPart === '[]') {
					current.push(value);
				} else {
					current[lastPart] = value;
				}
			}
		});
	}
	return data;
};
