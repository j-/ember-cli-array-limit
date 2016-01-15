import Em from 'ember';

var computed = Em.computed;
var min = Math.min, max = Math.max;
var get = Em.get;

var DEFAULT_LIMIT = Infinity;

var ArrayLimit = Em.ArrayProxy.extend({
	content: computed(function () {
		return Em.A();
	}),

	limit: computed({
		get: function () {
			return DEFAULT_LIMIT;
		},
		set: function (name, limit, old) {
			limit = Number(limit); // ensure limit is number
			limit = max(limit, 0); // do not allow negative limit
			if (old === undefined) {
				// being set for first time, no need to update
				return limit;
			}
			var diff = limit - old;
			if (diff === 0) {
				// no need to continue if no difference
				return limit;
			}
			var content = this.get('content');
			var arranged = this.get('arrangedContent');
			var toAdd;
			// limit decreased
			if (diff < 0) {
				arranged.replace(limit, -diff);
			}
			else {
				toAdd = content.slice(old, limit);
				arranged.replace(old, 0, toAdd);
			}
			return limit;
		}
	}),

	arrangedContent: computed('content', function () {
		var content = this.get('content');
		var limit = this.get('limit');
		var slice = content.slice(0, limit);
		return Em.A(slice);
	}),

	// process items removed
	contentArrayWillChange: function (arr, idx, removedCount/*, addedCount*/) {
		if (removedCount <= 0) {
			return;
		}
		var arrangedContent = this.get('arrangedContent');
		var arrangedLength = get(arrangedContent, 'length');
		arrangedContent.replace(idx, arrangedLength - idx);
		var limit = this.get('limit');
		var start = idx + removedCount;
		var end = limit + removedCount;
		var toAdd = arr.slice(start, end);
		arrangedContent.pushObjects(toAdd);
	},

	// process items added
	contentArrayDidChange: function (arr, idx, removedCount, addedCount) {
		if (addedCount <= 0) {
			return;
		}
		var arrangedContent = this.get('arrangedContent');
		var limit = this.get('limit');
		var end = min(idx + addedCount, limit);
		var toAdd = arr.slice(idx, end);
		arrangedContent.replace(idx, 0, toAdd);
		var arrangedLength = get(arrangedContent, 'length');
		arrangedContent.replace(limit, arrangedLength);
	}
});

export default ArrayLimit;
