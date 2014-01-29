# Nucleotides

Nucleotides are the building blocks of JavaScript programs. They are simple,
useful functions with well-understood semantics.

Nucleotides fix two aspects of JavaScript which hinder functional programming:
operators and methods.

### The problem with operators

In functional programming it's common to pass one function to another function.
This is possible in JavaScript because functions are values. Operators, on the
other hand, are not values so cannot be passed as arguments. The workaround is
to use anonymous functions:

```javascript
var sum = nums.reduce(function(sum, num) {
  return sum + num;
}, 0);
```

There is a nucleotide for each operator. __nucleotides.operator.binary['+']__,
in this case:

```javascript
var sum = nums.reduce(nucleotides.operator.binary['+'], 0);
```

### The problem with methods

The semantics of JavaScript methods are incompatible with most higher-order
functions. Methods must be wrapped so as to behave like regular functions:

```javascript
var tags = str.split(',').map(function(word) {
  return word.trim();
});
```

There is a nucleotide for each built-in method. __nucleotides.string.trim__,
in this case:

```javascript
var tags = str.split(',').map(nucleotides.string.trim);
```

### Nucleotides

The name of each mutator function is suffixed with `!`. This prevents
unintentional mutation, draws attention to places where mutation does
occur, and reserves the unsuffixed names for future use.

The following nucleotides are available:

```javascript
- nucleotides.operator.new
- nucleotides.operator.unary.typeof
- nucleotides.operator.unary['+']
- nucleotides.operator.unary['-']
- nucleotides.operator.unary['~']
- nucleotides.operator.unary['!']
- nucleotides.operator.binary['*']
- nucleotides.operator.binary['/']
- nucleotides.operator.binary['%']
- nucleotides.operator.binary['+']
- nucleotides.operator.binary['-']
- nucleotides.operator.binary['<<']
- nucleotides.operator.binary['>>']
- nucleotides.operator.binary['>>>']
- nucleotides.operator.binary['<']
- nucleotides.operator.binary['>']
- nucleotides.operator.binary['<=']
- nucleotides.operator.binary['>=']
- nucleotides.operator.binary.instanceof
- nucleotides.operator.binary.in
- nucleotides.operator.binary['==']
- nucleotides.operator.binary['!=']
- nucleotides.operator.binary['===']
- nucleotides.operator.binary['!==']
- nucleotides.operator.binary['&']
- nucleotides.operator.binary['^']
- nucleotides.operator.binary['|']
- nucleotides.operator.binary['&&']
- nucleotides.operator.binary['||']
- nucleotides.array.toString
- nucleotides.array.toLocaleString
- nucleotides.array.join
- nucleotides.array['pop!']
- nucleotides.array['push!']
- nucleotides.array.concat
- nucleotides.array['reverse!']
- nucleotides.array['shift!']
- nucleotides.array['unshift!']
- nucleotides.array.slice
- nucleotides.array['splice!']
- nucleotides.array['sort!']
- nucleotides.array.filter
- nucleotides.array.forEach
- nucleotides.array.some
- nucleotides.array.every
- nucleotides.array.map
- nucleotides.array.indexOf
- nucleotides.array.lastIndexOf
- nucleotides.array.reduce
- nucleotides.array.reduceRight
- nucleotides.boolean.toString
- nucleotides.boolean.valueOf
- nucleotides.date.toString
- nucleotides.date.toDateString
- nucleotides.date.toTimeString
- nucleotides.date.toLocaleString
- nucleotides.date.toLocaleDateString
- nucleotides.date.toLocaleTimeString
- nucleotides.date.valueOf
- nucleotides.date.getTime
- nucleotides.date.getFullYear
- nucleotides.date.getUTCFullYear
- nucleotides.date.getMonth
- nucleotides.date.getUTCMonth
- nucleotides.date.getDate
- nucleotides.date.getUTCDate
- nucleotides.date.getDay
- nucleotides.date.getUTCDay
- nucleotides.date.getHours
- nucleotides.date.getUTCHours
- nucleotides.date.getMinutes
- nucleotides.date.getUTCMinutes
- nucleotides.date.getSeconds
- nucleotides.date.getUTCSeconds
- nucleotides.date.getMilliseconds
- nucleotides.date.getUTCMilliseconds
- nucleotides.date.getTimezoneOffset
- nucleotides.date['setTime!']
- nucleotides.date['setMilliseconds!']
- nucleotides.date['setUTCMilliseconds!']
- nucleotides.date['setSeconds!']
- nucleotides.date['setUTCSeconds!']
- nucleotides.date['setMinutes!']
- nucleotides.date['setUTCMinutes!']
- nucleotides.date['setHours!']
- nucleotides.date['setUTCHours!']
- nucleotides.date['setDate!']
- nucleotides.date['setUTCDate!']
- nucleotides.date['setMonth!']
- nucleotides.date['setUTCMonth!']
- nucleotides.date['setFullYear!']
- nucleotides.date['setUTCFullYear!']
- nucleotides.date.toGMTString
- nucleotides.date.toUTCString
- nucleotides.date.getYear
- nucleotides.date['setYear!']
- nucleotides.date.toISOString
- nucleotides.date.toJSON
- nucleotides.function.bind
- nucleotides.function.toString
- nucleotides.function.call
- nucleotides.function.apply
- nucleotides.number.toString
- nucleotides.number.toLocaleString
- nucleotides.number.valueOf
- nucleotides.number.toFixed
- nucleotides.number.toExponential
- nucleotides.number.toPrecision
- nucleotides.object.toString
- nucleotides.object.toLocaleString
- nucleotides.object.valueOf
- nucleotides.object.hasOwnProperty
- nucleotides.object.isPrototypeOf
- nucleotides.object.propertyIsEnumerable
- nucleotides.object.__defineGetter__
- nucleotides.object.__lookupGetter__
- nucleotides.object.__defineSetter__
- nucleotides.object.__lookupSetter__
- nucleotides.regexp.exec
- nucleotides.regexp.test
- nucleotides.regexp.toString
- nucleotides.regexp.compile
- nucleotides.string.valueOf
- nucleotides.string.toString
- nucleotides.string.charAt
- nucleotides.string.charCodeAt
- nucleotides.string.concat
- nucleotides.string.indexOf
- nucleotides.string.lastIndexOf
- nucleotides.string.localeCompare
- nucleotides.string.match
- nucleotides.string.replace
- nucleotides.string.search
- nucleotides.string.slice
- nucleotides.string.split
- nucleotides.string.substring
- nucleotides.string.substr
- nucleotides.string.toLowerCase
- nucleotides.string.toLocaleLowerCase
- nucleotides.string.toUpperCase
- nucleotides.string.toLocaleUpperCase
- nucleotides.string.trim
- nucleotides.string.trimLeft
- nucleotides.string.trimRight
- nucleotides.string.link
- nucleotides.string.anchor
- nucleotides.string.fontcolor
- nucleotides.string.fontsize
- nucleotides.string.big
- nucleotides.string.blink
- nucleotides.string.bold
- nucleotides.string.fixed
- nucleotides.string.italics
- nucleotides.string.small
- nucleotides.string.strike
- nucleotides.string.sub
- nucleotides.string.sup
```

Each of the "method" functions above will be defined only if the environment
provides the method. For example, __nucleotides.string.trim__ will be defined
only if __String.prototype.trim__ is defined.
