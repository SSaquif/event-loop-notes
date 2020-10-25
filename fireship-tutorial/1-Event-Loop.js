console.log("🥇 Synchronous 1 ");

setTimeout(() => {
  console.log("🐢 Timeout 2");
}, 0);

Promise.resolve().then(() => {
  console.log("🥉 Promise 3");
});

console.log("🥈 Synchronous 2 ");

// The 2 console log goes first in order
// Promise = Micro-Task Goest 3rd (It Happens at the end of current event loop)
// Settimeout = Macro-Task (🐢 Last, It Happens at the start of next event loop)
