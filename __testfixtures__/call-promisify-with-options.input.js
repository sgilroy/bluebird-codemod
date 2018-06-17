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

// .then
Promise.promisify(obj.foo, obj)('something').then(result => {});

// .spread
Promise.promisify(obj.foo, obj)('something').spread((result1, result2) => {});

// already converted
Promise.promisify(obj.foo, {
  context: obj
})('something');
