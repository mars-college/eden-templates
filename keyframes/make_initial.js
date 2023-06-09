import {EdenClient} from "eden-sdk";
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';
import { exec } from 'child_process';

dotenv.config()

const eden = new EdenClient();
eden.loginApi(process.env.EDEN_API_KEY, process.env.EDEN_API_SECRET);


function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(filePath);
    https.get(url, (response) => {
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlinkSync(filePath);
      reject(err);
    });
  });
}


async function generate(text) {
  const config = {
    text_input: text,
    width: 960,
    height: 640,
    seed: Math.floor(Math.random() * 1000000),
  }
  const result = await eden.create("create", config);
  return result;
}

async function generateAll(prompts) {

  const promises = prompts.map(async (text) => {
    const result = await generate(text);
    const {task, uri} = result;
    
    const txtName = `results/${text.substring(0, 150)}.json`;
    const imgName = `results/${text.substring(0, 150)}.png`;

    await downloadFile(uri, imgName);

    const jsonFile = fs.createWriteStream(txtName);
    jsonFile.write(JSON.stringify(task.config));
    jsonFile.end();

    return imgName;
  });

  const all_texts = await Promise.all(promises);
  console.log(all_texts)
}


const dir = './results';

const keyframes = [
  "myImage1.png",
  "myImage2.png",
  "myImage3.png",
]

const pairs = [];
for (let i = 0; i < keyframes.length; i++) {
  const j = (i + 1) % keyframes.length;
  pairs.push([i, keyframes[i], keyframes[j]]);
}

console.log(pairs);

// for each pair, get corresponding json file (replace png with json), then load the json file
// and use the config to generate a new image
const promises = pairs.map(async (pair) => {
  const json1 = pair[1].replace('.png', '.json');
  const json2 = pair[2].replace('.png', '.json');
  // load the jsons
  const [config1, config2] = await Promise.all([
    new Promise((resolve, reject) => {
      fs.readFile(`${dir}/${json1}`, 'utf-8', (err, data) => {
        if (err) reject(err);
        else resolve(JSON.parse(data));
      });
    }),
    new Promise((resolve, reject) => {
      fs.readFile(`${dir}/${json2}`, 'utf-8', (err, data) => {
        if (err) reject(err);
        else resolve(JSON.parse(data));
      });
    }),
  ]);

  const config = {
    text_input: config1.text_input + " to " + config2.text_input,
    width: 960,
    height: 640,
    interpolation_seeds: [config1.seed, config2.seed],
    interpolation_texts: [config1.text_input, config2.text_input],
    steps: 80,
    n_frames: 200,
    n_film: 1,
    smooth: true,
    loop: false,
    fps: 25,
  }

  const result = await eden.startTask("interpolate", config);
  console.log(result);

  return result.taskId;
});

const all_tasks = await Promise.all(promises);
console.log(all_tasks);

const all_tasks = [
  'xsqvpg4lxvav3csik6ym4i2rbm',
  'xbploz2pwfbdthiu73ma7wu32q',
  'dm6xofp7gneebiv54julybg4i4',
  'eruqgi5sqbcmvdzqgknmecptou',
  'f7egc2msinasbjv63h522kdws4',
  'jqi2pxpgbrhvhozgupy4wkykdq',
  '2s63byijbzem7avnrflowwtify',
  'u5k5u2wt3bc2hb6pb7cguiabjm',
  'pdx73yjykvga5cq6ji3coz3u4m',
  'ikizvwj65nhzpkpmocfxtalmfq',
  '3qf2ywk6zfdilhygxowi5wrq4u',
  '6m2qwb6g3bcxnhfg743wz2vroe',
  'ij433gpn45etbiquqag62d76ra',
  'ub3arnrs75dqxpo2ijikosid3y',
  'mzxjpxcdpvastohjoo6rs644im',
  'n2e6ocwlabddlirwmatglzt2qu',
  'q7f537z33fcjjpkpcca55c5psu',
  'piucf473kbd7nlblr3li5ctxmm',
  'nwwm7j2p4fhevmd2aanugwgp6y',
  '6b6mzxaqbbglfjkkgvj62u4gbm',
  'swrk66tvbzb7tck742zvz2vgfy',
  'ktllr3222nezhfg3fhzwxugvt4',
  // 'fmpqv3nkvbhunfhestise5b7ra',
  '6f7fseecsrdzfosifbkiwi5w7e',
  'xkmbobmsmrfblp24ouipjsn6u4',
  'lsqivka5cbc7hkrxt5vpbyrqpi',
  'dxnfexve45annaly3tl3rmxe2y',
  'cfhdfinntre43fyhyrbhwegw6y',
  '63wxplkj5vccpi5ti4wzx2enxy',
  // '3od4zlzpwrdmpkhz43bpaei64q',
  'luucnsg4zncfjitt575rhxtcx4',
  '4vohcimrnzh3je3kkwcjajj4h4',
  '5bdiegy6lfh2di5qpple6ouxrq',
  'v3vizarhfvcbnmv3jcmtjzx5xy',
  'ybrct2ey45ha5g3ubv62tijpha',
  '4umskckifrf53l7untnouvlfni',
  'v45epvwklffnzjbpi3ay5emqge',
  'iko45rvlmfcwzme5rtuauw54o4',
  '2tmxkc3eafayvfrjocdu6yqrty',
  'qqm3uwxqkvdotfho3zdxmlkmzy',
  'dvafwmsgw5bzdh6rm2nqw32ena',
  '43egzlwxkrewndi26wig4wn7pm',
  'm3xrrpwza5anxczay3cszzq7sy',
  '5bkpe54sdrcejkpn6dz4ce2nsq',
  '7in75shr6bhkxmwd2moudv65qu',
  'hy4idyzgsjf6boxqzx7lsqeb6i',
  '6ucdrpbkbrcqffrv4cd3itoujm',
  'mr5alfnmbbcgtjrdot53n24qce',
  'czxox54g4fcdbdehd6j5rr2z2e',
  'derpiyjtwjbznko6rj4elkmsk4',
  'xotqohoidzardci6k23vhkimy4',
  '56fps6nyi5bhdl4awgze6gkuai',
  '6va5hdslo5f4dd2fdtqrcgoocm',
  'feuisacgbfczpa4pxx75rdfjyq',
  'yopl3vvghvac3bc2qpa25yvp24',
  'jcbeqj3h3zfeljt76ag6uqgybu',
  'itaomgrjkzhc7kq7w3eodyzkwm',
  '74s6tzmfvzg3tapo3yrlxszwxq',
  'ugigwxluubgb5kus576ownnjfe',
  'a7wf2tbpvjaezaq76hxtbfrlri',
  've4a2wdecfdixkb7vczzft5pp4',
  'qymg4he6sjeoncqpwwna3bnc7q',
  'tvfre434inhy7heg6a2cxynhrm',
  'pp2krkiqffdb5gw2f3j2ch6qi4',
  'enhegvgdvfd4rpnn6d4g7mahai',
  '5j72bpgjqnh4pggxcfs467txv4',
  '57sv4jl6crf7jpzr5mmaskwlmm',
  '2ssrz572rzcndncrs27on47ase',
  'icewqqtsdrgkld75jrwon264eq',
  'sixzwnw4lbehndr5czyagedkte',
  'bsbxryn7hzbkxasqnh726qhrti',
  'ie4zargejngrxp42ypqdosd5c4',
  'vrwsxjqlffhqziicvh5yrmfrva',
  'lf7xj44qkrd3lhjpv5a3wspwd4',
  'zn64ejkrrfa2jjjtzr2biogpdy',
  '3s2tz3hnjreblnfjmbnl356kcu',
  'su4u23tikrepdhqwt5przxwlia',
  'xf4kxci4lfbnpmsnsrhfaoy52q',
  '3lt4jiyqnvabfo776heilgibbi',
  'tqwrc3k7wvaydhdnhw6cddbsc4',
  'ndmej7fshbbf7e2lrroynorlye',
  'vp5swpqt6rajnafrt4yztjvl7m',
  'mejw7f57ozh5xbanyv4k57iwb4',
  'i2xdzahrpfelngha6vmfxfn3xi',
  'lmvmhewmpjgzvb6hfjrjosz7y4',
  'z3imdez5fbduznivxbwipf27le',
  '5urlyfx2obflri2cmey3igg3ua',
  'l5ja3wzxkbezjpsii3rqfvyyg4',
  // '3xlultkwnfft3co3xtel6z4xku',
  '4uudcqwcjbbq7hk2pagutcmh7m',
  'gfcmy2luwrakjm5dv3qfj3dz6m',
  'thhd6dwt45b5rpz27le4tn43m4',
  'cndnuhpaindyhg4xpw7ksbvfii',
  'bjhjbtq4hrdntlrbzzx6jd3obq',
  'e5toczqmwvhbvbdtokyw5swoja',
  'drtremmrl5c55bi7foypsnnib4',
  'iixpoqbrrvfyddrrnrybudaq3e',
  'sqxvxsy23fagxivlc6fxgdibfe',
  'tnavuoj25ff27cuyd4y257bsjm',
  'fyg3pjh7bbectohsng6kd36xfe'
]

// const all_tasks = [
//   'ukhc5fc2mjcmfcjsrqcwoe7cua',
//   'narlmllrqzcvfaa5k2vrleo6da',
//   'vy52ux7vurhrld7sllqxkt7gii'
// ]

// sleep for 20 minutes
console.log('sleeping');
//await new Promise(resolve => setTimeout(resolve, 10 * 1000));
console.log('done sleeping');


const promises2 = all_tasks.map(async (taskId) => {
  const result = await eden.getTaskStatus(taskId);
  const vidName = `videos/${taskId}.mp4`;
  // check if already downloaded
  const isDownloaded = fs.existsSync(vidName);
  if (isDownloaded) {
    console.log('already downloaded');
    return vidName;
  }
  console.log(vidName);
  console.log(result);
  if (result.task.creation) {
    const creation = await eden.getCreation(result.task.creation);
    console.log(creation);
    downloadFile(creation.uri, vidName)
  }
  return vidName;
});

const all_videos = await Promise.all(promises2);
console.log(all_videos);

// await downloadFile(result2.uri, vidName);

console.log("making final output video")

// // Create the text file
const inputFilePath = 'files.txt';
const inputFileContent = all_videos.map(filename => `file '${filename}'`).join('\n');
fs.writeFileSync(inputFilePath, inputFileContent);

await new Promise(resolve => setTimeout(resolve, 5 * 1000));

// Run the FFmpeg command
const outputFilePath = 'output3.mp4';
const command = `ffmpeg -f concat -safe 0 -i ${inputFilePath} -c copy ${outputFilePath}`;
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`FFmpeg error: ${error}`);
    return;
  }
  console.log(`FFmpeg output: ${stdout}`);
});