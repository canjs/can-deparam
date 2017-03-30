# can-deparam

[![Build Status](https://travis-ci.org/canjs/can-deparam.png?branch=master)](https://travis-ci.org/canjs/can-deparam)

Deserialize a query string into an array or object.

## Usage

### ES6 use

With StealJS, you can import this module directly in a template that is autorendered:

```js
import plugin from 'can-deparam';
```

### CommonJS use

Use `require` to load `can-deparam` and everything else
needed to create a template that uses `can-deparam`:

```js
var plugin = require("can-deparam");
```

## AMD use

Configure the `can` and `jquery` paths and the `can-deparam` package:

```html
<script src="require.js"></script>
<script>
	require.config({
	    paths: {
	        "jquery": "node_modules/jquery/dist/jquery",
	        "can": "node_modules/canjs/dist/amd/can"
	    },
	    packages: [{
		    	name: 'can-deparam',
		    	location: 'node_modules/can-deparam/dist/amd',
		    	main: 'lib/can-deparam'
	    }]
	});
	require(["main-amd"], function(){});
</script>
```

### Standalone use

Load the `global` version of the plugin:

```html
<script src='./node_modules/can-deparam/dist/global/can-deparam.js'></script>
```
