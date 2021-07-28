# Event-Loop Notes

## **Event Loop::Break Down**

### **Event Loop Big Picture**

Basically one main thread. Async Operation (Promises, setTimeOuts etc) run on separate pool
There is a thread pool

### Main Thread

Web Pages (and NodeJS) have a thing called the Main Thread (Also called the Application Thread) We call it the main thread because loads of stuff happens here and it is where JavaScript happens.

Technically NodeJS (and all othre JS runtime) does have a thread pool provided in Node's case by the library libuv written in C/C++(see the diagram on the NodeJS Design Pattern book). We as NodeJS devs do not have direct access ti this thread pool.

There is the notion of worker threads but we wont get into that here. This [video](https://www.youtube.com/watch?v=UCd6LorxpkY&list=PLqq-6Pq4lTTa-d0iZg41U2RDqECol9C5B&index=6) mentions it briefly. I am assumong it's similar to web-workers or service workers on the browser

It's where rendering happens. It's where the DOM lives.And this means that the bulk of your stuff on the web has a deterministic order.

We don't get multiple bits of code running at the same time, like trying to edit the same DOM and resulting in a race condition.

So what we do is this we queue a task to get back on to the main thread at some point

> **What's a Task?**
>
> MDN definition
> A task is any JavaScript code which is scheduled to be run by the standard mechanisms such as initially starting to run a program, an event callback being run, or an interval or timeout being fired. These all get scheduled on the task queue.

Defining The Web Standard for setTimeOut Method

> Run the following steps in parallel (Fancy way of saying run it on some other thread, ie off the main)
>
> 1. Wait _ms_ milliseconds
> 2. **Queue a Task\*** to run the following steps:
>    1. Invoke callback (This will now happen on the main thread again)
>
> - Queing a Task on a side thread, signals that it is now read y to return to the main thread

### Task Queue and Render-Steps

Need to use visuals for this, use Jake's video for refernce for now

This separion of Task and Render-steps means that,

> The event loop guarantees your task will complete before rendering next happens

Caveats, see the visuals

timeout code is not render blocking

The main Thread can complete multiple Task queue cycles/tasks before it goes to the render steps

### The Queues

1. Task Queue
2. Animation Callback Queue
3. Micro Task Queue

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
By putting this code inside , it will be executed after all the synchronous code in the current (Macro)Task has completed
In other words by using

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

```bash
🏎️  Synchronous 1, Elapsed: 0 ms

🏃 Synchronous 2 was blocked, Elapsed: 3 ms

🐢 Blocked Everyone, Elapsed: 363 ms
```

## Resources

1. [Jake Archibald: In The Loop](https://youtu.be/cCOL7MC4Pl0): The best break down of the event loop (JSConf.Asia 2018, google guy). Also lot of good explanation on how animations work on the browser.
2. [Fireship Video](https://youtu.be/vn3tm0quoqE)
3. [Callbacks](https://youtu.be/ueOG5uk7zo8)
4. [Node JS Event Loop VS Browser Event Loop](https://blog.insiderattack.net/javascript-event-loop-vs-node-js-event-loop-aea2b1b85f5c)
5. [Node JS v11 Event Loop Update](https://blog.insiderattack.net/new-changes-to-timers-and-microtasks-from-node-v11-0-0-and-above-68d112743eb3)
6. [When & When Not to use Nodejs due to it's Single Threaded Nature](https://www.youtube.com/watch?v=UCd6LorxpkY&list=PLqq-6Pq4lTTa-d0iZg41U2RDqECol9C5B&index=6)

## TODO

1. Improve this when you get time
2. Add a Good Event Loop Diagram
3. A bit more explanation of Micro VS Macro Task (Use a Table for Comparison instead)
4. **Learn more about using requestAnimationFrame(), Jake uses it in his video**
5. **Code out some of the stuff that is on the Jake's talk**
6. Do watch the vieo again when you decide to put visuals in
