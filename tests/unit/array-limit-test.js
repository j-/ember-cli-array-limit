/* global QUnit */
import Em from 'ember';
import ArrayLimit from 'array-limit';

QUnit.module('ArrayLimit');

QUnit.test('constructor exists', function (assert) {
	assert.ok(ArrayLimit, 'ArrayLimit is not null or undefined');
	assert.equal(typeof ArrayLimit, 'function', 'ArrayLimit is function');
});
