import {EdenClient} from "eden-sdk";

import dotenv from 'dotenv';

dotenv.config()

const eden = new EdenClient();
eden.loginApi(process.env.EDEN_API_KEY, process.env.EDEN_API_SECRET);

// all the settings here

const prompt = "Once upon a time,"

const face_url_options1 = [
  'https://cdn.discordapp.com/attachments/658622951616282625/1074541703958102096/frame_0.0000000000000000.jpg',
  'https://cdn.discordapp.com/attachments/658622951616282625/1074541705254150235/hyper_detailed_comic_illustration_of_a_b_7_dreamlike-art_dreamlike-photoreal-2.0_0_0_noinit.jpg',
  'https://cdn.discordapp.com/attachments/658622951616282625/1074541704927006791/gene_the_logician_pride_unique_pers_23_dreamlike-art_dreamlike-photoreal-2.0_0_0_noinit.jpg',
  'https://cdn.discordapp.com/attachments/658622951616282625/1074541704532729956/stunning_masterpiece_portrait_of_gene__1676249072_dreamlike-art_dreamlike-photoreal-2.0_final_lora.safetensors_0_0.jpg'
]

const freeman = await eden.uploadFile("/Users/genekogan/Pictures/Screenshots/freeman.png");
const face_url_options = [
  freeman.url
]

const voice_cloning_files = [
  "assets/audio/freeman/1.wav",
  "assets/audio/freeman/2.wav",
  "assets/audio/freeman/3.wav",
  "assets/audio/freeman/4.wav",
  "assets/audio/freeman/5.wav",
  "assets/audio/freeman/6.wav"
]

//1) generate the text with a GPT-3 completion
// let result1 = await eden.create("complete", {
//   prompt: prompt,
//   max_tokens: 75
// });
// console.log(result1);
let completion = "This is a test" //await fetch(result1.uri).then(response => response.text());

// 2) speak the completion with a TTS model on a cloned voice
// const voice_file_urls = await eden.uploadFiles(voice_cloning_files);
// let result2 = await eden.create("tts", {
//   text: completion,
//   voice: "clone",
//   voice_file_urls: voice_file_urls,
//   preset: "standard",
// // });

// // console.log(result2);

// // 3) generate a lip-synced video from the speech and face
// //const face_url = face_url_options[Math.floor(Math.random() * face_url_options.length)];

// const face_url = await eden.uploadFile("/Users/genekogan/Downloads/0_VIDEO/portrait of <person1><person2> made of p_858_013_1676685869_0.jpg");

// let result3 = await eden.create("wav2lip", {
//   speech_url: "https://minio.aws.abraham.fun/creations-stg/bc94e066e710ad06e6956cfa07245dc548cbda71dc91c24df5c08fc9f9cbb117.wav",
//   face_url: face_url.url,
//   gfpgan: true,
//   gfpgan_upscale: 2.0
// });

// // final result here
// console.log(result3.uri);



// const face_url4 = await eden.uploadFile("/Users/genekogan/Downloads/0_VIDEO/videos/freeman/stunning masterpiece portrait of <person_606_013_1676685615_0.jpg");

// let result4 = await eden.create("wav2lip", {
//   speech_url: "https://minio.aws.abraham.fun/creations-stg/bc94e066e710ad06e6956cfa07245dc548cbda71dc91c24df5c08fc9f9cbb117.wav",
//   face_url: face_url4.url,
//   gfpgan: true,
//   gfpgan_upscale: 2.0
// });

// // final result here
// console.log(result4.uri);


// const face_url5 = await eden.uploadFile("/Users/genekogan/Downloads/lora/cutups_marzipan_train_00_d810e9_final_lora/portrait of <person1><person2>, portrait_855_003_1676702876_0.jpg");

// let result5 = await eden.create("wav2lip", {
//   speech_url: "https://minio.aws.abraham.fun/creations-stg/bc94e066e710ad06e6956cfa07245dc548cbda71dc91c24df5c08fc9f9cbb117.wav",
//   face_url: face_url5.url,
//   gfpgan: true,
//   gfpgan_upscale: 2.0
// });

// // final result here
// console.log(result5.uri);


// const face_url6 = await eden.uploadFile("/Users/genekogan/Downloads/lora/cutups_delic_train_00_34c2f7_final_lora/<person1><person2> in portrait of wearin_921_004_1676699938_0.jpg");

// let result6 = await eden.create("wav2lip", {
//   speech_url: "https://minio.aws.abraham.fun/creations-stg/bc94e066e710ad06e6956cfa07245dc548cbda71dc91c24df5c08fc9f9cbb117.wav",
//   face_url: face_url6.url,
//   gfpgan: true,
//   gfpgan_upscale: 2.0
// });

// // final result here
// console.log(result6.uri);




const face_url7 = await eden.uploadFile("/Users/genekogan/eden/eden-templates/assets/lora/vanessa/2.jpg");

let result7 = await eden.create("wav2lip", {
  speech_url: "https://minio.aws.abraham.fun/creations-stg/bc94e066e710ad06e6956cfa07245dc548cbda71dc91c24df5c08fc9f9cbb117.wav",
  face_url: face_url7.url,
  gfpgan: true,
  gfpgan_upscale: 2.0
});

// final result here
console.log(result7.uri);




const face_url8 = await eden.uploadFile("/Users/genekogan/Downloads/gene_loras/russian war propaganda poster of <person_20_020_1676585695_0.jpg");

let result8 = await eden.create("wav2lip", {
  speech_url: "https://minio.aws.abraham.fun/creations-stg/bc94e066e710ad06e6956cfa07245dc548cbda71dc91c24df5c08fc9f9cbb117.wav",
  face_url: face_url8.url,
  gfpgan: true,
  gfpgan_upscale: 2.0
});

// final result here
console.log(result8.uri);





const face_url9 = await eden.uploadFile("/Users/genekogan/eden/eden-templates/assets/lora/gene/<person1><person2> of paint texture, dri_980_004_1676701998_0.jpg");

let result9 = await eden.create("wav2lip", {
  speech_url: "https://minio.aws.abraham.fun/creations-stg/bc94e066e710ad06e6956cfa07245dc548cbda71dc91c24df5c08fc9f9cbb117.wav",
  face_url: face_url9.url,
  gfpgan: true,
  gfpgan_upscale: 2.0
});

// final result here
console.log(result9.uri);
//russian war propaganda poster of <person_20_020_1676585695_0.jpg
//<person1><person2> of paint texture, dri_980_004_1676701998_0.jpg