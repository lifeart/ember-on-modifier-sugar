"use strict";

class EvalHelperTransform {
  constructor(options) {
    this.syntax = null;
    this.options = options;
  }

  transform(ast) {
    let b = this.syntax.builders;
    // **** copy from here ****

    function handleNode(elNode) {
      function valueToPath(value) {
        if (!isNaN(value)) {
            return b.number(Number(value));
        }
        if (value === 'null') {
            return b.null();
        } else if (value === 'undefined') {
            return b.undefined();
        } else if (value === 'true' || value === 'false' ) {
            return b.boolean(value === 'true');
        } else if (value.startsWith("\"")) {
            return b.string(JSON.parse(value));
        } else if (value.startsWith("'")) {
            return b.string(value.slice(1).slice(0, -1));
        }
        let local = value.startsWith("this.");
        let data = value.startsWith("@");
        let parts = [];
        if (local) {
          parts = value.replace("this.", "").split(".");
        } else if (data) {
          parts = value.replace("@", "").split(".");
        }
        if (value === "this") {
          parts = [];
          local = true;
        }
        return {
          type: "PathExpression",
          original: value,
          this: local,
          parts: parts,
          data: data,
          loc: null
        };
      }

      function hasValidAttributeName(name) {
        return name.startsWith("(") && name.endsWith(")");
      }

      function extractFunctionNameAndArguments(ch) {
        let fnName = ch.slice(0, ch.indexOf("("));
        let args = ch
          .replace(fnName + "(", "")
          .slice(0, -1)
          .split(",")
          .map(e => e.trim())
          .filter(e => e.length);
        return [fnName, args];
      }

      const attrsToRemove = [];
      elNode.attributes.forEach(node => {
        if (node.value.type !== "TextNode") {
          return;
        }
        let name = null;
        if (hasValidAttributeName(node.name)) {
           name = node.name.slice(1).slice(0, -1);
        } else {
            return;
        }
        if (name === null) {
          return;
        }

        const [fnName, args] = extractFunctionNameAndArguments(
          node.value.chars
        );
        let params = [b.string(name)];

        if (args.length > 0) {
          params.push(
            b.sexpr(b.path("fn"), [
                valueToPath(fnName),
                ...args.map(a => valueToPath(a))
            ])
          );
        } else {
          params.push(valueToPath(fnName));
        }
        elNode.modifiers.push(b.elementModifier(b.path("on"), params));
        attrsToRemove.push(node);
      });

      elNode.attributes = elNode.attributes.filter(
        attr => !attrsToRemove.includes(attr)
      );
    }

    let visitor = {
      ElementNode: handleNode
    };

    // **** copy to here ****

    this.syntax.traverse(ast, visitor);

    return ast;
  }
}

module.exports = EvalHelperTransform;
