# Event-Loop Notes

## **Concepts**

### **Event Loop Big Picture**

Basically one main thread. Async Operation (Promises, setTimeOuts etc) run on separate pool
There is a thread pool

### **Micro-Task VS Macro-Task**

> 1. **Micro Task:** They are put on the Micro Task queue. <br/> Happens At the **end of current event Loop** <br/> **Example:** Promises <br/><br/>
> 2. **Macro_Task:** They are put on the Macro Task queue. <br/> Happens At the **start of next event Loop** <br/> **Example:** setTimeOut()

### **Blocking VS Non Blocking**

A while loop runs 1 Billion times. Blocking the 2nd synchronous log() untils it's done

```javascript
const tick = Date.now();
const log = (v) => console.log(`${v}, Elapsed: ${Date.now() - tick} ms`);

const codeBlocker = () => {
  // Blocking

  let i = 0;
  while (i < 1000000000) {
    i++;
  }

  return "🐢 Blocked The Thread";
};

log("🏎️ Synchronous 1");

codeBlocker().then(log);

log("🥪 Synchronous 2");
```

And the **Winners** are

```bash
🏎️ Synchronous 1, Elapsed: 0 ms

🐢 Blocked The Thread After, Elapsed: 362 ms

🦥 Synchronous 2 Completely Blocked, Elapsed: 363 ms
```

First Attempt at a Fix.

```javascript
const codeBlocker = () => {
  // Async but still Blocking

  return new Promise((resolve, reject) => {
    let i = 0;
    while (i < 1000000000) {
      i++;
    }

    resolve("🐢 Blocked The Thread");
  });
};
```

**Still blocked** :anguished:

```bash
🏎️  Synchronous 1, Elapsed: 0 ms

🏃 Synchronous 2 was blocked, Elapsed: 362 ms

🐢 Blocked The Thread After, Elapsed: 363 ms
```

**What Happened?** <br/>

> Actual creation of the promise and the big while loop is still happening on the main thread. <br/>
> Only the resolving of the value ran off the main thread, and happens as a Micro-Task. <br/>
> So the order is correct, but there still is a huge delay due to while loop blocking on main thread.

**Solution**

We run the while loop (ie, the async or slow operation), inside of the resolved promises callback function. <br/>
By putting this code inside , it will be executed after all the synchronous code in the current Macro-Task has completed

```javascript
const codeBlocker = () => {
  // Non Blocking

  return Promise.resolve().then(() => {
    let i = 0;
    while (i < 1000000000) {
      i++;
    }

    return "🐢 Blocked Everyone";
  });
};
```

```
🏎️  Synchronous 1, Elapsed: 0 ms

🏃 Synchronous 2 was blocked, Elapsed: 3 ms

🐢 Blocked Everyone, Elapsed: 363 ms
```

3. Callback
4. Promises
5. Async Await

## Resources

1. [Fireship Video](https://youtu.be/vn3tm0quoqE)
2. [Jake Archibald Talk](https://www.youtube.com/watch?v=cCOL7MC4Pl0)
3. [Node JS Event Loop VS Browser Event Loop](https://blog.insiderattack.net/javascript-event-loop-vs-node-js-event-loop-aea2b1b85f5c)
4. [Node JS v11 Event Loop Update](https://blog.insiderattack.net/new-changes-to-timers-and-microtasks-from-node-v11-0-0-and-above-68d112743eb3)

## TODO

1. Improve this when you get time
2. Add a Good Event Loop Diagram
3. A bit more explanation of Micro VS Macro Task (Use a Table for Comparison instead)
