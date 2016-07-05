

module.exports = function(babel){
  var t = babel.types;

  function moriMethod(name) {
    var expr = t.memberExpression(
      t.identifier('mori'),
      t.identifier(name)
    );

    expr.isClean = true;
    return expr;
  }

  return {
    // babel 在遍历AST的时候会检查每一个节点,如何找到插件中 **对应的同节点名字的方法**, 它就会将该节点信息传入该方法
    visitor: {
      ArrayExpression: function(path){
        path.replaceWith(
          t.callExpression(
            moriMethod('vector'),path.node.elements
          )
        );
      },
      ObjectExpression: function(path){
        var props = [];
        path.node.properties.forEach(function(prop) {
          props.push(
            t.stringLiteral(prop.key.name),
            prop.value
          )
        });
        path.replaceWith(
          t.callExpression(
            moriMethod('hashMap'),
            props
          )
        )
      },
      AssignmentExpression: function(path) {
        var lhs = path.node.left;
        var rhs = path.node.right;

        if(t.isMemberExpression(lhs)){
          if(t.isIdentifier(lhs.property)){
            lhs.property = t.stringLiteral(lhs.property.name);
          }
          path.replaceWith(
            t.callExpression(
              moriMethod('assoc'),
              [lhs.object, lhs.property, rhs]
            )
          );
        }
      },
      MemberExpression:function(path){
        if(path.node.isClean) return;
        if(t.isAssignmentExpression(path.parent)) return;
        if(t.isIdentifier(path.node.property)) {
          path.node.property = t.stringLiteral(path.node.property.name);
        }
        path.replaceWith(
          t.callExpression(
            moriMethod('get'),
            [path.node.object, path.node.property]
          )
        );
      }
    }
  }
}