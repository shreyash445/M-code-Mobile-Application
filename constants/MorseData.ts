export const MORSE_CODE: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
  '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.', ' ': '/'
};

export const REVERSE_MORSE_CODE: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_CODE).map(([key, value]) => [value, key])
);

export const LETTERS_ONLY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export const NUMBERS_ONLY = '0123456789'.split('');
export const SYMBOLS_ONLY = ['.', ',', '?', "'", '!', '/', '(', ')', '&', ':', ';', '=', '+', '-', '_', '"', '$', '@'];

export const LETTERS_TREE_DATA = {
  char: '',
  dot: {
    char: 'E',
    dot: {
      char: 'I',
      dot: { char: 'S', dot: { char: 'H' }, dash: { char: 'V' } },
      dash: { char: 'U', dot: { char: 'F' } }
    },
    dash: {
      char: 'A',
      dot: { char: 'R', dot: { char: 'L' } },
      dash: { char: 'W', dot: { char: 'P' }, dash: { char: 'J' } }
    }
  },
  dash: {
    char: 'T',
    dot: {
      char: 'N',
      dot: { char: 'D', dot: { char: 'B' }, dash: { char: 'X' } },
      dash: { char: 'K', dot: { char: 'C' }, dash: { char: 'Y' } }
    },
    dash: {
      char: 'M',
      dot: { char: 'G', dot: { char: 'Z' }, dash: { char: 'Q' } },
      dash: { char: 'O' }
    }
  }
};

export const THEME = {
  primary: '#d4a040',
  primaryActive: '#e8b850',
  primaryPale: '#2a2218',
  primaryGlow: 'rgba(212, 160, 64, 0.15)',
  ink: '#e8dcc8',
  inkDeep: '#0a0d14',
  body: '#a09884',
  mute: '#5a5244',
  canvas: '#0a0d14',
  canvasSoft: '#141823',
  canvasWarm: '#1a1510',
  positive: '#2a9d8f',
  positiveDeep: '#1a6b62',
  warning: '#d4872a',
  warningDeep: '#8a5218',
  negative: '#c0392b',
  negativeDeep: '#8a281e',
  negativeBg: '#2a1410',
  brassLight: '#f0d080',
  copper: '#b87333',
  signalGlow: '#e8a030',
};
