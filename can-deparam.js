"use strict";
var namespace = require("can-namespace");

/**
 * @module {function} can-deparam can-deparam
 * @parent can-routing
 * @collection can-infrastructure
 * @package ./package.json
 * @description Deserialize a query string into an array or object.
 * @signature `deparam(params)`
 *
 * @param {String} params A form-urlencoded string of key-value pairs.
 * @param {function} [valueDeserializer] A function that decodes the string values. For example, using
 * [can-string-to-any] will convert `"null"` to `null` like:
 *
 *   ```js
 *   import stringToAny from "can-string-to-any";
 *   deparam("value=null", stringToAny) //-> {value: null}
 *   ```
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
 * @body
 *
 * ## Try it
 *
 * Use this JS Bin to play around with this package:
 *
 * <a class="jsbin-embed" href="https://jsbin.com/mobimok/3/embed?js,console">can-deparam on jsbin.com</a>
 * <script src="https://static.jsbin.com/js/embed.min.js?4.0.4"></script>
 */
var digitTest = /^\d+$/,
	keyBreaker = /([^\[\]]+)|(\[\])/g,
	paramTest = /([^?#]*)(#.*)?$/,
	entityRegex = /%([^0-9a-f][0-9a-f]|[0-9a-f][^0-9a-f]|[^0-9a-f][^0-9a-f])/i,
	prep = function (str) {
		str = str.replace(/\+/g, ' ');

		try {
			return decodeURIComponent(str);
		}
		catch (e) {
			return decodeURIComponent(str.replace(entityRegex, function(match, hex) {
				return '%25' + hex;
			}));
		}
	};

function isArrayLikeName(name) {
	return digitTest.test(name) || name === '[]';
}


function idenity(value){ return value; }

module.exports = namespace.deparam = function (params, valueDeserializer) {
	valueDeserializer = valueDeserializer || idenity;
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
					var currentName = parts[j],
						nextName = parts[j + 1],
						currentIsArray = isArrayLikeName(currentName) && current instanceof Array;
					if (!current[currentName]) {
						if(currentIsArray) {
							current.push( isArrayLikeName(nextName) ? [] : {} );
						} else {
							// If what we are pointing to looks like an `array`
							current[currentName] = isArrayLikeName(nextName) ? [] : {};
						}

					}
					if(currentIsArray) {
						current = current[current.length - 1];
					} else {
						current = current[currentName];
					}

				}
				lastPart = parts.pop();
				if ( isArrayLikeName(lastPart) ) {
					current.push(valueDeserializer(value));
				} else {
					current[lastPart] = valueDeserializer(value);
				}
			}
		});
	}
	return data;
};
