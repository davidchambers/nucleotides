void function() {

  'use strict';

  var env = typeof module !== 'undefined' ? 'node' : 'browser';
  var _ = env === 'node' ? require('underscore') : window._;

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

  var getPrototypeProperty = function(ctor, name) {
    return ctor.prototype[name];
  };

  var isMutator = _.partial(_.contains, [].concat(
    _.chain(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'])
      .map(_.partial(getPrototypeProperty, Array))
      .value(),
    _.chain(Object.getOwnPropertyNames(Date.prototype))
      .filter(RegExp.prototype.test.bind(/^set[A-Z]/))
      .map(_.partial(getPrototypeProperty, Date))
      .value()
  ));

  var nucleotides = _.extend({
    operator: {
      // 11.2.2 The new Operator
      new: function(ctor) {
        return new (_.bind.apply(_, [ctor, null].concat(_.rest(arguments))))();
      },
      unary: _.object(operator.unary, _.map(operator.unary, function(op) {
        return new Function('a', 'return ' + op + ' a');
      })),
      binary: _.object(operator.binary, _.map(operator.binary, function(op) {
        return new Function('a', 'b', 'return a ' + op + ' b');
      }))
    }
  },
  _.object(
    _.invoke(_.pluck(constructors, 'name'), 'toLowerCase'),
    _.map(constructors, function(ctor) {
      return _.chain(Object.getOwnPropertyNames(ctor.prototype))
        .map(_.partial(getPrototypeProperty, ctor))
        .filter(_.isFunction)
        .reject(_.partial(_.contains, constructors))
        .map(function(method) {
          // Suffix the name of each mutator function with "!".
          // This prevents unintentional mutation, draws attention
          // to places where mutation does occur, and reserves the
          // unsuffixed names for future use.
          return [
            isMutator(method) ? method.name + '!' : method.name,
            method.name === 'concat' ?
              _.bind(method, new ctor) :
              _.bind(Function.prototype.call, method)
          ];
        })
        .object()
        .value();
    })
  ));

  if (env === 'node') {
    module.exports = nucleotides;
  } else {
    window.nucleotides = nucleotides;
  }

}();
