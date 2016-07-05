module.exports = function(babel){
  var t = babel.types;

  return {
    // babel 在遍历AST的时候会检查每一个节点,如何找到插件中 **对应的同节点名字的方法**, 它就会将该节点信息传入该方法
    visitor: {
      BinaryExpression:function(path){
        var node = path.node;
        if(!t.isBinaryExpression(node, { operator: "|" })) return;

        // 如果左节点是二元操作符
        path.replaceWith(
          t.callExpression(
            node.right,
            [node.left]
          )
        );
      }
    }
  }
}