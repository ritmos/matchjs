# Overview
PatMatJS is a Javascript Pattern matching utility developed in typescript that can be used standalone in the browser, in node or as ES module.


### Installation
- Install it with `npm install --save patmatjs` or reference it from CDN in the browser

### Usage

#### In the browser

- Add a script tag `<script src="https://unpkg.com/patmatjs@3.0.0/dist/browser/index.js" type="application/javascript"></script>`
- And later on, use the global `match` function
```javascript
 const financialStatus = match(42)
    .caseGreaterEqualThan(1000000, "I'm rich!")
    .caseLessThan(0, "I'm ruined")
    .default("I keep trying");
 console.log(financialStatus); // outputs I keep trying
```

#### In Node

```javascript
const {match} = require("patmatjs");

const isEven = match(2)
    .case(n => n % 2 === 0, true)
    .default(false);
 console.log(isEven); // outputs true
```

#### as ES Module

```javascript
import {match} from "patmatjs";

const areWeInTheFuture = match(new Date())
    .caseNewerThan(new Date(2050, 0, 1), true)
    .default(false);
 console.log(areWeInTheFuture); // outputs false
```

### API

If you are using typescript or an IDE with autocompletion, just write match. and explore all the options available.
Basically you have cases for every javascript primitive type + instance checks. Almost every case method has a companion
method ended in "If"; This allows to put an extra predicate if the case is not enough. To end the match expression use
default method.

### Advanced Usage

#### Instance check example

```typescript
import {match} from "patmatjs";

class FatalError {
    constructor(readonly id: string, readonly date: Date) {}
}

class Warning {
    constructor(readonly title: string, readonly message: string) {}
}

class MailMessage {
    constructor(readonly sender: string, readonly subject: string, readonly message: string) {}
}

type Whatever =
    FatalError |
    Warning |
    MailMessage;

const info = getInfo(); // returns type Whatever

const infoDetails = match(info)
    .caseInstanceIf(FatalError, e => e.id === 404 => `No content found at ${e.date.toISOString()}`)
    .caseInstance(FatalError, e => `Error #${e.id} received`)
    .caseInstance(Warning, w => `Warning ${w.title}: ${w.message}`)
    .caseInstance(MailMessage, m => `You received a message from ${m.sender}`)
    .default("Unknown information received");
```

#### Float comparison

```typescript
import {match} from "patmatjs";

const a = 0.2;
const b = 0.4;
const c = 0.6;
const whatHappens = match(a+b)
    .caseEqual(c, "This number is 0.6")
    .caseAlmostEqual(c, "The number is not exactly 0.6, but it is very close") // <-- this will match
    .default("This number is not 0.6 at all");
```

#### Custom test that fails

```javascript
import {match} from "patmatjs";

function isSomething(x) {
    throw "Error!"; // <-- look at this
}

const value = match(x)
    .case(isSomething, "This is something") // <-- custom tests doesn't raise exceptions, they simple return false
    .default("This is nothing");
```

#### Set multiple return type (for typescript)

```typescript
import {match} from "patmatjs";

const twice = match("hello world")
    .withReturnType<number|string>()
    .caseString(s => `${s}${s}`)
    .caseNumber(n => n*2)
    .default(0);
```