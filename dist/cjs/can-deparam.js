/*can-deparam@1.1.1#can-deparam*/
'use strict';
var namespace = require('can-namespace');
var digitTest = /^\d+$/, keyBreaker = /([^\[\]]+)|(\[\])/g, paramTest = /([^?#]*)(#.*)?$/, entityRegex = /%([^0-9a-f][0-9a-f]|[0-9a-f][^0-9a-f]|[^0-9a-f][^0-9a-f])/i, prep = function (str) {
        str = str.replace(/\+/g, ' ');
        try {
            return decodeURIComponent(str);
        } catch (e) {
            return decodeURIComponent(str.replace(entityRegex, function (match, hex) {
                return '%25' + hex;
            }));
        }
    };
function isArrayLikeName(name) {
    return digitTest.test(name) || name === '[]';
}
function idenity(value) {
    return value;
}
module.exports = namespace.deparam = function (params, valueDeserializer) {
    valueDeserializer = valueDeserializer || idenity;
    var data = {}, pairs, lastPart;
    if (params && paramTest.test(params)) {
        pairs = params.split('&');
        pairs.forEach(function (pair) {
            var parts = pair.split('='), key = prep(parts.shift()), value = prep(parts.join('=')), current = data;
            if (key) {
                parts = key.match(keyBreaker);
                for (var j = 0, l = parts.length - 1; j < l; j++) {
                    var currentName = parts[j], nextName = parts[j + 1], currentIsArray = isArrayLikeName(currentName) && current instanceof Array;
                    if (!current[currentName]) {
                        if (currentIsArray) {
                            current.push(isArrayLikeName(nextName) ? [] : {});
                        } else {
                            current[currentName] = isArrayLikeName(nextName) ? [] : {};
                        }
                    }
                    if (currentIsArray) {
                        current = current[current.length - 1];
                    } else {
                        current = current[currentName];
                    }
                }
                lastPart = parts.pop();
                if (isArrayLikeName(lastPart)) {
                    current.push(valueDeserializer(value));
                } else {
                    current[lastPart] = valueDeserializer(value);
                }
            }
        });
    }
    return data;
};