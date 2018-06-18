## bluebird-codemod

[![Build Status](https://img.shields.io/travis/sgilroy/bluebird-codemod.svg?style=flat-square)](https://travis-ci.org/sgilroy/bluebird-codemod) [![Code Style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

This repository contains a collection of codemod scripts for use with
[JSCodeshift](https://github.com/facebook/jscodeshift) that help upgrade usage of bluebird APIs.

The excellent [sinon-codemod](https://github.com/hurrymaplelad/sinon-codemod) repository was used as inspiration and served as a template for this repository.

### Setup & Run

* `npm install -g jscodeshift`
* `git clone https://github.com/sgilroy/bluebird-codemod.git` or download a zip file
  from `https://github.com/sgilroy/bluebird-codemod/archive/master.zip`
* Run `npm install` in the bluebird-codemod directory
  * Alternatively, run [`yarn`](https://yarnpkg.com/) to install in the
    bluebird-codemod directory for a reliable dependency resolution
* `jscodeshift -t <codemod-script> <path>`
* Use the `-d` option for a dry-run and use `-p` to print the output
  for comparison

### New in bluebird 3.0

See the [bluebird docs](http://bluebirdjs.com/docs/new-in-bluebird-3.html) for the full list of changes.

#### Promisification API changes

The calling convention for [`Promise.promisify()` has changed](http://bluebirdjs.com/docs/new-in-bluebird-3.html#promisification-api-changes).

>Both promisification \([Promise.promisify](.) and [Promise.promisifyAll](.)\) methods and [Promise.fromCallback](.) now by default ignore multiple arguments passed to the callback adapter and instead only the first argument is used to resolve the promise. The behavior in 2.x is to construct an array of the arguments and resolve the promise with it when more than one argument is passed to the callback adapter. The problems with this approach and reasons for the change are discussed in [#307](.).
>
>[Promise.promisify](.)'s second argument is now an options object, so any code using the second argument needs to change:
>
>```js
>// 2.x
>Promise.promisify(fn, ctx);
>// 3.0
>Promise.promisify(fn, {context: ctx});
>```

This calling convention change was introduced in order to support a new option when promisifying, `multiArgs`.
>Setting `multiArgs` to `true` means the resulting promise will always fulfill with an array of the callback's success value(s). This is needed because promises only support a single success value while some callback API's have multiple success value. The default is to ignore all but the first success value of a callback function.

#### `.spread`'s second argument has been removed

Previously, `.spread` supported a rejected handler as a second argument, like `.then`. This support for a second
argument has been removed and now a separate `.catch` call should be used instead.

### Included Scripts

#### `call-promisify-with-options`

Converts the second argument of calls to `Promise.promisify(fn, ctx)` into `Promise.promisify(fn, {context: ctx})`.

If the expression has a `.spread` call chained onto it, the script will infer that `multiArgs` should be used so that
the multiple arguments (not just the first) from the callback can be accessed. Note that this may result in some
false-positives where the `multiArgs` option will need to be manually removed after the script is run. Also, some cases
where `multiArgs` is needed will not be detected automatically and the option will need to be added manually in order
to restore the behavior from the pre-3.x version of bluebird. See the unit tests for examples.

```sh
jscodeshift -t bluebird-codemod/call-promisify-with-options.js <path>
```

#### `spread-catch-second-argument`

Converts calls to `.spread` that use a second argument to a combination of `.spread` (for the fulfilled handler) and
`.catch` (for the rejected handler). That is, calls of `promise.spread(fulfilledHandler, rejectedHandler)` are converted to
`promise.spread(fulfilledHandler).catch(rejectedHandler)`.

```sh
jscodeshift -t bluebird-codemod/spread-catch-second-argument.js <path>
```
