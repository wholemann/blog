---
title: "Javasciprt basic"
date: "2019-12-06 15:53:18 +0900"
template: "wiki"
draft: false
slug: "/wiki/javascript-basic"
category: ""
tags:
---

### EventListener

resize 이벤트가 발생했을 때 함수가 작동하길 원한다면 addEventListener 인자에 handleResize()가 아닌 handleResize로 넣어줘야 한다.

```javascript
function handleResize() {
    console.log("I have been resized");
}

window.addEventListener("resize", handleResize);
```

모든 Event Name

<https://developer.mozilla.org/en-US/docs/Web/Events>

### Different result types of `+` by operand types

```markdown
            || undefined | null   | boolean | number | string | object |
=========================================================================
 undefined  || number    | number | number  | number | string | string |
 null       || number    | number | number  | number | string | string |
 boolean    || number    | number | number  | number | string | string |
 number     || number    | number | number  | number | string | string |
 string     || string    | string | string  | string | string | string |
 object     || string    | string | string  | string | string | string |
 ```

- applies to Chrome13, FF6, Opera11 and IE9. Checking other browsers and versions is left as an exercise for the reader.

<https://stackoverflow.com/a/7124907>

### Spread Operator

- object를 merge할 때 키가 중복시 마지막 Object의 값으로 덮어버린다.

```javascript
const person1 = { name: 'David Walsh', age: 33 };
const person2 = { name: 'David Walsh Jr.', role: 'kid' };

const merged = {...person1, ...person2}
/*
Object {
  "name": "David Walsh Jr.",
  "age": 33,
  "role": "kid",
}
*/
```
