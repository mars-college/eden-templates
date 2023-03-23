import {EdenClient} from "eden-sdk";
import {parseLines} from './utils.js';

const eden = new EdenClient();

let init_image_urls = await eden.uploadFiles([
  "assets/misc/standing1.jpg", 
  "assets/misc/pose1.jpg", 
  "assets/misc/face1.jpg"
])
console.log(init_image_urls)

async function generateMonologue(character_description) {
  
  // 2) Generate character face from description

  let init_image_urls = await eden.uploadFiles([
    "assets/misc/standing1.jpg", 
    "assets/misc/pose1.jpg", 
    "assets/misc/face1.jpg"
  ])
  console.log(init_image_urls)
  let init_image = init_image_urls[1]; //[Math.floor(Math.random() * init_image_urls.length)];
  let face_config = {
    text_input: character_description,
    init_image_data: init_image,
    init_image_strength: 0.2,
    width: 576,
    height: 832
  }
  let face_result = await eden.create("create", face_config);

  console.log(face_result);

  // 3) Generate character monologue

  const monologue_prompt = `
  You will receive a description of a novel character in exquisite detail. Generate a short monologue for this character, around 3-5 sentences. During the monologues, the characters should introduce themselves in the first person and describe their lives and interests, or retell some exciting story from their life.

  For example, you may receive a description of a character like this:

  Centered detailed portrait of a masked woman wearing a venetian mask, vibrant peacock feathers, intricate, elegant, highly detailed, digital painting, artstation, smooth, sharp focus, illustration, illuminated lines, outrun, vaporware, intricate venetian patterns, cyberpunk darksynthalphonse mucha.

  And generate a monologue like this:

  "Greetings, I am the Masked Mistress, a Venetian woman with a taste for the extravagant. My life is filled with indulgence, from the fine wines I sip to the exquisite jewels I adorn. But it is not all frivolity, for I have also honed my skills in the art of deception, using my mask and intricate Venetian patterns to hide my true identity. Perhaps one day I will regale you with the tale of how I once stole a priceless diamond from under the noses of the wealthiest of Venice's elite."

  The next character description is this:

  ${character_description}

  Generate a monologue for this character.`

  const character_monologue_result = await eden.create("complete", {
    prompt: monologue_prompt,
    temperature: 0.9,
    max_tokens: 250,
    top_p: 1,
    frequency_penalty: 0.15,
    presence_penalty: 0.1
  });

  const character_monologue = character_monologue_result.task.output.result.trim();

  console.log(character_monologue);

  // 4) Generate TTS from monologue

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

  console.log("THE VOICE IS: " + randomVoice)
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

  return w2l_result.uri;
}

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


console.log(character_result);
let character_descriptions = parseLines(character_result.task.output.result);

const promises = character_descriptions.map(async (character_description) => {
  const result = await generateMonologue(character_description);
  return result;
});

const results = await Promise.all(promises);

console.log(results);
