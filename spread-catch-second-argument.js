function transformer(file, api) {
  const j = api.jscodeshift;
  const source = j(file.source);
  const replacer = path => {
    // .spread(fulfilledHandler, rejectedHandler)
    const callNode = path.node;
    const rejectedHandlerNode = callNode.arguments.pop();

    // => .spread(fulfilledHandler).catch(rejectedHandler)
    return j.memberExpression(
      callNode,
      j.callExpression(j.identifier('catch'), [rejectedHandlerNode])
    );
  };

  return source
    .find(j.CallExpression, {
      callee: {
        property: {
          name: 'spread'
        }
      },
      arguments: {
        length: 2
      }
    })
    .replaceWith(replacer)
    .toSource();
}

module.exports = transformer;
