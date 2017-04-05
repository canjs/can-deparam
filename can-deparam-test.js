var deparam = require('./can-deparam');
var QUnit = require('steal-qunit');

QUnit.module('can/util/string/deparam');
/** /
test("Basic deparam",function(){

var data = deparam("a=b");
equal(data.a,"b")

var data = deparam("a=b&c=d");
equal(data.a,"b")
equal(data.c,"d")
})
/**/
test('Nested deparam', function () {
	var data = deparam('a[b]=1&a[c]=2');
	equal(data.a.b, 1);
	equal(data.a.c, 2);
	data = deparam('a[]=1&a[]=2');
	equal(data.a[0], 1);
	equal(data.a[1], 2);
	data = deparam('a[b][]=1&a[b][]=2');
	equal(data.a.b[0], 1);
	equal(data.a.b[1], 2);
	data = deparam('a[0]=1&a[1]=2');
	equal(data.a[0], 1);
	equal(data.a[1], 2);
});
test('Remaining ampersand', function () {
	var data = deparam('a[b]=1&a[c]=2&');
	deepEqual(data, {
		a: {
			b: '1',
			c: '2'
		}
	});
});
test('Invalid encoding', function() {
	var data = deparam('foo=%0g');
	deepEqual(data, {
		foo: '%0g'
	});
});
/** /
test("deparam an array", function(){
var data = deparam("a[0]=1&a[1]=2");

ok(can.isArray(data.a), "is array")

equal(data.a[0],1)
equal(data.a[1],2)
})

test("deparam object with spaces", function(){
 var data = deparam("a+b=c+d&+e+f+=+j+h+");

  equal(data["a b"], "c d")
  equal(data[" e f "], " j h ")
})
/**/
