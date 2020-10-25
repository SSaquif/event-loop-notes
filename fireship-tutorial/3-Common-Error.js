const tick = Date.now();
const log = (v) => {
  console.log(`${v}, Elapsed: ${Date.now() - tick} ms \n`);
};

const codeBlocker = () => {
  // Async Blocking

  return new Promise((resolve, reject) => {
    let i = 0;
    while (i < 1000000000) {
      i++;
    }

    resolve("🐢 Blocked The Thread");
  });
};

// Lets Race

log("🏎️  Synchronous 1");

codeBlocker().then((res) => {
  log(res);
});

log("🏃 Synchronous 2 was blocked");

// What Happened
// Actual creation of the promise and the big while loop is still happening on the main thread
// Only the resolve part ran off the main thread
