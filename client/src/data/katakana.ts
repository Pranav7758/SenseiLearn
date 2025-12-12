export interface KanaCharacter {
  character: string;
  romaji: string;
  row: string;
  strokeOrder?: string[];
}

export const katakanaRows = [
  'vowels',
  'k-row',
  's-row',
  't-row',
  'n-row',
  'h-row',
  'm-row',
  'y-row',
  'r-row',
  'w-row',
  'n',
] as const;

export const katakana: KanaCharacter[] = [
  { character: 'ア', romaji: 'a', row: 'vowels' },
  { character: 'イ', romaji: 'i', row: 'vowels' },
  { character: 'ウ', romaji: 'u', row: 'vowels' },
  { character: 'エ', romaji: 'e', row: 'vowels' },
  { character: 'オ', romaji: 'o', row: 'vowels' },
  
  { character: 'カ', romaji: 'ka', row: 'k-row' },
  { character: 'キ', romaji: 'ki', row: 'k-row' },
  { character: 'ク', romaji: 'ku', row: 'k-row' },
  { character: 'ケ', romaji: 'ke', row: 'k-row' },
  { character: 'コ', romaji: 'ko', row: 'k-row' },
  
  { character: 'サ', romaji: 'sa', row: 's-row' },
  { character: 'シ', romaji: 'shi', row: 's-row' },
  { character: 'ス', romaji: 'su', row: 's-row' },
  { character: 'セ', romaji: 'se', row: 's-row' },
  { character: 'ソ', romaji: 'so', row: 's-row' },
  
  { character: 'タ', romaji: 'ta', row: 't-row' },
  { character: 'チ', romaji: 'chi', row: 't-row' },
  { character: 'ツ', romaji: 'tsu', row: 't-row' },
  { character: 'テ', romaji: 'te', row: 't-row' },
  { character: 'ト', romaji: 'to', row: 't-row' },
  
  { character: 'ナ', romaji: 'na', row: 'n-row' },
  { character: 'ニ', romaji: 'ni', row: 'n-row' },
  { character: 'ヌ', romaji: 'nu', row: 'n-row' },
  { character: 'ネ', romaji: 'ne', row: 'n-row' },
  { character: 'ノ', romaji: 'no', row: 'n-row' },
  
  { character: 'ハ', romaji: 'ha', row: 'h-row' },
  { character: 'ヒ', romaji: 'hi', row: 'h-row' },
  { character: 'フ', romaji: 'fu', row: 'h-row' },
  { character: 'ヘ', romaji: 'he', row: 'h-row' },
  { character: 'ホ', romaji: 'ho', row: 'h-row' },
  
  { character: 'マ', romaji: 'ma', row: 'm-row' },
  { character: 'ミ', romaji: 'mi', row: 'm-row' },
  { character: 'ム', romaji: 'mu', row: 'm-row' },
  { character: 'メ', romaji: 'me', row: 'm-row' },
  { character: 'モ', romaji: 'mo', row: 'm-row' },
  
  { character: 'ヤ', romaji: 'ya', row: 'y-row' },
  { character: 'ユ', romaji: 'yu', row: 'y-row' },
  { character: 'ヨ', romaji: 'yo', row: 'y-row' },
  
  { character: 'ラ', romaji: 'ra', row: 'r-row' },
  { character: 'リ', romaji: 'ri', row: 'r-row' },
  { character: 'ル', romaji: 'ru', row: 'r-row' },
  { character: 'レ', romaji: 're', row: 'r-row' },
  { character: 'ロ', romaji: 'ro', row: 'r-row' },
  
  { character: 'ワ', romaji: 'wa', row: 'w-row' },
  { character: 'ヲ', romaji: 'wo', row: 'w-row' },
  
  { character: 'ン', romaji: 'n', row: 'n' },
];

export const katakanaDakuten: KanaCharacter[] = [
  { character: 'ガ', romaji: 'ga', row: 'g-row' },
  { character: 'ギ', romaji: 'gi', row: 'g-row' },
  { character: 'グ', romaji: 'gu', row: 'g-row' },
  { character: 'ゲ', romaji: 'ge', row: 'g-row' },
  { character: 'ゴ', romaji: 'go', row: 'g-row' },
  
  { character: 'ザ', romaji: 'za', row: 'z-row' },
  { character: 'ジ', romaji: 'ji', row: 'z-row' },
  { character: 'ズ', romaji: 'zu', row: 'z-row' },
  { character: 'ゼ', romaji: 'ze', row: 'z-row' },
  { character: 'ゾ', romaji: 'zo', row: 'z-row' },
  
  { character: 'ダ', romaji: 'da', row: 'd-row' },
  { character: 'ヂ', romaji: 'ji', row: 'd-row' },
  { character: 'ヅ', romaji: 'zu', row: 'd-row' },
  { character: 'デ', romaji: 'de', row: 'd-row' },
  { character: 'ド', romaji: 'do', row: 'd-row' },
  
  { character: 'バ', romaji: 'ba', row: 'b-row' },
  { character: 'ビ', romaji: 'bi', row: 'b-row' },
  { character: 'ブ', romaji: 'bu', row: 'b-row' },
  { character: 'ベ', romaji: 'be', row: 'b-row' },
  { character: 'ボ', romaji: 'bo', row: 'b-row' },
  
  { character: 'パ', romaji: 'pa', row: 'p-row' },
  { character: 'ピ', romaji: 'pi', row: 'p-row' },
  { character: 'プ', romaji: 'pu', row: 'p-row' },
  { character: 'ペ', romaji: 'pe', row: 'p-row' },
  { character: 'ポ', romaji: 'po', row: 'p-row' },
];

export const allKatakana = [...katakana, ...katakanaDakuten];
