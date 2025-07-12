// Basic phoneme mapping for common words and letter combinations
const phonemeMap: Record<string, string[]> = {
  // Common words
  hello: ["HH", "AH", "L", "OW"],
  world: ["W", "ER", "L", "D"],
  the: ["DH", "AH"],
  and: ["AH", "N", "D"],
  you: ["Y", "UW"],
  are: ["AA", "R"],
  this: ["DH", "IH", "S"],
  that: ["DH", "AE", "T"],
  with: ["W", "IH", "TH"],
  have: ["HH", "AE", "V"],
  will: ["W", "IH", "L"],
  from: ["F", "R", "AH", "M"],
  they: ["DH", "EY"],
  know: ["N", "OW"],
  want: ["W", "AA", "N", "T"],
  been: ["B", "IH", "N"],
  good: ["G", "UH", "D"],
  much: ["M", "AH", "CH"],
  some: ["S", "AH", "M"],
  time: ["T", "AY", "M"],
  very: ["V", "EH", "R", "IY"],
  when: ["W", "EH", "N"],
  come: ["K", "AH", "M"],
  here: ["HH", "IY", "R"],
  just: ["JH", "AH", "S", "T"],
  like: ["L", "AY", "K"],
  over: ["OW", "V", "ER"],
  also: ["AO", "L", "S", "OW"],
  back: ["B", "AE", "K"],
  after: ["AE", "F", "T", "ER"],
  use: ["Y", "UW", "Z"],
  two: ["T", "UW"],
  how: ["HH", "AW"],
  our: ["AW", "ER"],
  work: ["W", "ER", "K"],
  first: ["F", "ER", "S", "T"],
  well: ["W", "EH", "L"],
  way: ["W", "EY"],
  even: ["IY", "V", "AH", "N"],
  new: ["N", "UW"],
  would: ["W", "UH", "D"],
  there: ["DH", "EH", "R"],
  each: ["IY", "CH"],
  which: ["W", "IH", "CH"],
  she: ["SH", "IY"],
  do: ["D", "UW"],
  get: ["G", "EH", "T"],
  make: ["M", "EY", "K"],
  go: ["G", "OW"],
  see: ["S", "IY"],
  him: ["HH", "IH", "M"],
  could: ["K", "UH", "D"],
  now: ["N", "AW"],
  than: ["DH", "AE", "N"],
  find: ["F", "AY", "N", "D"],
  day: ["D", "EY"],
  did: ["D", "IH", "D"],
  may: ["M", "EY"],
  say: ["S", "EY"],
  think: ["TH", "IH", "NG", "K"],
  help: ["HH", "EH", "L", "P"],
  through: ["TH", "R", "UW"],
  too: ["T", "UW"],
  any: ["EH", "N", "IY"],
  should: ["SH", "UH", "D"],
  where: ["W", "EH", "R"],
  right: ["R", "AY", "T"],
  put: ["P", "UH", "T"],
  end: ["EH", "N", "D"],
  why: ["W", "AY"],
  turn: ["T", "ER", "N"],
  people: ["P", "IY", "P", "AH", "L"],
  house: ["HH", "AW", "S"],
  point: ["P", "OY", "N", "T"],
  hand: ["HH", "AE", "N", "D"],
  high: ["HH", "AY"],
  year: ["Y", "IY", "R"],
  mother: ["M", "AH", "DH", "ER"],
  light: ["L", "AY", "T"],
  country: ["K", "AH", "N", "T", "R", "IY"],
  father: ["F", "AA", "DH", "ER"],
  never: ["N", "EH", "V", "ER"],
  school: ["S", "K", "UW", "L"],
  thought: ["TH", "AO", "T"],
  upon: ["AH", "P", "AA", "N"],
  water: ["W", "AO", "T", "ER"],
  night: ["N", "AY", "T"],
  eyes: ["AY", "Z"],
  head: ["HH", "EH", "D"],
  often: ["AO", "F", "T", "AH", "N"],
  place: ["P", "L", "EY", "S"],
  until: ["AH", "N", "T", "IH", "L"],
  side: ["S", "AY", "D"],
  without: ["W", "IH", "DH", "AW", "T"],
  life: ["L", "AY", "F"],
  once: ["W", "AH", "N", "S"],
  white: ["W", "AY", "T"],
  least: ["L", "IY", "S", "T"],
  old: ["OW", "L", "D"],
  being: ["B", "IY", "IH", "NG"],
  great: ["G", "R", "EY", "T"],
  little: ["L", "IH", "T", "AH", "L"],
  man: ["M", "AE", "N"],
  show: ["SH", "OW"],
  large: ["L", "AA", "R", "JH"],
  small: ["S", "M", "AO", "L"],
  every: ["EH", "V", "R", "IY"],
  found: ["F", "AW", "N", "D"],
  between: ["B", "IH", "T", "W", "IY", "N"],
  name: ["N", "EY", "M"],
  big: ["B", "IH", "G"],
  give: ["G", "IH", "V"],
  air: ["EH", "R"],
  line: ["L", "AY", "N"],
  set: ["S", "EH", "T"],
  under: ["AH", "N", "D", "ER"],
  read: ["R", "IY", "D"],
  us: ["AH", "S"],
  along: ["AH", "L", "AO", "NG"],
  next: ["N", "EH", "K", "S", "T"],
  sound: ["S", "AW", "N", "D"],
  below: ["B", "IH", "L", "OW"],
  saw: ["S", "AO"],
  something: ["S", "AH", "M", "TH", "IH", "NG"],
  few: ["F", "Y", "UW"],
  those: ["DH", "OW", "Z"],
  always: ["AO", "L", "W", "EY", "Z"],
  looked: ["L", "UH", "K", "T"],
  during: ["D", "UH", "R", "IH", "NG"],
  another: ["AH", "N", "AH", "DH", "ER"],
  three: ["TH", "R", "IY"],
  word: ["W", "ER", "D"],
  near: ["N", "IY", "R"],
  sentence: ["S", "EH", "N", "T", "AH", "N", "S"],
  example: ["IH", "G", "Z", "AE", "M", "P", "AH", "L"],
  important: ["IH", "M", "P", "AO", "R", "T", "AH", "N", "T"],
  different: ["D", "IH", "F", "ER", "AH", "N", "T"],
  following: ["F", "AA", "L", "OW", "IH", "NG"],
  activity: ["AE", "K", "T", "IH", "V", "AH", "T", "IY"],
  picture: ["P", "IH", "K", "CH", "ER"],
  try: ["T", "R", "AY"],
  tell: ["T", "EH", "L"],
  move: ["M", "UW", "V"],
  play: ["P", "L", "EY"],
  number: ["N", "AH", "M", "B", "ER"],
  take: ["T", "EY", "K"],
  got: ["G", "AA", "T"],
  live: ["L", "IH", "V"],
  only: ["OW", "N", "L", "IY"],
  years: ["Y", "IY", "R", "Z"],
  used: ["Y", "UW", "Z", "D"],
  many: ["M", "EH", "N", "IY"],
  then: ["DH", "EH", "N"],
  them: ["DH", "EH", "M"],
  these: ["DH", "IY", "Z"],
  so: ["S", "OW"],
  her: ["HH", "ER"],
  into: ["IH", "N", "T", "UW"],
  has: ["HH", "AE", "Z"],
  more: ["M", "AO", "R"],
  no: ["N", "OW"],
  my: ["M", "AY"],
  call: ["K", "AO", "L"],
  who: ["HH", "UW"],
  down: ["D", "AW", "N"]
};

// Letter-to-phoneme patterns for unknown words
const letterPatterns: Record<string, string> = {
  'a': 'AE',
  'b': 'B',
  'c': 'K',
  'd': 'D',
  'e': 'EH',
  'f': 'F',
  'g': 'G',
  'h': 'HH',
  'i': 'IH',
  'j': 'JH',
  'k': 'K',
  'l': 'L',
  'm': 'M',
  'n': 'N',
  'o': 'AA',
  'p': 'P',
  'q': 'K',
  'r': 'R',
  's': 'S',
  't': 'T',
  'u': 'UH',
  'v': 'V',
  'w': 'W',
  'x': 'K S',
  'y': 'Y',
  'z': 'Z',
  'ch': 'CH',
  'sh': 'SH',
  'th': 'TH',
  'ng': 'NG',
  'er': 'ER',
  'ar': 'AA R',
  'or': 'AO R',
  'ow': 'AW',
  'ou': 'AW',
  'oo': 'UW',
  'ee': 'IY',
  'ea': 'IY',
  'ai': 'EY',
  'ay': 'EY',
  'oi': 'OY',
  'oy': 'OY',
  'au': 'AO',
  'aw': 'AO',
  'ie': 'IY',
  'ue': 'UW',
  'ui': 'UW'
};

export function textToPhonemes(text: string): string[] {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 0);
  
  const phonemes: string[] = [];
  
  for (const word of words) {
    if (phonemeMap[word]) {
      phonemes.push(...phonemeMap[word]);
    } else {
      // Fallback: basic letter-to-phoneme conversion
      phonemes.push(...convertWordToPhonemes(word));
    }
    
    // Add short pause between words
    phonemes.push('_PAUSE_');
  }
  
  return phonemes;
}

function convertWordToPhonemes(word: string): string[] {
  const phonemes: string[] = [];
  let i = 0;
  
  while (i < word.length) {
    let found = false;
    
    // Check for two-letter combinations first
    if (i < word.length - 1) {
      const twoChar = word.substring(i, i + 2);
      if (letterPatterns[twoChar]) {
        phonemes.push(...letterPatterns[twoChar].split(' '));
        i += 2;
        found = true;
      }
    }
    
    // Check single letter
    if (!found) {
      const oneChar = word[i];
      if (letterPatterns[oneChar]) {
        phonemes.push(letterPatterns[oneChar]);
      }
      i++;
    }
  }
  
  return phonemes;
}