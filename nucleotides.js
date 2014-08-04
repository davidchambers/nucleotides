void function() {

  'use strict';

  var env = typeof module !== 'undefined' ? 'node' : 'browser';
  var R = env === 'node' ? require('ramda') : window.ramda;

  var operator = {
    unary: [
      // 11.4 Unary Operators
      'typeof', '+', '-', '~', '!'
    ],
    binary: [
      // 11.5 Multiplicative Operators
      '*', '/', '%',
      // 11.6 Additive Operators
      '+', '-',
      // 11.7 Bitwise Shift Operators
      '<<', '>>', '>>>',
      // 11.8 Relational Operators
      '<', '>', '<=', '>=', 'instanceof', 'in',
      // 11.9 Equality Operators
      '==', '!=', '===', '!==',
      // 11.10 Binary Bitwise Operators
      '&', '^', '|',
      // 11.11 Binary Logical Operators
      '&&', '||'
    ]
  };

  var constructors = [
    Array, Boolean, Date, Function, Number, Object, RegExp, String
  ];

  var getPrototypeProperty = R.curry(function(ctor, name) {
    return ctor.prototype[name];
  });

  var isMutator = R.rPartial(R.contains, R.concat(
    R.map(getPrototypeProperty(Array),
          ['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift']),
    R.map(getPrototypeProperty(Date),
          R.filter(RegExp.prototype.test.bind(/^set[A-Z]/),
                   Object.getOwnPropertyNames(Date.prototype)))
  ));

  var nucleotides = R.mixin({
    operator: {
      // 11.2.2 The new Operator
      new: function(ctor) {
        return new (Function.prototype.bind.apply(ctor, arguments))();
      },
      unary: R.fromPairs(R.map(function(op) {
        return [op, new Function('a', 'return ' + op + ' a')];
      }, operator.unary)),
      binary: R.fromPairs(R.map(function(op) {
        return [op, new Function('a', 'b', 'return a ' + op + ' b')];
      }, operator.binary))
    }
  },
  R.fromPairs(R.map(function(ctor) {
    return [
      ctor.name.toLowerCase(),
      R.pipe(
        R.prop('prototype'),
        Object.getOwnPropertyNames,
        R.map(getPrototypeProperty(ctor)),
        R.filter(function(x) {
          return Object.prototype.toString.call(x) === '[object Function]';
        }),
        R.reject(R.rPartial(R.contains, constructors)),
        R.map(function(method) {
          // Suffix the name of each mutator function with "!".
          // This prevents unintentional mutation, draws attention
          // to places where mutation does occur, and reserves the
          // unsuffixed names for future use.
          return [
            isMutator(method) ? method.name + '!' : method.name,
            method.name === 'concat' ? method.bind(new ctor)
                                     : Function.prototype.call.bind(method)
          ];
        }),
        R.fromPairs
      )(ctor)
    ];
  }, constructors)));

  if (env === 'node') {
    module.exports = nucleotides;
  } else {
    window.nucleotides = nucleotides;
  }

}();
