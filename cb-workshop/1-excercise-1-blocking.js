const stringArray = ["cucumber", "tomato", "avocado"];
const nonStringArray = ["cucumber", 44, true];

const tick = Date.now();

const log = (outputString) => {
  console.log(`${outputString}, Elapsed: ${Date.now() - tick} ms \n`);
};

const makeAllCaps = (array) => {
  return new Promise((resolve, reject) => {
    const allString = array.every((word) => typeof word === "string");

    if (allString) {
      const capsArray = array.map((word) => {
        /*To Introduce Some Async Blocking */
        i = 0;
        while (i < 1000000000) {
          i++;
        }
        /* ******************************* */

        return word.toUpperCase();
      });
      resolve(capsArray);
    } else {
      reject("this array contains non-string elements");
    }
  });
};

const sortWords = (array) => {
  return new Promise((resolve, reject) => {
    const allString = array.every((word) => typeof word === "string");
    if (allString) {
      resolve(array.sort());
    } else {
      reject("error");
    }
  });
};

// Testing
log("🏎️  Synchronous 1");

// makeAllCaps(nonStringArray)
makeAllCaps(stringArray)
  .then((capsArray) => {
    return sortWords(capsArray);
  })
  .then((result) => {
    log(`🐢 Result: ${result}`);
  })
  .catch((error) => {
    log(`🐢 Error Occured: ${error.message}\n`);
  });

log("🏃 Synchronous 2 was blocked");
