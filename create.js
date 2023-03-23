import {EdenClient} from "eden-sdk";

const eden = new EdenClient();
eden.loginApi(
  "afb9da36e8b2e9143afd6479b0c43b033bf2f17fa4bf9a48",	"2c6cb1042e90fed840a5f3a4d7b88ba233a8be6a7e9e5817"
)
let manna = await eden.getManna();
console.log(manna);

let config = {
  text_input: "An astronaut on the moon riding a horse, cartoon 1920s",
  width: 768,
  height: 512
}

let config2 = {
  interpolation_texts: [
    "An astronaut on the moon riding a horse, cartoon 1920s",
    "A cat and a dog sitting on a couch"
  ],
  n_frames: 6,
  stream: true,
}

// let result = await eden.create("create", config2);
let result = await eden.create("interpolate", config2);

console.log(result);

manna = await eden.getManna();
console.log(manna);


/* Alternatively, start the prediction asynchronously and poll for the result */

//let taskId = await eden.startTask("create", config);
//let result = await eden.getTaskStatus(taskId);
//console.log(result);