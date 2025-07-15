// Comprehensive phoneme library for Hindi and English TTS

export interface PhonemeData {
  ipa: string;
  frequency: number;
  formants: [number, number, number]; // F1, F2, F3
  duration: number;
  voicing: boolean;
  amplitude: number;
}

// English phoneme mappings with formant frequencies
export const englishPhonemes: Record<string, PhonemeData> = {
  // Vowels
  'AE': { ipa: 'æ', frequency: 100, formants: [660, 1720, 2410], duration: 120, voicing: true, amplitude: 0.8 }, // cat
  'AA': { ipa: 'ɑ', frequency: 100, formants: [730, 1090, 2440], duration: 120, voicing: true, amplitude: 0.8 }, // father
  'AH': { ipa: 'ʌ', frequency: 100, formants: [640, 1190, 2390], duration: 100, voicing: true, amplitude: 0.7 }, // but
  'AO': { ipa: 'ɔ', frequency: 100, formants: [570, 840, 2410], duration: 120, voicing: true, amplitude: 0.8 }, // thought
  'AW': { ipa: 'aʊ', frequency: 100, formants: [730, 1090, 2440], duration: 150, voicing: true, amplitude: 0.8 }, // how
  'AY': { ipa: 'aɪ', frequency: 100, formants: [730, 1090, 2440], duration: 150, voicing: true, amplitude: 0.8 }, // my
  'EH': { ipa: 'ɛ', frequency: 100, formants: [530, 1840, 2480], duration: 100, voicing: true, amplitude: 0.7 }, // bed
  'ER': { ipa: 'ɝ', frequency: 100, formants: [490, 1350, 1690], duration: 120, voicing: true, amplitude: 0.7 }, // bird
  'EY': { ipa: 'eɪ', frequency: 100, formants: [530, 1840, 2480], duration: 150, voicing: true, amplitude: 0.8 }, // say
  'IH': { ipa: 'ɪ', frequency: 120, formants: [390, 1990, 2550], duration: 80, voicing: true, amplitude: 0.6 }, // bit
  'IY': { ipa: 'i', frequency: 120, formants: [270, 2290, 3010], duration: 120, voicing: true, amplitude: 0.8 }, // beat
  'OW': { ipa: 'oʊ', frequency: 100, formants: [570, 840, 2410], duration: 150, voicing: true, amplitude: 0.8 }, // boat
  'OY': { ipa: 'ɔɪ', frequency: 100, formants: [570, 840, 2410], duration: 150, voicing: true, amplitude: 0.8 }, // boy
  'UH': { ipa: 'ʊ', frequency: 100, formants: [440, 1020, 2240], duration: 80, voicing: true, amplitude: 0.6 }, // book
  'UW': { ipa: 'u', frequency: 100, formants: [300, 870, 2240], duration: 120, voicing: true, amplitude: 0.8 }, // boot

  // Consonants
  'B': { ipa: 'b', frequency: 80, formants: [300, 870, 2240], duration: 60, voicing: true, amplitude: 0.5 },
  'CH': { ipa: 'tʃ', frequency: 3000, formants: [200, 1600, 2600], duration: 100, voicing: false, amplitude: 0.4 },
  'D': { ipa: 'd', frequency: 150, formants: [300, 1700, 2600], duration: 60, voicing: true, amplitude: 0.5 },
  'DH': { ipa: 'ð', frequency: 200, formants: [300, 1400, 2600], duration: 80, voicing: true, amplitude: 0.3 },
  'F': { ipa: 'f', frequency: 6000, formants: [1400, 2300, 2900], duration: 100, voicing: false, amplitude: 0.3 },
  'G': { ipa: 'ɡ', frequency: 120, formants: [300, 1500, 2500], duration: 60, voicing: true, amplitude: 0.5 },
  'HH': { ipa: 'h', frequency: 2000, formants: [500, 1500, 2500], duration: 80, voicing: false, amplitude: 0.2 },
  'JH': { ipa: 'dʒ', frequency: 150, formants: [300, 1600, 2600], duration: 100, voicing: true, amplitude: 0.5 },
  'K': { ipa: 'k', frequency: 2500, formants: [300, 1500, 2500], duration: 80, voicing: false, amplitude: 0.4 },
  'L': { ipa: 'l', frequency: 150, formants: [360, 750, 2400], duration: 100, voicing: true, amplitude: 0.6 },
  'M': { ipa: 'm', frequency: 120, formants: [280, 900, 2200], duration: 100, voicing: true, amplitude: 0.6 },
  'N': { ipa: 'n', frequency: 150, formants: [280, 1700, 2600], duration: 80, voicing: true, amplitude: 0.6 },
  'NG': { ipa: 'ŋ', frequency: 120, formants: [280, 1300, 2200], duration: 100, voicing: true, amplitude: 0.6 },
  'P': { ipa: 'p', frequency: 2000, formants: [300, 870, 2240], duration: 80, voicing: false, amplitude: 0.4 },
  'R': { ipa: 'r', frequency: 120, formants: [490, 1350, 1690], duration: 100, voicing: true, amplitude: 0.6 },
  'S': { ipa: 's', frequency: 7000, formants: [1400, 2300, 2900], duration: 100, voicing: false, amplitude: 0.3 },
  'SH': { ipa: 'ʃ', frequency: 4000, formants: [1800, 2300, 2800], duration: 100, voicing: false, amplitude: 0.3 },
  'T': { ipa: 't', frequency: 3000, formants: [300, 1700, 2600], duration: 60, voicing: false, amplitude: 0.4 },
  'TH': { ipa: 'θ', frequency: 6000, formants: [1400, 2300, 2900], duration: 100, voicing: false, amplitude: 0.3 },
  'V': { ipa: 'v', frequency: 150, formants: [1400, 2300, 2900], duration: 80, voicing: true, amplitude: 0.4 },
  'W': { ipa: 'w', frequency: 100, formants: [300, 610, 2200], duration: 100, voicing: true, amplitude: 0.6 },
  'Y': { ipa: 'j', frequency: 120, formants: [270, 2290, 3010], duration: 80, voicing: true, amplitude: 0.6 },
  'Z': { ipa: 'z', frequency: 150, formants: [1400, 2300, 2900], duration: 100, voicing: true, amplitude: 0.4 },
  'ZH': { ipa: 'ʒ', frequency: 150, formants: [1800, 2300, 2800], duration: 100, voicing: true, amplitude: 0.4 },
};

// Hindi phoneme mappings with Devanagari romanization
export const hindiPhonemes: Record<string, PhonemeData> = {
  // Vowels (स्वर)
  'अ': { ipa: 'ə', frequency: 100, formants: [640, 1190, 2390], duration: 100, voicing: true, amplitude: 0.7 }, // a
  'आ': { ipa: 'aː', frequency: 100, formants: [730, 1090, 2440], duration: 150, voicing: true, amplitude: 0.8 }, // aa
  'इ': { ipa: 'ɪ', frequency: 120, formants: [390, 1990, 2550], duration: 100, voicing: true, amplitude: 0.7 }, // i
  'ई': { ipa: 'iː', frequency: 120, formants: [270, 2290, 3010], duration: 150, voicing: true, amplitude: 0.8 }, // ii
  'उ': { ipa: 'ʊ', frequency: 100, formants: [440, 1020, 2240], duration: 100, voicing: true, amplitude: 0.7 }, // u
  'ऊ': { ipa: 'uː', frequency: 100, formants: [300, 870, 2240], duration: 150, voicing: true, amplitude: 0.8 }, // uu
  'ऋ': { ipa: 'ɾɪ', frequency: 110, formants: [490, 1350, 1690], duration: 120, voicing: true, amplitude: 0.7 }, // ri
  'ए': { ipa: 'eː', frequency: 110, formants: [530, 1840, 2480], duration: 130, voicing: true, amplitude: 0.8 }, // e
  'ऐ': { ipa: 'ɛː', frequency: 110, formants: [610, 1900, 2500], duration: 130, voicing: true, amplitude: 0.8 }, // ai
  'ओ': { ipa: 'oː', frequency: 100, formants: [570, 840, 2410], duration: 130, voicing: true, amplitude: 0.8 }, // o
  'औ': { ipa: 'ɔː', frequency: 100, formants: [620, 900, 2450], duration: 130, voicing: true, amplitude: 0.8 }, // au

  // Consonants (व्यंजन)
  // Stops (स्पर्श)
  'क': { ipa: 'k', frequency: 2500, formants: [300, 1500, 2500], duration: 80, voicing: false, amplitude: 0.4 }, // ka
  'ख': { ipa: 'kʰ', frequency: 2500, formants: [300, 1500, 2500], duration: 100, voicing: false, amplitude: 0.4 }, // kha
  'ग': { ipa: 'ɡ', frequency: 120, formants: [300, 1500, 2500], duration: 70, voicing: true, amplitude: 0.5 }, // ga
  'घ': { ipa: 'ɡʱ', frequency: 120, formants: [300, 1500, 2500], duration: 90, voicing: true, amplitude: 0.5 }, // gha
  'ङ': { ipa: 'ŋ', frequency: 120, formants: [280, 1300, 2200], duration: 100, voicing: true, amplitude: 0.6 }, // nga

  'च': { ipa: 'tʃ', frequency: 3000, formants: [200, 1600, 2600], duration: 90, voicing: false, amplitude: 0.4 }, // cha
  'छ': { ipa: 'tʃʰ', frequency: 3000, formants: [200, 1600, 2600], duration: 110, voicing: false, amplitude: 0.4 }, // chha
  'ज': { ipa: 'dʒ', frequency: 150, formants: [300, 1600, 2600], duration: 80, voicing: true, amplitude: 0.5 }, // ja
  'झ': { ipa: 'dʒʱ', frequency: 150, formants: [300, 1600, 2600], duration: 100, voicing: true, amplitude: 0.5 }, // jha
  'ञ': { ipa: 'ɲ', frequency: 150, formants: [280, 1700, 2600], duration: 100, voicing: true, amplitude: 0.6 }, // nya

  'ट': { ipa: 'ʈ', frequency: 3500, formants: [300, 1700, 2600], duration: 80, voicing: false, amplitude: 0.4 }, // Ta
  'ठ': { ipa: 'ʈʰ', frequency: 3500, formants: [300, 1700, 2600], duration: 100, voicing: false, amplitude: 0.4 }, // Tha
  'ड': { ipa: 'ɖ', frequency: 150, formants: [300, 1700, 2600], duration: 70, voicing: true, amplitude: 0.5 }, // Da
  'ढ': { ipa: 'ɖʱ', frequency: 150, formants: [300, 1700, 2600], duration: 90, voicing: true, amplitude: 0.5 }, // Dha
  'ण': { ipa: 'ɳ', frequency: 150, formants: [280, 1500, 2400], duration: 100, voicing: true, amplitude: 0.6 }, // Na

  'त': { ipa: 't̪', frequency: 3000, formants: [300, 1700, 2600], duration: 70, voicing: false, amplitude: 0.4 }, // ta
  'थ': { ipa: 't̪ʰ', frequency: 3000, formants: [300, 1700, 2600], duration: 90, voicing: false, amplitude: 0.4 }, // tha
  'द': { ipa: 'd̪', frequency: 150, formants: [300, 1700, 2600], duration: 60, voicing: true, amplitude: 0.5 }, // da
  'ध': { ipa: 'd̪ʱ', frequency: 150, formants: [300, 1700, 2600], duration: 80, voicing: true, amplitude: 0.5 }, // dha
  'न': { ipa: 'n̪', frequency: 150, formants: [280, 1700, 2600], duration: 90, voicing: true, amplitude: 0.6 }, // na

  'प': { ipa: 'p', frequency: 2000, formants: [300, 870, 2240], duration: 80, voicing: false, amplitude: 0.4 }, // pa
  'फ': { ipa: 'pʰ', frequency: 2000, formants: [300, 870, 2240], duration: 100, voicing: false, amplitude: 0.4 }, // pha
  'ब': { ipa: 'b', frequency: 80, formants: [300, 870, 2240], duration: 60, voicing: true, amplitude: 0.5 }, // ba
  'भ': { ipa: 'bʱ', frequency: 80, formants: [300, 870, 2240], duration: 80, voicing: true, amplitude: 0.5 }, // bha
  'म': { ipa: 'm', frequency: 120, formants: [280, 900, 2200], duration: 100, voicing: true, amplitude: 0.6 }, // ma

  // Fricatives (घर्षणी)
  'य': { ipa: 'j', frequency: 120, formants: [270, 2290, 3010], duration: 90, voicing: true, amplitude: 0.6 }, // ya
  'र': { ipa: 'r', frequency: 120, formants: [490, 1350, 1690], duration: 80, voicing: true, amplitude: 0.6 }, // ra
  'ल': { ipa: 'l', frequency: 150, formants: [360, 750, 2400], duration: 90, voicing: true, amplitude: 0.6 }, // la
  'व': { ipa: 'ʋ', frequency: 120, formants: [300, 610, 2200], duration: 90, voicing: true, amplitude: 0.6 }, // wa
  'श': { ipa: 'ʃ', frequency: 4000, formants: [1800, 2300, 2800], duration: 100, voicing: false, amplitude: 0.3 }, // sha
  'ष': { ipa: 'ʂ', frequency: 3500, formants: [1600, 2100, 2700], duration: 100, voicing: false, amplitude: 0.3 }, // Sha
  'स': { ipa: 's', frequency: 7000, formants: [1400, 2300, 2900], duration: 100, voicing: false, amplitude: 0.3 }, // sa
  'ह': { ipa: 'ɦ', frequency: 1500, formants: [500, 1500, 2500], duration: 80, voicing: true, amplitude: 0.3 }, // ha

  // Special characters
  'ं': { ipa: '̃', frequency: 120, formants: [280, 1300, 2200], duration: 50, voicing: true, amplitude: 0.4 }, // anusvara
  'ः': { ipa: 'h', frequency: 2000, formants: [500, 1500, 2500], duration: 60, voicing: false, amplitude: 0.2 }, // visarga
  '्': { ipa: '', frequency: 0, formants: [0, 0, 0], duration: 0, voicing: false, amplitude: 0 }, // halant (silence)
};

// Text to phoneme conversion mappings
export const englishTextToPhonemes: Record<string, string[]> = {
  // Common words
  'hello': ['HH', 'AH', 'L', 'OW'],
  'world': ['W', 'ER', 'L', 'D'],
  'how': ['HH', 'AW'],
  'are': ['AA', 'R'],
  'you': ['Y', 'UW'],
  'good': ['G', 'UH', 'D'],
  'morning': ['M', 'AO', 'R', 'N', 'IH', 'NG'],
  'evening': ['IY', 'V', 'N', 'IH', 'NG'],
  'night': ['N', 'AY', 'T'],
  'thank': ['TH', 'AE', 'NG', 'K'],
  'thanks': ['TH', 'AE', 'NG', 'K', 'S'],
  'please': ['P', 'L', 'IY', 'Z'],
  'welcome': ['W', 'EH', 'L', 'K', 'AH', 'M'],
  'yes': ['Y', 'EH', 'S'],
  'no': ['N', 'OW'],
  'what': ['W', 'AH', 'T'],
  'when': ['W', 'EH', 'N'],
  'where': ['W', 'EH', 'R'],
  'why': ['W', 'AY'],
  'who': ['HH', 'UW'],
  'which': ['W', 'IH', 'CH'],
  'nice': ['N', 'AY', 'S'],
  'great': ['G', 'R', 'EY', 'T'],
  'beautiful': ['B', 'Y', 'UW', 'T', 'AH', 'F', 'AH', 'L'],
  'wonderful': ['W', 'AH', 'N', 'D', 'ER', 'F', 'AH', 'L'],
};

export const hindiTextToPhonemes: Record<string, string[]> = {
  // Common Hindi words with Devanagari
  'नमस्ते': ['न', 'म', 'स', '्', 'त', 'े'],
  'नमस्कार': ['न', 'म', 'स', '्', 'क', 'ा', 'र'],
  'आप': ['आ', 'प'],
  'कैसे': ['क', 'ै', 'स', 'े'],
  'हैं': ['ह', 'ै', 'ं'],
  'अच्छा': ['अ', 'च', '्', 'छ', 'ा'],
  'बहुत': ['ब', 'ह', 'ु', 'त'],
  'धन्यवाद': ['ध', 'न', '्', 'य', 'व', 'ा', 'द'],
  'शुक्रिया': ['श', 'ु', 'क', '्', 'र', 'ि', 'य', 'ा'],
  'हाँ': ['ह', 'ा', 'ँ'],
  'नहीं': ['न', 'ह', 'ी', 'ं'],
  'क्या': ['क', '्', 'य', 'ा'],
  'कब': ['क', 'ब'],
  'कहाँ': ['क', 'ह', 'ा', 'ँ'],
  'क्यों': ['क', '्', 'य', 'ो', 'ं'],
  'कौन': ['क', 'ौ', 'न'],
  'कोई': ['क', 'ो', 'ई'],
  'सुंदर': ['स', 'ु', 'ं', 'द', 'र'],
  'अच्छी': ['अ', 'च', '्', 'छ', 'ी'],
  'प्यारा': ['प', '्', 'य', 'ा', 'र', 'ा'],
  'खुश': ['ख', 'ु', 'श'],
  'खुशी': ['ख', 'ु', 'श', 'ी'],
  'प्रेम': ['प', '्', 'र', 'े', 'म'],
  'प्यार': ['प', '्', 'य', 'ा', 'र'],
  'दोस्त': ['द', 'ो', 'स', '्', 'त'],
  'मित्र': ['म', 'ि', 'त', '्', 'र'],
  'परिवार': ['प', 'र', 'ि', 'व', 'ा', 'र'],
};

// Helper function to detect language
export const detectLanguage = (text: string): 'hindi' | 'english' => {
  const hindiPattern = /[\u0900-\u097F]/;
  return hindiPattern.test(text) ? 'hindi' : 'english';
};

// Convert text to phonemes based on language
export const textToPhonemes = (text: string): { phoneme: string; data: PhonemeData }[] => {
  const language = detectLanguage(text);
  const words = text.toLowerCase().trim().split(/\s+/);
  const result: { phoneme: string; data: PhonemeData }[] = [];

  for (const word of words) {
    if (language === 'hindi') {
      // For Hindi, convert each character to phonemes
      const characters = Array.from(word);
      for (const char of characters) {
        if (hindiPhonemes[char]) {
          result.push({ phoneme: char, data: hindiPhonemes[char] });
        } else if (hindiTextToPhonemes[word]) {
          // Use word-level mapping if available
          for (const phoneme of hindiTextToPhonemes[word]) {
            if (hindiPhonemes[phoneme]) {
              result.push({ phoneme, data: hindiPhonemes[phoneme] });
            }
          }
          break;
        }
      }
    } else {
      // For English, use word mappings or basic character conversion
      if (englishTextToPhonemes[word]) {
        for (const phoneme of englishTextToPhonemes[word]) {
          if (englishPhonemes[phoneme]) {
            result.push({ phoneme, data: englishPhonemes[phoneme] });
          }
        }
      } else {
        // Basic character-to-phoneme conversion for unknown English words
        const chars = word.split('');
        for (const char of chars) {
          const upperChar = char.toUpperCase();
          if (englishPhonemes[upperChar]) {
            result.push({ phoneme: upperChar, data: englishPhonemes[upperChar] });
          }
        }
      }
    }

    // Add pause between words
    result.push({
      phoneme: 'PAUSE',
      data: { ipa: '', frequency: 0, formants: [0, 0, 0], duration: 100, voicing: false, amplitude: 0 }
    });
  }

  return result;
};