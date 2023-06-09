import {EdenClient} from "eden-sdk";
import fs from "fs";
import fetch from "node-fetch";
import path from 'path';


function getAllFiles(directoryPath, filetype) {
  const files = fs.readdirSync(directoryPath).filter(file => file.toLowerCase().endsWith(filetype));
  return files.map(file => path.join(directoryPath, file));
}

async function downloadImage(url, filename) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  fs.writeFile(filename, Buffer.from(arrayBuffer), (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Successfully saved ${filename}`);
    }
  });
}

async function interrogate(filepath) {
  try {
    const savePath = filepath.replace(/\.[^/.]+$/, "") + ".txt";
    const edenImage =  await eden.uploadFile(filepath);

    if (fs.existsSync(savePath)) {
      console.log("already exists", savePath);
      return;
    }

    let config = {      
      init_image_data: edenImage.url,
    }

    let result = await eden.create("interrogate", config);

    if (result.error) {
      console.log(result.error);
      return;
    }

  } catch (e) {
    console.log(e);
  }
}


const eden = new EdenClient();
const root_folder = "MY_FOLDER"

const images = getAllFiles(root_folder, ".jpg").concat(getAllFiles(root_folder, ".png"));

console.log(images);

for (let i = 0; i < images.length; i++){
  await interrogate(images[i]);
}
