import {EdenClient} from "eden-sdk";
import {getRandomSample, parseChat} from './utils.js';
import characters from './characters.js';
import openai from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config()

const eden = new EdenClient();
eden.loginApi(process.env.EDEN_API_KEY, process.env.EDEN_API_SECRET);

const configuration = new openai.Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const gpt3 = new openai.OpenAIApi(configuration);


const topics = [
  "how cool Bombay Beach is",
  "off-grid solarpunk communities in the desert",
  "artificial intelligence and the ultimate nature of reality",
  "consciousness and and the simulation",
  "DAOs, blockchains, and crypto-art",
  "the future of the internet",
  "how to make a living as an artist",
  "the beauty of mathematics and physics",
  "Keynesian and Austrian economics, and capitalism"
]

const allCharacters = ['Czar', 'Delic', 'Marzipan', 'Vanessa', 'Freeman', 'Gene'];
const selectedCharacters = getRandomSample(allCharacters, 3);
const selectedTopic = getRandomSample(topics, 1)[0];

console.log(selectedTopic, selectedCharacters);

// 1) write prompt
let characterIntro = "";
for (const c of selectedCharacters) {
  const character = characters[c];
  characterIntro += `${c}, ${character.description}\n`;
}

const prompt = `
I would like you to create a chat conversation between the following three characters.

${characterIntro}
The topic of the conversation is ${selectedTopic}.

Write a conversation between these four characters that is at least 500 words long. It should be formatted as a chat, one line for each message. No one should speak except these three characters.
`;

console.log(prompt);

// 2) generate conversation
let completion = await gpt3.createCompletion({
  model: "text-davinci-003",
  prompt: prompt,
  temperature: 0.9,
  max_tokens: 500,
  top_p: 1,
  frequency_penalty: 0.15,
  presence_penalty: 0.1
});
  
let chat = completion.data.choices[0].text;
let messages = parseChat(chat);
console.log(messages);

// 3) generate videos
let final_videos = [];

for (let message of messages) {
  const character = characters[message.speaker];
  const audioFiles = character.audioFiles;
  const faceFiles = getRandomSample(character.lora, 1);
  const faceFile = faceFiles[0];

  const audioUrls = await eden.uploadFiles(audioFiles);
  const faceUrl = await eden.uploadFile(faceFile);

  let ttsResult = await eden.create("tts", {
    text: message.message,
    voice: "clone",
    voice_file_urls: audioUrls,
    preset: "high_quality",
  });

  let videoResult = await eden.create("wav2lip", {
    speech_url: ttsResult.uri,
    face_url: faceUrl.url,
    gfpgan: true,
    gfpgan_upscale: 2.0
  });

  final_videos.push(videoResult.uri);
}

console.log(final_videos);

// write the list to file
const filename = 'output/' + Math.random().toString(36).substring(7) + '.txt';
fs.writeFile(filename, final_videos.join(", "), (err) => {
  if (err) throw err;
  console.log('The string was successfully written to file.');
});