import './memoize'

// Example synchronous function with an object as an argument
function multiply(a: number, obj: { multiplier: number }): number {
  console.log(`Calculating of ${a} and ${obj.multiplier}`);
  return a * obj.multiplier;
}

// Example asynchronous function with an object as an argument
async function asyncMultiply(a: number, obj: { multiplier: number }): Promise<number> {
  console.log(`Calculating of ${a} and ${obj.multiplier}`);
  return new Promise(resolve => setTimeout(() => resolve(a * obj.multiplier), 1000));
}

async function test() {
  console.log(multiply.memoize()(2, { multiplier: 3 })); // calculates for 2 and { multiplier: 3 } and stores the result
  console.log(multiply.memoize()(2, { multiplier: 3 })); // uses the stored result for 2 and { multiplier: 3 }

  console.log(await asyncMultiply.memoizeAsync()(3, { multiplier: 3 })); // calculates for 2 and { multiplier: 3 } and stores the result (after 1 second)
  console.log(await asyncMultiply.memoizeAsync()(3, { multiplier: 3 })); // uses the stored result for 3 and { multiplier: 3 }
}

test();
