//dummy random output start
const example = {
  1: "Lorem Ipsum is simply",
  2: "Contrary to popular belief",
  3: "comes from a line in",
  4: "The Extremes of Good and Evil",
  5: "dolor sit amet..",
  6: "or non-characteristic",
  7: "of a page",
  8: "PageMaker including",
  9: "I must explain",
  10: "On the other hand,"
};

function randomText(obj) {
  const objkeys = Object.keys(obj);
  return objkeys[Math.floor(Math.random() * objkeys.length)];
}

export function callMLDataSetAPI(event) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(example[randomText(example)]);
    }, getRandomArbitrary(200, 800))
  );
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
