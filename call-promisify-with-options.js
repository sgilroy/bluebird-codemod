function transformer(file, api) {
  const j = api.jscodeshift;
  const source = j(file.source);
  const getReplacer = multiArgs => {
    return path => {
      let callNode;
      if (multiArgs) {
        callNode = path.node.callee.object.callee;
      } else {
        callNode = path.node;
      }
      const contextNode = callNode.arguments[1];
      // Promise.promisify(obj, context)

      if (
        contextNode.type === 'ObjectExpression' &&
        contextNode.properties.some(property => {
          return (
            property.key.type === 'Identifier' &&
            property.key.name === 'context'
          );
        })
      ) {
        // appears to have been transformed already
        return path.node;
      }

      const properties = [];

      if (multiArgs) {
        properties.push(
          j.objectProperty(j.identifier('multiArgs'), j.literal(true))
        );
      }
      properties.push(j.objectProperty(j.identifier('context'), contextNode));

      callNode.arguments[1] = j.objectExpression(properties);
      return path.node;
    };
  };

  source
    .find(j.CallExpression, {
      callee: {
        property: {
          name: 'spread'
        },
        object: {
          callee: {
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
          }
        }
      }
    })
    .replaceWith(getReplacer(true));

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
    .replaceWith(getReplacer())
    .toSource();
}

module.exports = transformer;
