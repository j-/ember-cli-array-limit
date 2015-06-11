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

QUnit.test('length is updated', function (assert) {
	var arr = Em.A(['a', 'b', 'c', 'd', 'e', 'f']);
	var proxy = ArrayLimit.create({
		content: arr
	});
	assert.equal(proxy.get('length'), 6, 'Default limit');
	proxy.set('limit', 1);
	assert.equal(proxy.get('length'), 1, 'Limit of 1');
	proxy.set('limit', 5);
	assert.equal(proxy.get('length'), 5, 'Limit of 5');
	proxy.set('limit', 7);
	assert.equal(proxy.get('length'), 6, 'Limit of 7 (greater than content length)');
	proxy.set('limit', 3);
	assert.equal(proxy.get('length'), 3, 'Limit of 3');
});



QUnit.test('can push with no limit', function (assert) {
	var arr = Em.A(['a', 'b', 'c']);
	var proxy = ArrayLimit.create({
		content: arr
	});
	assert.equal(proxy.get('length'), 3, 'Initial length');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c'], 'Initial length');
	arr.pushObject('d');
	assert.equal(proxy.get('length'), 4, 'Pushed 1 object');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c', 'd'], 'Pushed 1 object');
	arr.pushObjects(['e', 'f']);
	assert.equal(proxy.get('length'), 6, 'Pushed 2 objects');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c', 'd', 'e', 'f'], 'Pushed 2 objects');
});

QUnit.test('can push with limit', function (assert) {
	var arr = Em.A(['a', 'b', 'c']);
	var proxy = ArrayLimit.create({
		content: arr,
		limit: 3
	});
	assert.equal(proxy.get('length'), 3, 'Initial length');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c'], 'Initial length');
	arr.pushObject('d');
	assert.equal(proxy.get('length'), 3, 'Pushed 1 object');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c'], 'Pushed 1 object');
	arr.pushObjects(['e', 'f']);
	assert.equal(proxy.get('length'), 3, 'Pushed 2 objects');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c'], 'Pushed 2 objects');
});

QUnit.test('can pop with no limit', function (assert) {
	var arr = Em.A(['a', 'b', 'c']);
	var proxy = ArrayLimit.create({
		content: arr
	});
	assert.equal(proxy.get('length'), 3, 'Initial length');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c'], 'Initial length');
	assert.equal(arr.popObject(), 'c', 'Can pop last object');
	assert.equal(proxy.get('length'), 2, 'Popped last object');
	assert.deepEqual(proxy.toArray(), ['a', 'b'], 'Popped last object');
	assert.equal(arr.popObject(), 'b', 'Can pop next last object');
	assert.equal(proxy.get('length'), 1, 'Popped next last object');
	assert.deepEqual(proxy.toArray(), ['a'], 'Popped next last object');
});

QUnit.test('can pop with limit', function (assert) {
	var arr = Em.A(['a', 'b', 'c', 'd', 'e', 'f']);
	var proxy = ArrayLimit.create({
		content: arr,
		limit: 3
	});
	assert.equal(proxy.get('length'), 3, 'Initial length');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c'], 'Initial length');
	assert.equal(arr.popObject(), 'f', 'Pop first');
	assert.equal(proxy.get('length'), 3, 'Pop first');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c'], 'Pop first');
	assert.equal(arr.popObject(), 'e', 'Pop second');
	assert.equal(proxy.get('length'), 3, 'Pop second');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c'], 'Pop second');
	assert.equal(arr.popObject(), 'd', 'Pop third');
	assert.equal(proxy.get('length'), 3, 'Pop third');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c'], 'Pop third');
	assert.equal(arr.popObject(), 'c', 'Pop fourth');
	assert.equal(proxy.get('length'), 2, 'Pop fourth');
	assert.deepEqual(proxy.toArray(), ['a', 'b'], 'Pop fourth');
});

QUnit.test('can unshift with no limit', function (assert) {
	var arr = Em.A(['d', 'e', 'f']);
	var proxy = ArrayLimit.create({
		content: arr
	});
	assert.equal(proxy.get('length'), 3, 'Initial length');
	assert.deepEqual(proxy.toArray(), ['d', 'e', 'f'], 'Initial length');
	arr.unshiftObject('c');
	assert.equal(proxy.get('length'), 4, 'Shift 1 object');
	assert.deepEqual(proxy.toArray(), ['c', 'd', 'e', 'f'], 'Shift 1 object');
	arr.unshiftObjects(['a', 'b']);
	assert.equal(proxy.get('length'), 6, 'Shift 2 objects');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c', 'd', 'e', 'f'], 'Shift 2 objects');
});

QUnit.test('can unshift with limit', function (assert) {
	var arr = Em.A(['d', 'e', 'f']);
	var proxy = ArrayLimit.create({
		content: arr,
		limit: 3
	});
	assert.equal(proxy.get('length'), 3, 'Initial length');
	assert.deepEqual(proxy.toArray(), ['d', 'e', 'f'], 'Initial length');
	arr.unshiftObject('c');
	assert.equal(proxy.get('length'), 3, 'Shift 1 object');
	assert.deepEqual(proxy.toArray(), ['c', 'd', 'e'], 'Shift 1 object');
	arr.unshiftObjects(['a', 'b']);
	assert.equal(proxy.get('length'), 3, 'Shift 2 objects');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c'], 'Shift 2 objects');
});

QUnit.test('can shift with no limit', function (assert) {
	var arr = Em.A(['a', 'b', 'c', 'd', 'e', 'f']);
	var proxy = ArrayLimit.create({
		content: arr
	});
	assert.equal(proxy.get('length'), 6, 'Initial length');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c', 'd', 'e', 'f'], 'Initial length');
	assert.equal(arr.shiftObject(), 'a', 'Shift first object');
	assert.equal(proxy.get('length'), 5, 'Shift first object');
	assert.deepEqual(proxy.toArray(), ['b', 'c', 'd', 'e', 'f'], 'Shift first object');
	assert.equal(arr.shiftObject(), 'b', 'Shift second object');
	assert.equal(proxy.get('length'), 4, 'Shift second object');
	assert.deepEqual(proxy.toArray(), ['c', 'd', 'e', 'f'], 'Shift second object');
	assert.equal(arr.shiftObject(), 'c', 'Shift third object');
	assert.equal(proxy.get('length'), 3, 'Shift third object');
	assert.deepEqual(proxy.toArray(), ['d', 'e', 'f'], 'Shift third object');
});

QUnit.test('can shift with limit', function (assert) {
	var arr = Em.A(['a', 'b', 'c', 'd', 'e', 'f']);
	var proxy = ArrayLimit.create({
		content: arr,
		limit: 3
	});
	assert.equal(proxy.get('length'), 3, 'Initial length');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c'], 'Initial length');
	assert.equal(arr.shiftObject(), 'a', 'Shift first object');
	assert.equal(proxy.get('length'), 3, 'Shift first object');
	assert.deepEqual(proxy.toArray(), ['b', 'c', 'd'], 'Shift first object');
	assert.equal(arr.shiftObject(), 'b', 'Shift second object');
	assert.equal(proxy.get('length'), 3, 'Shift second object');
	assert.deepEqual(proxy.toArray(), ['c', 'd', 'e'], 'Shift second object');
	assert.equal(arr.shiftObject(), 'c', 'Shift third object');
	assert.equal(proxy.get('length'), 3, 'Shift third object');
	assert.deepEqual(proxy.toArray(), ['d', 'e', 'f'], 'Shift third object');
	assert.equal(arr.shiftObject(), 'd', 'Shift fourth object');
	assert.equal(proxy.get('length'), 2, 'Shift fourth object');
	assert.deepEqual(proxy.toArray(), ['e', 'f'], 'Shift fourth object');
});

QUnit.test('can replace with no limit', function (assert) {
	var arr = Em.A(['a', 'b', 'x', 'y', 'z']);
	var proxy = ArrayLimit.create({
		content: arr
	});
	assert.equal(proxy.get('length'), 5, 'Initial array');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'x', 'y', 'z'], 'Initial array');
	arr.replace(2, 0, ['c']);
	assert.equal(proxy.get('length'), 6, 'Insert "c"');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c', 'x', 'y', 'z'], 'Insert "c"');
	arr.replace(3, 3, ['d', 'e', 'f']);
	assert.equal(proxy.get('length'), 6, 'Replace XYZ with DEF');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c', 'd', 'e', 'f'], 'Replace XYZ with DEF');
	arr.replace(1, 4);
	assert.equal(proxy.get('length'), 2, 'Remove BCDE');
	assert.deepEqual(proxy.toArray(), ['a', 'f'], 'Remove BCDE');
	arr.replace(0, 2);
	assert.equal(proxy.get('length'), 0, 'Remove AF');
	assert.deepEqual(proxy.toArray(), [], 'Remove AF');
	arr.replace(0, 0, ['x', 'y', 'z']);
	assert.equal(proxy.get('length'), 3, 'Insert XYZ');
	assert.deepEqual(proxy.toArray(), ['x', 'y', 'z'], 'Insert XYZ');
	arr.replace(0, 3, ['a', 'b', '1', '2', 'e', 'f']);
	assert.equal(proxy.get('length'), 6, 'Replace XYZ with AB12EF');
	assert.deepEqual(proxy.toArray(), ['a', 'b', '1', '2', 'e', 'f'], 'Replace XYZ with AB12EF');
	arr.replace(2, 2, ['c', 'd']);
	assert.equal(proxy.get('length'), 6, 'Replace 12 with CD');
	assert.deepEqual(proxy.toArray(), ['a', 'b', 'c', 'd', 'e', 'f'], 'Replace 12 with CD');
});
