import Em from 'ember';
var get = Em.get;
var computed = Em.computed;

var DEFAULT_LIMIT = Infinity;

var ArrayLimit = Em.ArrayProxy.extend({
	limit: computed(function (name, limit, old) {
		// getter
		if (arguments.length < 2) {
			return DEFAULT_LIMIT;
		}
		limit = Number(limit); // ensure limit is number
		limit = Math.max(limit, 0); // do not allow negative limit
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
		var arrangedLength = get(arranged, 'length');
		var addedCount = Math.max(diff, 0);
		var removedCount = Math.max(-diff, 0);
		var toAdd = content.slice(old, old + addedCount);
		arranged.replace(arrangedLength - removedCount, removedCount, toAdd);
		return limit;
	}),

	arrangedContent: computed('content', function () {
		var content = this.get('content');
		var limit = this.get('limit');
		var slice = content.slice(0, limit);
		return Em.A(slice);
	}),

	// process items removed
	contentArrayWillChange: function (arr, idx, removedCount, addedCount) {
		var arrangedContent = this.get('arrangedContent');
		var arrangedContentLength = get(arrangedContent, 'length');
		var limit = this.get('limit');
		if (idx >= limit) {
			return;
		}
		if (idx + removedCount > arrangedContentLength) {
			removedCount = arrangedContentLength - idx;
		}
		arrangedContent.replace(idx, removedCount);
		arrangedContentLength = get(arrangedContent, 'length');
		if (arrangedContentLength < limit) {
			var toAdd = arr.slice(arrangedContentLength, limit);
			arrangedContent.replace(arrangedContentLength, 0, toAdd);
		}
	},

	// process items added
	contentArrayDidChange: function (arr, idx, removedCount, addedCount) {
		var arrangedContent = this.get('arrangedContent');
		var limit = this.get('limit');
		if (idx >= limit) {
			return;
		}
		var end = Math.min(idx + addedCount, limit);
		var toAdd = arr.slice(idx, end);
		arrangedContent.replace(idx, 0, toAdd);
		arrangedContent.replace(limit, Infinity);
	}
});

export default ArrayLimit;
