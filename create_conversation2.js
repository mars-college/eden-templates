import {EdenClient} from "eden-sdk";
import {parseLines} from './utils.js';

const eden = new EdenClient();


// 1) generate character descriptions
// 2) thread 1
//  - each character: generate face
//  - generate backstory
// 3) generate a conversation
// 4) thread 2
//  - each segment: generate video





// 1) Generate character descriptions

const character_prompt = `
I am generating text prompts of protagonists for AI generators. These are descriptions of characters or people which are highly detailed and aesthetically imaginative, diverse, and adventurous. They should start with a description of the character and then a long list of modifiers which elaborate on the style, genre, and medium of the character's appearance and illustration. They should be creative, bold, evocative, edgy, and eclectic.

Here are some examples.

Centered detailed portrait of a masked woman wearing a venetian mask, vibrant peacock feathers, intricate, elegant, highly detailed, digital painting, artstation, smooth, sharp focus, illustration, illuminated lines, outrun, vaporware, intricate venetian patterns, cyberpunk darksynthalphonse mucha
Slum cyberpunk man with gun, tattoed, cyberpunk slum rio de janeiro, light summer clothes, cyberpunk style, 2.2 gama, sony a7r7, tamron 10-24mm f/3.5-4.5, iso 3200, extremely detailed, 8k texture, lots of flowers and vibrant plants
An astronaut in a garden on a spring day, ornate, dynamic, particulate, rich colors, intricate, elegant, highly detailed, harper's bazaar art, fashion magazine, smooth, sharp focus, 8 k, octane render
A portrait of a traditional indigenous elder, with weathered skin and wrinkles, adorned with intricate tattoos and jewelry, seated in a natural outdoor setting, surrounded by plants and animals, with a peaceful and wise expression, detailed textures and realistic style, 4k resolution

I want you to generate a list of 2-3 such text prompts.
`

let character_result = await eden.create("complete", {
  prompt: character_prompt,
  temperature: 0.9,
  max_tokens: 200,
  top_p: 1,
  frequency_penalty: 0.15,
  presence_penalty: 0.1
});

const character_descriptions = parseLines(character_result.task.output.result);




async function createCharacterBackground(character_description) {

  // 2a) Generate character backstories and images
  const backstory_prompt = `
  I am generating backstories for AI-generated character. You will receive an aesthetic description of a character, and you should write a backstory for this character which will later be used in a short story about the character. Make sure the character's backstory is interesting and engaging, and its tone matches the aesthetic description. The backstory should be around 100-200 words long.

  Here is an example. You receive the following description of a character:

  Slum cyberpunk man with gun, tattoed, cyberpunk slum rio de janeiro, light summer clothes, cyberpunk style, 2.2 gama, sony a7r7, tamron 10-24mm f/3.5-4.5, iso 3200, extremely detailed, 8k texture, lots of flowers and vibrant plants.

  You generate the following backstory:

  José grew up in the Rio de Janeiro slums. He was forced to quickly become an adult at a young age because of the harsh conditions he had to live in. Despite his tough upbringing, José never stopped dreaming and working towards something better for himself. His dreams eventually led him to a life of cyberpunk fashion and technology, as he saw them as avenues for escape from his troubled past. Because of his photography, José gained some recognition in the slums and was able to move away from them. He still makes sure to visit those same areas where he grew up, taking pictures that highlight both the good and bad aspects of the slum lifestyle. He ensures each photo has plenty of detail, often going up to 8K textures, with lots of flowers and vibrant plants to add a dash of richness to the images.

  Now you get the following description of a character:

  ${character_description}

  Generate a backstory for this character.
  `
  let backstory_result = await eden.create("complete", {
    prompt: backstory_prompt,
    temperature: 0.9,
    max_tokens: 200,
    top_p: 1,
    frequency_penalty: 0.15,
    presence_penalty: 0.1
  });
  const character_backstory = backstory_result.task.output.result.trim();

  // 2b) Determine character's voice
  const men = ['Larry', 'Jordan', 'William', 'Oliver', 'Alfonso', 'Daniel', 'Adrian', 'Alexander', 'Anthony', 'Axel', 'Carter', 'Frankie', 'Frederick', 'Harrison', 'Hudson', 'Hunter', 'Julian', 'Lottie', 'Maverick', 'Bret', 'Nolan', 'Owen', 'Theodore', 'Arthur', 'Bruce', 'Bryan', 'Carlo', 'Domenic', 'Hayden', 'Reynaldo']
  const women = ['Susan', 'Charlotte', 'Aurora', 'Daisy', 'Darcie', 'Ellie', 'Evelyn', 'Lillian', 'Nova', 'Phoebe', 'Stella']
  const gender_prompt = `I am going to give you a description of a person. Please tell me if the description is most likely a man or woman. Only answer one word, man or woman. If you think there is not enough information to determine the gender, then just guess.
  ${character_description}`
  let gender_prompt_result = await eden.create("complete", {
    prompt: gender_prompt,
    temperature: 0.0,
    max_tokens: 10,
  });
  const gender_result = gender_prompt_result.task.output.result.trim().toLowerCase();  
  let randomVoice = [...men, ...women][Math.floor(Math.random() * (men.length + women.length))];
  if (gender_result == 'woman') {
    randomVoice = women[Math.floor(Math.random() * women.length)];
  } 
  else if (gender_result == 'man') {
    randomVoice = men[Math.floor(Math.random() * men.length)];
  }

  // 2c) Generate character face from description
  let init_image_urls = await eden.uploadFiles([
    "assets/misc/standing1.jpg", 
    "assets/misc/pose1.jpg", 
    "assets/misc/face1.jpg"
  ])
  let init_image = init_image_urls[1]; //[Math.floor(Math.random() * init_image_urls.length)];
  let face_config = {
    text_input: character_description,
    init_image_data: init_image,
    init_image_strength: 0.2,
    width: 576,
    height: 832
  }
  let face_result = await eden.create("create", face_config);
  return {character_backstory, face_result};
}






// 4) Generate TTS from monologue


let tts_config = {
  text: character_monologue,
  voice: randomVoice
}
let tts_result = await eden.create("tts_fast", tts_config);

console.log(tts_result);


// 5) Generate lip-sync from TTS and face

let w2l_result = await eden.create("wav2lip", {
  speech_url: tts_result.uri,
  face_url: face_result.uri,
  gfpgan: true,
  gfpgan_upscale: 2.0
});

// final result here
console.log(w2l_result);

