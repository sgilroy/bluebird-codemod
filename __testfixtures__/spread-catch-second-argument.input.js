const Promise = require("bluebird");

// .spread(fulfilledHandler, rejectedHandler)
Promise.resolve().spread(() => {}, error => { console.error(error) });

// already converted
Promise.resolve().spread(() => {}).catch(error => { console.error(error) });
