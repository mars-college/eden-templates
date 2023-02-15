import {EdenClient} from "eden-sdk";

const eden = new EdenClient();

eden.loginApi(
  "f321be5a8f7887c7057fa45248a71e867917aaec",
  "bda594362f4a2f19b697ed74c4b3f26ac4685e3f"
);

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
    "A cat and a dog sitting on a couch, ",
  ],
  n_frames: 6,
  stream: true,
}

//let result = await eden.create("create", config);
let result = await eden.create("interpolate", config2);

console.log(result);

manna = await eden.getManna();
console.log(manna);


/* Alternatively, start the prediction asynchronously and poll for the result */

//let taskId = await eden.startTask("create", config);
//let result = await eden.getTaskStatus(taskId);
//console.log(result);