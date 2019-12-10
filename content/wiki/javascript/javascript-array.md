---
title: "Javascript array"
date: "2019-12-06 15:53:29 +0900"
template: "wiki"
draft: false
slug: "/wiki/javascript-array"
category: ""
tags:
---

### Array.from()

```javascript
// Using an arrow function as the map function to
// manipulate the elements
Array.from([1, 2, 3], x => x + x);
// [2, 4, 6]

// Generate a sequence of numbers
// Since the array is initialized with `undefined` on each position,
// the value of `v` below will be `undefined`
Array.from({length: 5}, (v, i) => i);
// [0, 1, 2, 3, 4]
```

<https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/from#Einsatz_von_Arrow-Funktionen_und_Array.from>

### Array.includes()

- Array.indexOf(), Array.includes() 는 값이 아닌 참조로 비교하기 때문에 Array 안에 Object를 찾을 수 없다.

```javascript
[{a: 1}, {a: 2}].includes({a: 1});
// false, because {a: 1} is a new object
```

### Array.prototype.join()

- 배열의 모든 요소를 연결해 하나의 문자열로 만들어준다.
- () 안의 구분자로 연결한다. 기본은 ',' 쉼표로 연결한다.

```javascript
var elements = ['Fire', 'Air', 'Water'];

console.log(elements.join());
// expected output: "Fire,Air,Water"

console.log(elements.join(''));
// expected output: "FireAirWater"

console.log(elements.join('-'));
// expected output: "Fire-Air-Water"
```
