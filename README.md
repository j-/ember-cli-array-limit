# ember-cli-array-limit

[![master branch build status][build-icon]][build-link]

Ember CLI array limit addon.

`ember-cli-array-limit` exposes an [Ember][ember] [ArrayProxy][proxy] subclass
which returns only the content array items before a certain limit.

## Example

```js
import Ember from 'ember';
import ArrayLimit from 'array-limit';

var arr = Ember.A(['a', 'b', 'c', 'd', 'e', 'f']);
var proxy = ArrayLimit.create({
	content: arr,
	limit: 3
});

console.log(proxy.toArray()); // ['a', 'b', 'c']
proxy.incrementProperty('limit');
console.log(proxy.toArray()); // ['a', 'b', 'c', 'd']
arr.unshiftObject('x');
console.log(proxy.toArray()); // ['x', 'a', 'b', 'c']
```

## Properties

**`content`**: Ember.Array (optional, default = `null`)

The content array. Must be an object that implements `Ember.Array` and/or
`Ember.MutableArray`. See [`Ember.ArrayProxy#content`][content].

**`limit`**: Number (optional, default = `Infinity`)

This value determines the maximum number of elements to allow.

## Installing

With [npm][npm]:

```sh
$ npm install --save-dev ember-cli-array-limit
```

Or with [Ember CLI][cli]:

```sh
$ ember install ember-cli-array-limit
```

## License

[MIT license](LICENSE.md).

[build-icon]: https://travis-ci.org/j-/ember-cli-array-limit.svg?branch=master
[build-link]: https://travis-ci.org/j-/ember-cli-array-limit
[ember]: http://emberjs.com/
[proxy]: http://emberjs.com/api/classes/Ember.ArrayProxy.html
[content]: http://emberjs.com/api/classes/Ember.ArrayProxy.html#property_content
[npm]: https://www.npmjs.com/
[cli]: http://www.ember-cli.com/
