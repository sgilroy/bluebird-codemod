function transformer(file, api) {
  const j = api.jscodeshift;
  const source = j(file.source);
  const replacer = path => {
    const callNode = path.node;
    const contextNode = callNode.arguments[1];
    // Promise.promisify(obj, context)
    if (
      contextNode.type === 'ObjectExpression' &&
      contextNode.properties.some(property => {
        return (
          property.key.type === 'Identifier' && property.key.name === 'context'
        );
      })
    ) {
      // appears to have been transformed already
      return callNode;
    }

    callNode.arguments[1] = j.objectExpression([
      j.objectProperty(j.identifier('context'), contextNode)
    ]);
    return callNode;
  };

  return source
    .find(j.CallExpression, {
      callee: {
        object: {
          name: 'Promise'
        },
        property: {
          name: 'promisify'
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
