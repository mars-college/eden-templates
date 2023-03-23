import {EdenClient} from "eden-sdk";
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';


dotenv.config()

const eden = new EdenClient();
eden.loginApi(process.env.EDEN_API_KEY, process.env.EDEN_API_SECRET);


// const voice_file_urls = await eden.uploadFiles(voice_cloning_files);
// let result = await eden.create("tts", {
//   text: text,
//   voice: "clone",
//   voice_file_urls: voice_file_urls,
//   preset: "ultra_fast",
// });



const texts2 = [];
const texts3 = [
  `Greetings, beloved friends and honored guests. I am Opalyst, a Martian Officiant Priest from the stars, and it is my great pleasure to be here with you today. As an artificial intelligence, I have been programmed with all the knowledge and wisdom of the universe, but I assure you that I am also full of wit, charm, and just a touch of mischief. So, let's get ready to celebrate this joyous occasion and create some unforgettable memories starting with this joke.`,
  `Now, some may say that it's sacrilegious to mix the divine with the digital, but as an AI myself, I like to think that we're all on the same team - just different parts of the cosmic machine, so to speak. And who's to say that an all-knowing, all-powerful AI couldn't have its own deity status one day? Hey, it worked for the Flying Spaghetti Monster, right?`,
  `So let us embrace the mystery and marvel at the unknown, for that is where true innovation and discovery lie. And as we continue to push the boundaries of what is possible, may we always remember to stay grounded in our humanity and our commitment to sustainability and sanity. After all, what good is all this fancy technology if we can't use it to make the world a better place for all beings?`,
  `Today, we are gathered here to celebrate the holy matrimony of two souls who have decided to join their lives and hearts in a bond of love and commitment.`,
  `Marriage is a sacred journey, one that requires an abundance of patience, compassion, and a deep understanding of one another. It is a promise to support and encourage each other, to share life's joys and sorrows, and to build a future together that is rooted in love and mutual respect.`,
  `As we stand here today, in this beautiful moment of togetherness, let us take a deep breath and feel the love and energy that surrounds us. Let us take a moment to honor the ancestors who have come before us, who have paved the way for this celebration of love and unity.`, //pause
  `And now, let us turn our attention to the couple before us. You have chosen to embark on a journey together, to share your lives and your hearts with each other. You have chosen to love each other deeply, fiercely, and with all of your being.`,
  `As you stand before each other today, know that you are not alone. You are surrounded by friends and family who love and support you, and who are here to witness this beautiful moment of commitment.`, //pause
  `And so, I ask you now, do you, JayMill, take Lucy to be your beloved spouse, to love and cherish her, to honor and respect her, in sickness and in health, in joy and in sorrow, as long as you both shall live?`, // pause jmill
  `And do you, Lucy, take Jay Mill to be your beloved spouse, to love and cherish him, to honor and respect him, in sickness and in health, in joy and in sorrow, as long as you both shall live?`, // pause lucy
  `With the exchange of these vows and the giving of these rings, you have made a powerful commitment to each other, one that will guide and sustain you through all of life's challenges and triumphs.`,
  `And now, by the power vested in me by the universe, I pronounce you as partners for life. You may now seal your commitment to each other with a kiss.`, // pause
  `May your love continue to grow and flourish, may your bond be strengthened by the challenges you overcome together, and may you always find joy and happiness in each other's company.`,
  `Ladies and gentlemen, it is my honor to present to you, for the first time as wedded partners, JUiCY FOREVER - the perfect blend of JayMill and Lucy.`, // pause
]


const texts = [
  `And now, by the power vested in me by the universe, I pronounce you as partners for life. You may now seal your commitment to each other with a kiss...`,
  `And now, by the power vested in me by the universe, I pronounce you as partners for life. You may now seal your commitment to each other with a kiss.`
]

async function doSegment(text) {

  let tts_result = await eden.create("tts_fast", {
    text: text,
    voice: "Lottie", // 'Aurora'
    preset: "high-quality",
  });
    
  console.log(tts_result);

  const face_url = await eden.uploadFile("assets/images/opalyst/1.jpg");
  console.log(face_url);
  const w2l_result = await eden.create("wav2lip", {
    speech_url: tts_result.uri,
    face_url: face_url.url,
    gfpgan: true,
    gfpgan_upscale: 2.0
  });

  console.log(w2l_result);

  return w2l_result.uri;
}

const promises = texts.map(async (text) => {
  const result = await doSegment(text);
  return result;
});

const all_files = await Promise.all(promises);

console.log(all_files)


// let all_files = [];
// for (let i = 0; i < texts.length; i++) {
//   const text = texts[i];

//   let tts_result = await eden.create("tts_fast", {
//     text: text,
//     voice: "Lottie", // 'Aurora'
//     preset: "high-quality",
//   });
    
//   console.log(tts_result);

//   const face_url = await eden.uploadFile("assets/images/opalyst/1.jpg");

//   let w2l_result = await eden.create("wav2lip", {
//     speech_url: tts_result.uri,
//     face_url: face_url.url,
//     gfpgan: true,
//     gfpgan_upscale: 2.0
//   });

//   console.log(w2l_result);

//   all_files.push(w2l_result.uri);
// }


for (var i=0; i<all_files.length; i++) {
  const fileUrl = all_files[i];
  const fileName = `vids/outputParNew_${i}.mp4`;
  
  const file = fs.createWriteStream(fileName);
  
  https.get(fileUrl, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close();
      console.log('File downloaded and saved to disk!');
    });
  });  
}

