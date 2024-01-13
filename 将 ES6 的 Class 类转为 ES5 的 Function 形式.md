#### 请将下例中 ES6 的 Class 类转为 ES5 的 Function 形式：

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }

  say() {
    console.log("Hello world!");
  }
}

var p = new Person("zhangsan");

console.log(Object.keys(p)); // => 输出 ['name']

Person("zhangsan"); // => Uncaught TypeError: Class constructor Person cannot be invoked without 'new'

new Person.prototype.say(); // => Uncaught TypeError: Person.prototype.say is not a constructor
```

#### 转为 ES5 的 Function 形式后为：

```javascript
"use strict"; // 使用严格模式

function Person(name) {
  // 构造函数仅支持使用 new 关键字调用
  if (!new.target) {
      throw new TypeError(`Class constructor Person cannot be invoked without 'new'`);
  }
  
  this.name = name;
}

Person.prototype.say = function() {
  console.log("Hello world!");  
};

Object.defineProperty(Person.prototype, "say", {
  // 不能使用 new 调用
  value: function() {
    if (new.target) {
      throw new TypeError(`Person.prototype.say is not a constructor`);
    }
  },
  // 原型链上的方法不能被枚举
  enumerable: false
});

var p = new Person("zhangsan");

console.log(Object.keys(p)); // => 输出 ['name']

Person("zhangsan"); // => Uncaught TypeError: Class constructor Person cannot be invoked without 'new'

new Person.prototype.say(); // => Uncaught TypeError: Person.prototype.say is not a constructor
```