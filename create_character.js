import {EdenClient} from "eden-sdk";

import dotenv from 'dotenv';

dotenv.config()

const eden = new EdenClient();
eden.loginApi(process.env.EDEN_API_KEY, process.env.EDEN_API_SECRET);


//1) generate the text with a GPT-3 completion
// const prompt = "Once upon a time,"
// let result1 = await eden.create("complete", {
//   prompt: prompt,
//   max_tokens: 75
// });
// console.log(result1);
// let completion = await fetch(result1.uri).then(response => response.text());

let completion = "I am your guardian angel" 

// 2) speak the completion with a TTS model on a cloned voice
const voice_cloning_files = [
  "assets/audio/jmill/1.wav",
  "assets/audio/jmill/2.wav",
  "assets/audio/jmill/3.wav",
  "assets/audio/jmill/4.wav",
  "assets/audio/jmill/5.wav",
]

const voice_file_urls = await eden.uploadFiles(voice_cloning_files);
console.log(voice_file_urls)
let result2 = await eden.create("tts", {
  text: completion,
  voice: "clone",
  voice_file_urls: voice_file_urls,
  preset: "standard",
});

console.log(result2);

// 3) generate a lip-synced video from the speech and face

// if you want to upload an image...
//const new_img_url = await eden.uploadFile("assets/images/marzipan/2.jpg");
//console.log(new_img_url);

const face_url_options = [
  'https://cdn.discordapp.com/attachments/658622951616282625/1074541703958102096/frame_0.0000000000000000.jpg',
  'https://cdn.discordapp.com/attachments/658622951616282625/1074541705254150235/hyper_detailed_comic_illustration_of_a_b_7_dreamlike-art_dreamlike-photoreal-2.0_0_0_noinit.jpg',
  'https://cdn.discordapp.com/attachments/658622951616282625/1074541704927006791/gene_the_logician_pride_unique_pers_23_dreamlike-art_dreamlike-photoreal-2.0_0_0_noinit.jpg',
  'https://cdn.discordapp.com/attachments/658622951616282625/1074541704532729956/stunning_masterpiece_portrait_of_gene__1676249072_dreamlike-art_dreamlike-photoreal-2.0_final_lora.safetensors_0_0.jpg'
]

const face_url = face_url_options[Math.floor(Math.random() * face_url_options.length)];

let result3 = await eden.create("wav2lip", {
  speech_url: "https://minio.aws.abraham.fun/creations-stg/bc94e066e710ad06e6956cfa07245dc548cbda71dc91c24df5c08fc9f9cbb117.wav",
  face_url: face_url,
  gfpgan: true,
  gfpgan_upscale: 2.0
});

// // final result here
console.log(result3);

