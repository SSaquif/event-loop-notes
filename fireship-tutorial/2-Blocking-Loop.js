const tick = Date.now();
const log = (v) => console.log(`${v}, Elapsed: ${Date.now() - tick} ms \n`);

const codeBlocker = () => {
  // Blocking

  let i = 0;
  while (i < 1000000000) {
    i++;
  }

  return "🐢 Blocked The Thread";
};

log("🏎️ Synchronous 1");

log(codeBlocker());

log("🦥 Synchronous 2 Completely Blocked");
