import fs from 'fs';
import path from 'path';


function getAllFiles(directoryPath, filetype) {
  const files = fs.readdirSync(directoryPath).filter(file => file.endsWith(filetype));
  return files.map(file => path.join(directoryPath, file));
}

function getRandomSample(array, n) {
  let result = [];
  while (result.length < n) {
    const index = Math.floor(Math.random() * array.length);
    if (!result.includes(array[index])) {
      result.push(array[index]);
    }
  }
  return result;
}

function parseChat(chatText) {
  const messages = [];
  const lines = chatText.split("\n");
  for (let line of lines) {
    line = line.trim();
    if (line.includes(":")) {
      const [speaker, message] = line.split(":", 2).map((s) => s.trim());
      messages.push({ speaker, message });
    }
  }
  return messages;
}

function parseLines(text) {
  const textLines = text.trim().split("\n");
  let lines = [];
  for (let line of textLines) {
    line = line.trim();
    line = line.replace(/^\d+\.\s*/, '');
    if (line.length > 0) {
      lines.push(line);
    }
  }
  return lines;
}

export {
  getAllFiles,
  getRandomSample,
  parseChat,
  parseLines
}