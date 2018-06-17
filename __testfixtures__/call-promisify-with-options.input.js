const Promise = require("bluebird");

function fn(callback) {
  setTimeout(function() {
    callback(null, true);
  })
}

const ctx = {
  prop: 'some-property'
};

const obj = {foo: () => {}};

// function
Promise.promisify(fn, ctx)();
Promise.promisify(fn)();

// object method
Promise.promisify(obj.foo, obj)('something');
Promise.promisify(obj.foo)('something');

// already converted
Promise.promisify(obj.foo, {
  context: obj
})('something');
