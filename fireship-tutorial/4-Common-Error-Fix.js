const tick = Date.now();
const log = (v) => {
  console.log(`${v}, Elapsed: ${Date.now() - tick} ms \n`);
};

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

// Lets Race

log("🏎️  Synchronous 1");

codeBlocker().then((res) => {
  log(res);
});

log("🏃 Synchronous 2 was blocked");
