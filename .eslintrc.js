var OFF = 0, WARN = 1, ERROR = 2;

module.exports = exports = {
  "root": true,
  "env": {
    "es6": true,
    "mocha": true
  },
  "esversion": 6,

  "ecmaFeatures": {
    "modules": true
  },
  "extends": [
    "eslint:recommended",
    "angular"
  ],

  "parserOptions": {
    "sourceType": "module",
  },
  "globals": {
    "angular": true,
    "_": true,
    "require": true,
    "ENVIRONMENT": true,
    "VERSION": true,
    "BACK_END_API": true
  },
  "rules": {
    "accessor-pairs": [
      ERROR, {
        "getWithoutSet": false,
        "setWithoutGet": true
      }
    ],
    "arrow-body-style": [ERROR, "always"],
    "arrow-parens": [ERROR, "always"],
    "arrow-spacing": [ERROR, {"before": true, "after": true}],
    "block-scoped-var": WARN,
    "callback-return": [WARN, ["callback", "done", "next"]],
    "consistent-return": ERROR,
    "constructor-super": ERROR,
    "curly": ERROR,
    "default-case": WARN,
    "dot-location": [WARN, "property"],
    "dot-notation": WARN,
    "eqeqeq": [ERROR, "smart"],
    "generator-star-spacing": [ERROR, "before"],
    "global-require": OFF,
    "guard-for-in": WARN,
    "handle-callback-err": WARN,
    "init-declarations": [ERROR, "always"],
    "keyword-spacing": [
      WARN, {
        "before": true,
        "after": true
      }
    ],
    "no-alert": ERROR,
    "no-caller": ERROR,
    "no-case-declarations": WARN,
    "no-catch-shadow": WARN,
    "no-confusing-arrow": [ ERROR, {"allowParens": false}],
    "no-class-assign": ERROR,
    "no-const-assign": ERROR,
    "no-delete-var": ERROR,
    "no-div-regex": WARN,
    "no-dupe-class-members": ERROR,
    "no-else-return": WARN,
    "no-empty-pattern": WARN,
    "no-eq-null": WARN,
    "no-eval": ERROR,
    "no-extend-native": ERROR,
    "no-extra-bind": WARN,
    "no-extra-parens": OFF,
    "no-extend-native": ERROR,
    "no-extra-bind": WARN,
    "no-floating-decimal": WARN,
    "no-implicit-coercion": [
      WARN, {
        "boolean": true,
        "number": true,
        "string": true
      }
    ],
    "no-implied-eval": ERROR,
    "no-invalid-this": OFF,
    "no-iterator": ERROR,
    "no-label-var": ERROR,
    "no-labels": WARN,
    "no-lone-blocks": WARN,
    "no-loop-func": ERROR,
    "no-magic-numbers": OFF,
    "no-mixed-requires": WARN,
    "no-multi-spaces": ERROR,
    "no-multi-str": WARN,
    "no-native-reassign": ERROR,
    "no-new-func": ERROR,
    "no-new-require": ERROR,
    "no-new-wrappers": ERROR,
    "no-new": ERROR,
    "no-octal-escape": ERROR,
    "no-param-reassign": ERROR,
    "no-path-concat": ERROR,
    "no-process-env": WARN,
    "no-fallthrough": ERROR,
    "no-process-exit": ERROR,
    "no-proto": ERROR,
    "no-redeclare": ERROR,
    "no-restricted-modules": OFF,
    "no-return-assign": ERROR,
    "no-script-url": ERROR,
    "no-self-compare": ERROR,
    "no-shadow-restricted-names": ERROR,
    "no-shadow": WARN,
    "no-sync": WARN,
    "no-this-before-super": ERROR,
    "no-throw-literal": ERROR,
    "no-undef-init": OFF,
    "no-undef": ERROR,
    "no-undefined": OFF,
    "no-unexpected-multiline": ERROR,
    "no-unused-expressions": ERROR,
    "no-unused-vars": WARN,
    "no-use-before-define": ERROR,
    "no-useless-call": ERROR,
    "no-useless-concat": ERROR,
    "no-var": ERROR,
    "no-void": WARN,
    "no-warning-comments": [
      WARN, {
        "terms": ["TODO", "FIXME"],
        "location": "start"
      }
    ],
    "no-with": WARN,
    "object-shorthand": [OFF, "never"],
    "prefer-arrow-callback": WARN,
    "prefer-spread": WARN,
    "prefer-template": WARN,
    "radix": WARN,
    "require-yield": ERROR,
    "strict": [ERROR, "global"],
    "vars-on-top": ERROR,
    "wrap-iife": [ERROR, "outside"],
    "yoda": ERROR,
// Style
    "array-bracket-spacing": [WARN, "always"],
    "block-spacing": [WARN, "always"],
    "brace-style": [WARN, "stroustrup", {"allowSingleLine": true}],
    "camelcase": WARN,
    "comma-spacing": [WARN, {"before": false, "after": true}],
    "comma-style": [WARN, "last"],
    "computed-property-spacing": [WARN, "never"],
    "consistent-this": [WARN, "self"],
    "eol-last": WARN,
    "func-names": OFF,
    "func-style": [WARN, "expression"],
    "id-length": [WARN, {"min": 1, "max": 36}],
    "indent": [WARN, 2, {
      "SwitchCase": 1
    }],
    "linebreak-style": OFF, // git fixes this for us on checkin
    "lines-around-comment": OFF,
    "max-depth": [WARN, 8],
    "max-len": [WARN, {
      "code": 132,
      "ignorePattern": "^\\s*\\$log\\.log\\(.*;",
      "ignoreComments": true
    }],
    "max-nested-callbacks": [WARN, 8],
    "max-params": [WARN, 10],
    "new-cap": WARN,
    "new-parens": WARN,
    "no-array-constructor": WARN,
    "no-bitwise": OFF,
    "no-continue": OFF,
    "no-inline-comments": OFF,
    "no-lonely-if": WARN,
    "no-mixed-spaces-and-tabs": WARN,
    "no-multiple-empty-lines": [WARN, {
      "max": 3,
      "maxBOF": 1,
      "maxEOF": 1
    }],
    "no-negated-condition": OFF,
    "no-nested-ternary": WARN,
    "no-new-object": WARN,
    "no-plusplus": OFF,
    "no-spaced-func": WARN,
    "no-ternary": OFF,
    "no-trailing-spaces": WARN,
    "no-underscore-dangle": OFF,
    "no-unneeded-ternary": WARN,
    "object-curly-spacing": [WARN, "always"],
    "one-var": OFF,
    "operator-assignment": [OFF, "never"],
    "operator-linebreak": [WARN, "after"],
    "padded-blocks": OFF,
    "quote-props": [WARN, "consistent-as-needed"],
    "quotes": [WARN, "single", {
      "avoidEscape": true,
      "allowTemplateLiterals": true
    }],
    "semi-spacing": [WARN, {"before": false, "after": true}],
    "semi": [ERROR, "always"],
    "sort-vars": OFF,
    "space-before-blocks": [WARN, "always"],
    "space-before-function-paren": [WARN, {"anonymous": "never", "named": "never"}],
    "space-in-parens": OFF,
    "space-infix-ops": [WARN, {"int32Hint": true}],
    "space-unary-ops": ERROR,
    "spaced-comment": [WARN, "always"],
    "wrap-regex": WARN,
// JSDoc Requirements
    "require-jsdoc": [
      OFF, {
        "require": {
          "FunctionDeclaration": true,
          "MethodDefinition": true,
          "ClassDeclaration": false
        }
      }
    ],
    "valid-jsdoc": [
      OFF, {
        "requireReturn": true,
        "requireReturnDescription": true,
        "requireParamDescription": true,
        "prefer": {
          "return": "returns"
        }
      }
    ]
  }
};
