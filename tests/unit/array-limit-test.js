/* global QUnit */
import Em from 'ember';
import ArrayLimit from 'array-limit';

QUnit.module('ArrayLimit');

QUnit.test('constructor exists', function (assert) {
	assert.ok(ArrayLimit, 'ArrayLimit is not null or undefined');
	assert.equal(typeof ArrayLimit, 'function', 'ArrayLimit is function');
});

QUnit.test('can be initialized without content', function (assert) {
	assert.ok(ArrayLimit.create(), 'ArrayLimit is created without content');
});

QUnit.test('content is initialized', function (assert) {
	var arr = Em.A(['a', 'b', 'c']);
	var proxy = ArrayLimit.create({
		content: arr
	});
	assert.equal(proxy.get('arrangedContent.length'), 3);
	assert.equal(proxy.get('content.length'), 3);
	assert.equal(proxy.get('length'), 3);
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c']);
});

QUnit.test('default limit', function (assert) {
	var proxy = ArrayLimit.create();
	assert.equal(proxy.get('limit'), Infinity, 'Default limit is infinity');
});

QUnit.test('can be initialized with limit', function (assert) {
	var arr = Em.A(['a', 'b', 'c', 'd', 'e', 'f']);
	var proxy = ArrayLimit.create({
		content: arr,
		limit: 3
	});
	assert.equal(proxy.get('limit'), 3, 'Can set limit');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c']);
});

QUnit.test('limit cannot be negative', function (assert) {
	var proxy = ArrayLimit.create({
		limit: -1
	});
	assert.equal(proxy.get('limit'), 0, 'Initialized with -1 limit');
	proxy.set('limit', -2);
	assert.equal(proxy.get('limit'), 0, 'Limit property set to -2');
	proxy.decrementProperty('limit');
	assert.equal(proxy.get('limit'), 0, 'Limit property decremented');
});
