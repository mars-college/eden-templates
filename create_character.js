import {EdenClient} from "eden-sdk";

const eden = new EdenClient();

eden.loginApi(
  "26c71dbb6b41568e952ee524b6648f3423a80b80",
  "85a75527169427b0d2b7bf02cf973bb2e1595986"
);

// all the settings here

const prompt = "What is the meaning of life? I think it can only be described like this:"

const face_url_options = [
  'https://cdn.discordapp.com/attachments/658622951616282625/1074541703958102096/frame_0.0000000000000000.jpg',
  'https://cdn.discordapp.com/attachments/658622951616282625/1074541705254150235/hyper_detailed_comic_illustration_of_a_b_7_dreamlike-art_dreamlike-photoreal-2.0_0_0_noinit.jpg',
  'https://cdn.discordapp.com/attachments/658622951616282625/1074541704927006791/gene_the_logician_pride_unique_pers_23_dreamlike-art_dreamlike-photoreal-2.0_0_0_noinit.jpg',
  'https://cdn.discordapp.com/attachments/658622951616282625/1074541704532729956/stunning_masterpiece_portrait_of_gene__1676249072_dreamlike-art_dreamlike-photoreal-2.0_final_lora.safetensors_0_0.jpg'
]

const voice_cloning_files = [
  "assets/voice1.wav", 
  "assets/voice2.wav", 
  "assets/voice3.wav"
]

// 1) generate the text with a GPT-3 completion
let result1 = await eden.create("complete", {
  prompt: prompt
});
let completion = await fetch(result1.task.output[0]).then(response => response.text());

// 2) speak the completion with a TTS model on a cloned voice
const voice_file_urls = await eden.uploadFiles(voice_cloning_files);
let result2 = await eden.create("tts", {
  text: completion,
  voice: "clone",
  voice_file_urls: voice_file_urls,
  preset: "standard",
});

// 3) generate a lip-synced video from the speech and face
const face_url = face_url_options[Math.floor(Math.random() * face_url_options.length)];
let result3 = await eden.create("wav2lip", {
  speech_url: result2.task.output[0],
  face_url: face_url,
  gfpgan: true,
  gfpgan_upscale: 2.0
});

// final result here
console.log(result3);
