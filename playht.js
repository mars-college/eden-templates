import axios from 'axios';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config()

const PLAYHT_USER = process.env.PLAYHT_USER
const PLAYHT_PASSWORD = process.env.PLAYHT_PASSWORD

function downloadFile(url, filename) {
  return axios.get(url, { responseType: 'arraybuffer' })
    .then(response => {
      fs.writeFileSync(filename, Buffer.from(response.data, 'binary'))
    })
}

async function runTTSRequest(text, voice, filename) {
  const url = 'https://play.ht/api/v1/convert'
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': PLAYHT_PASSWORD,
    'X-User-ID': PLAYHT_USER
  }
  console.log("header", headers)

  const body = {
    voice: voice,
    content: [text]
  }
  console.log("body", body)
  let response = await axios.post(url, body, { headers });
  if (response.status !== 201) {
    throw new Error('Failed')
  }
  const jobId = response.data.transcriptionId
  const urlFetch = `https://play.ht/api/v1/articleStatus?transcriptionId=${jobId}`
  console.log(`Submitted job ${jobId} to PlayHT`)

  let finished = false;
  while (!finished) {
    let response2 = await axios.get(urlFetch, { headers });
    console.log("response2", response2.data)
    if (response2.status !== 200) {
      throw new Error('Failed')
    }
    const data = response2.data
    if (data.converted) {
      finished = true;
      const audioUrl = data.audioUrl
      console.log(`Got audio url ${audioUrl}`)
      return downloadFile(audioUrl, filename)
    }
  }
}

const mytext = `
Colorful mermaid swimming in a bright aurora borealis, art-deco style, surreal, cubism, fractal patterns, layered textures, vibrant colors

A giant robot battling a massive tsunami, comic-style, cel shading, bold outlines and colors, speed lines, 3D

A magical forest with an ancient tree and a fountain in the middle, oil painting, impressionistic, dreamlike atmosphere, soft brushstrokes

A futuristic city skyline with flying cars and hovering skyscrapers, futuristic style, neon colors in the night sky, 3D rendered

Fantasy creature riding a dragon over a stylized mountain range, pastel color palette, watercolor painting, dynamic poses
`

const mytext2 = `A version of the little mermaid, surrealist elements, acrylic painting, cubism, pastel colors, expressionism, dynamic scene.`

runTTSRequest(mytext, 'Jordan', 'hello2.mp3')
  .then(() => console.log('Audio file downloaded'))
  .catch(error => console.error(error))