'use strict';

var assert = require('assert');

var R = require('ramda');

var nucleotides = require('..');


var MAX_SAFE_INTEGER = 0x20000000000000 - 1;  // 2^53-1
var MIN_SAFE_INTEGER = -0x20000000000000 + 1;  // -2^53+1

var numbers = [
  -Infinity,
  Number.MIN_VALUE,
  MIN_SAFE_INTEGER,
  -Math.PI,
  -0,
  0,
  Math.PI,
  MAX_SAFE_INTEGER,
  Number.MAX_VALUE,
  Infinity
];

var values = numbers.concat(R.map(String, numbers));

var random = function(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
};

var randomInteger = function() {
  return random(MIN_SAFE_INTEGER, MAX_SAFE_INTEGER);
};

var randomValue = function() {
  return values[random(0, values.length - 1)];
};


suite('nucleotides.operator.new', function() {

  test('new', function() {
    var obj = nucleotides.operator.new(String, 'foo');
    assert(obj instanceof String);
    assert.strictEqual(obj.valueOf(), 'foo');

    var date = nucleotides.operator.new(Date, 2001, 0, 1);
    assert(date instanceof Date);
    assert.strictEqual(date.valueOf(), new Date(2001, 0, 1).valueOf());
  });

});


suite('nucleotides.operator.unary', function() {

  test('typeof', function() {
    assert.strictEqual(nucleotides.operator.unary['typeof'].length, 1);
    R.forEach(function(x) {
      assert.strictEqual(nucleotides.operator.unary['typeof'](x), typeof x);
    }, values.concat(Date, NaN, {}, /./, null, undefined));
  });

  test('+', function() {
    assert.strictEqual(nucleotides.operator.unary['+'].length, 1);
    R.forEach(function(x) {
      assert.strictEqual(nucleotides.operator.unary['+'](x), +x);
    }, values);
  });

  test('-', function() {
    assert.strictEqual(nucleotides.operator.unary['-'].length, 1);
    R.forEach(function(x) {
      assert.strictEqual(nucleotides.operator.unary['-'](x), -x);
    }, values);
  });

  test('~', function() {
    assert.strictEqual(nucleotides.operator.unary['~'].length, 1);
    R.forEach(function(x) {
      assert.strictEqual(nucleotides.operator.unary['~'](x), ~x);
    }, values);
  });

  test('!', function() {
    assert.strictEqual(nucleotides.operator.unary['!'].length, 1);
    R.forEach(function(x) {
      assert.strictEqual(nucleotides.operator.unary['!'](x), !x);
    }, values);
  });

});


suite('nucleotides.operator.binary', function() {

  var splatOperands = R.curry(function(test, operands) {
    return test(operands[0], operands[1]);
  });

  var each = function(generator, test) {
    R.forEach(splatOperands(test),
              R.zip(R.times(R.nAry(0, generator), 100),
                    R.times(R.nAry(0, generator), 100)));
  };

  test('*', function() {
    assert.strictEqual(nucleotides.operator.binary['*'].length, 2);
    each(randomInteger, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['*'](a, b), a * b);
    });
  });

  test('/', function() {
    assert.strictEqual(nucleotides.operator.binary['/'].length, 2);
    each(randomInteger, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['/'](a, b), a / b);
    });
  });

  test('%', function() {
    assert.strictEqual(nucleotides.operator.binary['%'].length, 2);
    each(randomInteger, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['%'](a, b), a % b);
    });
  });

  test('+', function() {
    assert.strictEqual(nucleotides.operator.binary['+'].length, 2);
    each(randomInteger, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['+'](a, b), a + b);
    });
  });

  test('-', function() {
    assert.strictEqual(nucleotides.operator.binary['-'].length, 2);
    each(randomInteger, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['-'](a, b), a - b);
    });
  });

  test('<<', function() {
    assert.strictEqual(nucleotides.operator.binary['<<'].length, 2);
    each(randomInteger, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['<<'](a, b), a << b);
    });
  });

  test('>>', function() {
    assert.strictEqual(nucleotides.operator.binary['>>'].length, 2);
    each(randomInteger, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['>>'](a, b), a >> b);
    });
  });

  test('>>>', function() {
    assert.strictEqual(nucleotides.operator.binary['>>>'].length, 2);
    each(randomInteger, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['>>>'](a, b), a >>> b);
    });
  });

  test('<', function() {
    assert.strictEqual(nucleotides.operator.binary['<'].length, 2);
    each(randomValue, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['<'](a, b), a < b);
    });
  });

  test('>', function() {
    assert.strictEqual(nucleotides.operator.binary['>'].length, 2);
    each(randomValue, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['>'](a, b), a > b);
    });
  });

  test('<=', function() {
    assert.strictEqual(nucleotides.operator.binary['<='].length, 2);
    each(randomValue, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['<='](a, b), a <= b);
    });
  });

  test('>=', function() {
    assert.strictEqual(nucleotides.operator.binary['>='].length, 2);
    each(randomValue, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['>='](a, b), a >= b);
    });
  });

  test('instanceof', function() {
    assert.strictEqual(nucleotides.operator.binary['instanceof'].length, 2);
    R.forEach(splatOperands(function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['instanceof'](a, b),
                         a instanceof b);
    }), [
      [[], Array],
      [42, Number],
      [new Number(42), Number]
    ]);
  });

  test('in', function() {
    assert.strictEqual(nucleotides.operator.binary['in'].length, 2);
    R.forEach(splatOperands(function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['in'](a, b), a in b);
    }), [
      ['', {}],
      ['x', {}],
      ['x', {x: 1}],
      ['x', {y: 1}],
      ['constructor', {}]
    ]);
  });

  test('==', function() {
    assert.strictEqual(nucleotides.operator.binary['=='].length, 2);
    each(randomValue, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['=='](a, b), a == b);
    });
  });

  test('!=', function() {
    assert.strictEqual(nucleotides.operator.binary['!='].length, 2);
    each(randomValue, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['!='](a, b), a != b);
    });
  });

  test('===', function() {
    assert.strictEqual(nucleotides.operator.binary['==='].length, 2);
    each(randomValue, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['==='](a, b), a === b);
    });
  });

  test('!==', function() {
    assert.strictEqual(nucleotides.operator.binary['!=='].length, 2);
    each(randomValue, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['!=='](a, b), a !== b);
    });
  });

  test('&', function() {
    assert.strictEqual(nucleotides.operator.binary['&'].length, 2);
    each(randomInteger, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['&'](a, b), a & b);
    });
  });

  test('^', function() {
    assert.strictEqual(nucleotides.operator.binary['^'].length, 2);
    each(randomInteger, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['^'](a, b), a ^ b);
    });
  });

  test('|', function() {
    assert.strictEqual(nucleotides.operator.binary['|'].length, 2);
    each(randomInteger, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['|'](a, b), a | b);
    });
  });

  test('&&', function() {
    assert.strictEqual(nucleotides.operator.binary['&&'].length, 2);
    each(randomValue, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['&&'](a, b), a && b);
    });
  });

  test('||', function() {
    assert.strictEqual(nucleotides.operator.binary['||'].length, 2);
    each(randomValue, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['||'](a, b), a || b);
    });
  });

});


suite('nucleotides.array', function() {

  test('arity', function() {
    R.forEach(function(name) {
      assert.strictEqual(nucleotides.array[name].length,
                         Array.prototype[name.replace(/!$/, '')].length + 1);
    }, R.keys(nucleotides.array));
  });

  test('mutator methods', function() {
    var a = [1, 2, 3];
    assert.strictEqual(nucleotides.array['pop!'](a), 3);
    assert.deepEqual(a, [1, 2]);

    a = [1, 2, 3];
    assert.strictEqual(nucleotides.array['push!'](a, 8, 9), 5);
    assert.deepEqual(a, [1, 2, 3, 8, 9]);

    a = [1, 2, 3];
    assert.strictEqual(nucleotides.array['reverse!'](a), a);
    assert.deepEqual(a, [3, 2, 1]);

    a = [1, 2, 3];
    assert.strictEqual(nucleotides.array['shift!'](a), 1);
    assert.deepEqual(a, [2, 3]);

    a = [2, 3, 1];
    assert.strictEqual(nucleotides.array['sort!'](a), a);
    assert.deepEqual(a, [1, 2, 3]);

    a = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    assert.deepEqual(nucleotides.array['splice!'](a, 3, 3, 0, 0), [4, 5, 6]);
    assert.deepEqual(a, [1, 2, 3, 0, 0, 7, 8, 9]);

    a = [1, 2, 3];
    assert.strictEqual(nucleotides.array['unshift!'](a, -1, 0), 5);
    assert.deepEqual(a, [-1, 0, 1, 2, 3]);
  });

  test('accessor methods', function() {
    assert.strictEqual(nucleotides.array.join(['a', 'b', 'c']), 'a,b,c');
    assert.strictEqual(nucleotides.array.join(['a', 'b', 'c'], ':'), 'a:b:c');
  });

  test('iteration methods', function() {
    assert.deepEqual(nucleotides.array.filter([-1, 0, 1], Boolean), [-1, 1]);
  });

  test('concat', function() {
    assert.deepEqual(nucleotides.array.concat([1], [2], 3), [1, 2, 3]);
    assert.deepEqual(nucleotides.array.concat([1], [2, [3]]), [1, 2, [3]]);
    assert.deepEqual(nucleotides.array.concat(['foo'], null), ['foo', null]);
    assert.deepEqual(nucleotides.array.concat(null, ['bar']), [null, 'bar']);
    assert.deepEqual(nucleotides.array.concat('foo', 'bar'), ['foo', 'bar']);
    assert.deepEqual(nucleotides.array.concat(), []);
  });

});


suite('nucleotides.boolean', function() {

  test('arity', function() {
    R.forEach(function(name) {
      assert.strictEqual(nucleotides.boolean[name].length,
                         Boolean.prototype[name].length + 1);
    }, R.keys(nucleotides.boolean));
  });

});


suite('nucleotides.date', function() {

  test('arity', function() {
    R.forEach(function(name) {
      assert.strictEqual(nucleotides.date[name].length,
                         Date.prototype[name.replace(/!$/, '')].length + 1);
    }, R.keys(nucleotides.date));
  });

  test('mutator methods', function() {
    var d = new Date(2010, 10, 12);
    var e = new Date(2011, 10, 12);
    assert.strictEqual(nucleotides.date['setFullYear!'](d, 2011), e.valueOf());
    assert.strictEqual(d.valueOf(), e.valueOf());

    d = new Date(2010, 10, 12);
    e = new Date(2010, 11, 13);
    assert.strictEqual(nucleotides.date['setMonth!'](d, 11, 13), e.valueOf());
    assert.strictEqual(d.valueOf(), e.valueOf());

    d = new Date(2010, 10, 12);
    e = new Date(2010, 10, 13);
    assert.strictEqual(nucleotides.date['setDate!'](d, 13), e.valueOf());
    assert.strictEqual(d.valueOf(), e.valueOf());
  });

});


suite('nucleotides.function', function() {

  test('arity', function() {
    R.forEach(function(name) {
      assert.strictEqual(nucleotides.function[name].length,
                         Function.prototype[name].length + 1);
    }, R.keys(nucleotides.function));
  });

});


suite('nucleotides.number', function() {

  test('arity', function() {
    R.forEach(function(name) {
      assert.strictEqual(nucleotides.number[name].length,
                         Number.prototype[name].length + 1);
    }, R.keys(nucleotides.number));
  });

});


suite('nucleotides.object', function() {

  test('arity', function() {
    R.forEach(function(name) {
      assert.strictEqual(nucleotides.object[name].length,
                         Object.prototype[name].length + 1);
    }, R.keys(nucleotides.object));
  });

});


suite('nucleotides.regexp', function() {

  test('arity', function() {
    R.forEach(function(name) {
      assert.strictEqual(nucleotides.regexp[name].length,
                         RegExp.prototype[name].length + 1);
    }, R.keys(nucleotides.regexp));
  });

});


suite('nucleotides.string', function() {

  test('arity', function() {
    R.forEach(function(name) {
      assert.strictEqual(nucleotides.string[name].length,
                         String.prototype[name].length + 1);
    }, R.keys(nucleotides.string));
  });

  test('concat', function() {
    assert.strictEqual(nucleotides.string.concat('foo', 'bar'), 'foobar');
    assert.strictEqual(nucleotides.string.concat('foo', null), 'foonull');
    assert.strictEqual(nucleotides.string.concat(null, 'bar'), 'nullbar');
    assert.strictEqual(nucleotides.string.concat(1, 2, 3, 4, 5), '12345');
    assert.strictEqual(nucleotides.string.concat([1, 2, 3], 4, 5), '1,2,345');
    assert.strictEqual(nucleotides.string.concat(), '');
  });

});
