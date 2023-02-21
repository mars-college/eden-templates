import { getAllFiles } from './utils.js'


const characters = {
  'Czar': {
    audioFiles: getAllFiles('assets/audio/czar', '.wav'),
    image: 'assets/images/czar/1.jpg',
    lora: getAllFiles('assets/lora/czar', '.jpg'),
    description: 'a healer who is interested in water, botany, and ecological restoration.'
  },
  'Delic': {
    audioFiles: getAllFiles('assets/audio/delic', '.wav'),
    image: 'assets/images/delic/1.jpg',
    lora: getAllFiles('assets/lora/delic', '.jpg'),
    description: 'a carpenter who rides an electric unicycle and practices AI prompt engineering.'
  },
  'Marzipan': {
    audioFiles: getAllFiles('assets/audio/marzipan', '.wav'),
    image: 'assets/images/marzipan/1.jpg',
    lora: getAllFiles('assets/lora/marzipan', '.jpg'),
    description: 'a microbiologist who who is interested in creating wetware to support the Bombay Beach simulation.'
  },
  'Vanessa': {
    audioFiles: getAllFiles('assets/audio/vanessa', '.wav'),
    image: 'assets/images/vanessa/1.jpg',
    lora: getAllFiles('assets/lora/vanessa', '.jpg'),
    description: 'an artist who is building a simulation linking the minds of people in Bombay Beach.'
  },
  'Freeman': {
    audioFiles: getAllFiles('assets/audio/freeman', '.wav'),
    image: 'assets/images/freeman/1.jpg',
    lora: getAllFiles('assets/lora/freeman', '.jpg'),
    description: 'a mystic and yogi advocating for young people to move to the desert and take up vanlife.'
  },
  'Gene': {
    audioFiles: getAllFiles('assets/audio/gene', '.wav'),
    image: 'assets/images/gene/1.jpg',
    lora: getAllFiles('assets/lora/gene', '.jpg'),
    description: 'a computer engineer and inventor who is building a simulation engine for the collective imagination.'
  },
  'Xander': {
    audioFiles: getAllFiles('assets/audio/xander', '.wav'),
    image: 'assets/images/xander/1.jpg',
    lora: getAllFiles('assets/lora/xander', '.jpg'),
    description: 'a rock climber turned AI researcher and biotech engineer.'
  },
  'Vincent': {
    audioFiles: getAllFiles('assets/audio/vincent', '.wav'),
    image: 'assets/images/vincent/1.jpg',
    lora: getAllFiles('assets/lora/vincent', '.jpg'),
    description: 'a media artist and detective investigating an alleged plot to tamper with the intelligence simulator.'
  },
}

export default characters