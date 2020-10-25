const stringArray = ["cucumber", "tomato", "avocado"];
const nonStringArray = ["cucumber", 44, true];

const tick = Date.now();

const log = (outputString) => {
  console.log(`${outputString}, Elapsed: ${Date.now() - tick} ms \n`);
};

const makeAllCaps = (array) => {
  /* Fixed Async Blocking */
  return Promise.resolve().then(() => {
    const allString = array.every((word) => typeof word === "string");

    if (allString) {
      return array.map((word) => {
        /* Loop No Longer Causes Blocking */
        i = 0;
        while (i < 1000000000) {
          i++;
        }
        /* ************************************* */

        return word.toUpperCase();
      });
    } else {
      return Promise.reject(
        new Error(
          "This array contains non-string elements, cant convert To Uppercase"
        )
      );
    }
  });
};

const sortWords = (array) => {
  return Promise.resolve().then(() => {
    const allString = array.every((word) => typeof word === "string");

    if (allString) {
      return array.sort();
    } else {
      return Promise.reject(
        new Error(
          "This array contains elements which are not words, sortWords() can't sort them"
        )
      );
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
    log(`🐢 Error Occured: ${error.message}`);
  });

log("🏃 Synchronous 2 was blocked");
