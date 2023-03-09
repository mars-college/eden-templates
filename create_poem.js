import {EdenClient} from "eden-sdk";
import {parseLines} from './utils.js';

const eden = new EdenClient();


async function generatePoem(character_description) {
  
  // 2) Generate character face from description

  let init_image_urls = await eden.uploadFiles([
    "assets/misc/face1.jpg", 
    "assets/misc/face2.jpg", 
    "assets/misc/face3.jpg", 
    "assets/misc/face5.jpg", 
    "assets/misc/pose1.jpg", 
    "assets/misc/pose2.jpg", 
    "assets/misc/pose3.jpg", 
    "assets/misc/pose4.jpg", 
    "assets/misc/standing1.jpg"
  ])
  let init_image = init_image_urls[Math.floor(Math.random() * init_image_urls.length)];
  let face_config = {
    text_input: character_description,
    init_image_data: init_image,
    init_image_strength: 0.1 + 0.15*Math.random(),
    width: 512,
    height: 768
  }
  let face_result = await eden.create("create", face_config);

  console.log(face_result);

  // 3) Generate character poem

  const poem_prompt = `You will receive a description of a novel character in exquisite detail. Write a poem for this character to perform, around 20-30 lines. The character will recite the poem for an audience.
  
The poem should be engaging, sophisticated, and enlightened. It should feel relevant to the character's personality and aesthetic description. Dark characters should produce dark poetry, while funny characters should produce humorous poetry.

Here is a description of the character:

${character_description}

Generate a poem for this character to recite. Do not label the verses, just write the poem as a whole.`

  const character_poem_result = await eden.create("complete", {
    prompt: poem_prompt,
    temperature: 0.925,
    max_tokens: 500,
    top_p: 1,
    frequency_penalty: 0.15,
    presence_penalty: 0.1
  });

  const character_poem = character_poem_result.task.output.result.trim();

  console.log(character_poem);

  // 4) Generate TTS from poem

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
    text: character_poem,
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

A spacepunk man in a psychedelic synthwave scene with moons, planets and stars in the background, symmetrical, graphic print, illustration, pen and ink, art nouveau, detailed lines
Centered detailed portrait of a masked woman wearing a venetian mask, vibrant peacock feathers, intricate, elegant, highly detailed, digital painting, artstation, smooth, sharp focus, illustration, illuminated lines, outrun, vaporware, intricate venetian patterns, cyberpunk darksynthalphonse mucha
Maximalist fashionable female astronaut preparing for lift off. maximalist sci-fi aesthetic. stunning maximalist interior shot of a starship cabin with lots of gadgets and controls, maximalist aesthetic.
Slum cyberpunk man with gun, tattoed, cyberpunk slum rio de janeiro, light summer clothes, cyberpunk style, 2.2 gama, sony a7r7, tamron 10-24mm f/3.5-4.5, iso 3200, extremely detailed, 8k texture, lots of flowers and vibrant plants
Mech Punk clothes with short hair girl, battle status, hyper detailed, digital art, Cyberpunk style, cybercinematic lighting, studio quality, smooth render, unreal engine 5 rendered, octane rendered, art style by klimt and nixeu and ian sprigger and wlop and krenz cushart
An astronaut in a garden on a spring day, ornate, dynamic, particulate, rich colors, intricate, elegant, highly detailed, harper's bazaar art, fashion magazine, smooth, sharp focus, 8 k, octane render
Mad scientist at a control panel programming a giant robot brain in a gyroscope, oil on canvas
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

let character_descriptions = parseLines(character_result.task.output.result);

const promises = character_descriptions.map(async (character_description) => {
  const result = await generatePoem(character_description);
  return result;
});

const allPoems = await Promise.all(promises);
console.log(allPoems);

// write to file
const allPoemsCat = allPoems.join(', ');
const randomName = Math.random().toString(36).substring(7);
const file = fs.createWriteStream(`output2/${randomName}.txt`);
file.on('error', function(err) { console.log(err) });
file.write(allPoemsCat);
file.end();

