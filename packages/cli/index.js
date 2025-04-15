#! /usr/bin/env node
console.log(process.argv);
process.nextTick(() => {
  console.log("nextTick");
});
