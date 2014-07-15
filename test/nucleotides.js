'use strict';

var assert = require('assert');

var _ = require('underscore');

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

var values = numbers.concat(_.map(numbers, String));

var randomInteger = _.partial(_.random, MIN_SAFE_INTEGER, MAX_SAFE_INTEGER);


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
    _.each(values.concat(Date, NaN, {}, /./, null, undefined), function(x) {
      assert.strictEqual(nucleotides.operator.unary['typeof'](x), typeof x);
    });
  });

  test('+', function() {
    _.each(values, function(x) {
      assert.strictEqual(nucleotides.operator.unary['+'](x), +x);
    });
  });

  test('-', function() {
    _.each(values, function(x) {
      assert.strictEqual(nucleotides.operator.unary['-'](x), -x);
    });
  });

  test('~', function() {
    _.each(values, function(x) {
      assert.strictEqual(nucleotides.operator.unary['~'](x), ~x);
    });
  });

  test('!', function() {
    _.each(numbers, function(x) {
      assert.strictEqual(nucleotides.operator.unary['!'](x), !x);
    });
  });

});


suite('nucleotides.operator.binary', function() {

  var splatOperands = function(test) {
    return function(operands) {
      return test(operands[0], operands[1]);
    };
  };

  var each = function(generator, test) {
    _.each(_.zip(_.times(100, function() { return generator(); }),
                 _.times(100, function() { return generator(); })),
           splatOperands(test));
  };

  test('*', function() {
    each(randomInteger, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['*'](a, b), a * b);
    });
  });

  test('/', function() {
    each(randomInteger, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['/'](a, b), a / b);
    });
  });

  test('%', function() {
    each(randomInteger, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['%'](a, b), a % b);
    });
  });

  test('+', function() {
    each(randomInteger, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['+'](a, b), a + b);
    });
  });

  test('-', function() {
    each(randomInteger, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['-'](a, b), a - b);
    });
  });

  test('<<', function() {
    each(randomInteger, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['<<'](a, b), a << b);
    });
  });

  test('>>', function() {
    each(randomInteger, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['>>'](a, b), a >> b);
    });
  });

  test('>>>', function() {
    each(randomInteger, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['>>>'](a, b), a >>> b);
    });
  });

  test('<', function() {
    each(_.partial(_.sample, values), function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['<'](a, b), a < b);
    });
  });

  test('>', function() {
    each(_.partial(_.sample, values), function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['>'](a, b), a > b);
    });
  });

  test('<=', function() {
    each(_.partial(_.sample, values), function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['<='](a, b), a <= b);
    });
  });

  test('>=', function() {
    each(_.partial(_.sample, values), function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['>='](a, b), a >= b);
    });
  });

  test('instanceof', function() {
    _.each([
      [[], Array],
      [42, Number],
      [new Number(42), Number]
    ], splatOperands(function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['instanceof'](a, b),
                         a instanceof b);
    }));
  });

  test('in', function() {
    _.each([
      ['', {}],
      ['x', {}],
      ['x', {x: 1}],
      ['x', {y: 1}],
      ['constructor', {}]
    ], splatOperands(function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['in'](a, b), a in b);
    }));
  });

  test('==', function() {
    each(_.partial(_.sample, values), function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['=='](a, b), a == b);
    });
  });

  test('!=', function() {
    each(_.partial(_.sample, values), function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['!='](a, b), a != b);
    });
  });

  test('===', function() {
    each(_.partial(_.sample, values), function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['==='](a, b), a === b);
    });
  });

  test('!==', function() {
    each(_.partial(_.sample, values), function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['!=='](a, b), a !== b);
    });
  });

  test('&', function() {
    each(randomInteger, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['&'](a, b), a & b);
    });
  });

  test('^', function() {
    each(randomInteger, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['^'](a, b), a ^ b);
    });
  });

  test('|', function() {
    each(randomInteger, function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['|'](a, b), a | b);
    });
  });

  test('&&', function() {
    each(_.partial(_.sample, numbers), function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['&&'](a, b), a && b);
    });
  });

  test('||', function() {
    each(_.partial(_.sample, numbers), function(a, b) {
      assert.strictEqual(nucleotides.operator.binary['||'](a, b), a || b);
    });
  });

});


suite('nucleotides.array', function() {

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


suite('nucleotides.date', function() {

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


suite('nucleotides.string', function() {

  test('concat', function() {
    assert.strictEqual(nucleotides.string.concat('foo', 'bar'), 'foobar');
    assert.strictEqual(nucleotides.string.concat('foo', null), 'foonull');
    assert.strictEqual(nucleotides.string.concat(null, 'bar'), 'nullbar');
    assert.strictEqual(nucleotides.string.concat(1, 2, 3, 4, 5), '12345');
    assert.strictEqual(nucleotides.string.concat([1, 2, 3], 4, 5), '1,2,345');
    assert.strictEqual(nucleotides.string.concat(), '');
  });

});
