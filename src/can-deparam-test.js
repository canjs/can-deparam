import QUnit from 'steal-qunit';
import plugin from './can-deparam';

QUnit.module('can-deparam');

QUnit.test('Initialized the plugin', function(){
  QUnit.equal(typeof plugin, 'function');
  QUnit.equal(plugin(), 'This is the can-deparam plugin');
});
