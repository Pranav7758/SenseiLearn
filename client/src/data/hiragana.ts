export interface KanaCharacter {
  character: string;
  romaji: string;
  row: string;
  strokeOrder?: string[];
}

export const hiraganaRows = [
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

export const hiragana: KanaCharacter[] = [
  { character: 'あ', romaji: 'a', row: 'vowels' },
  { character: 'い', romaji: 'i', row: 'vowels' },
  { character: 'う', romaji: 'u', row: 'vowels' },
  { character: 'え', romaji: 'e', row: 'vowels' },
  { character: 'お', romaji: 'o', row: 'vowels' },
  
  { character: 'か', romaji: 'ka', row: 'k-row' },
  { character: 'き', romaji: 'ki', row: 'k-row' },
  { character: 'く', romaji: 'ku', row: 'k-row' },
  { character: 'け', romaji: 'ke', row: 'k-row' },
  { character: 'こ', romaji: 'ko', row: 'k-row' },
  
  { character: 'さ', romaji: 'sa', row: 's-row' },
  { character: 'し', romaji: 'shi', row: 's-row' },
  { character: 'す', romaji: 'su', row: 's-row' },
  { character: 'せ', romaji: 'se', row: 's-row' },
  { character: 'そ', romaji: 'so', row: 's-row' },
  
  { character: 'た', romaji: 'ta', row: 't-row' },
  { character: 'ち', romaji: 'chi', row: 't-row' },
  { character: 'つ', romaji: 'tsu', row: 't-row' },
  { character: 'て', romaji: 'te', row: 't-row' },
  { character: 'と', romaji: 'to', row: 't-row' },
  
  { character: 'な', romaji: 'na', row: 'n-row' },
  { character: 'に', romaji: 'ni', row: 'n-row' },
  { character: 'ぬ', romaji: 'nu', row: 'n-row' },
  { character: 'ね', romaji: 'ne', row: 'n-row' },
  { character: 'の', romaji: 'no', row: 'n-row' },
  
  { character: 'は', romaji: 'ha', row: 'h-row' },
  { character: 'ひ', romaji: 'hi', row: 'h-row' },
  { character: 'ふ', romaji: 'fu', row: 'h-row' },
  { character: 'へ', romaji: 'he', row: 'h-row' },
  { character: 'ほ', romaji: 'ho', row: 'h-row' },
  
  { character: 'ま', romaji: 'ma', row: 'm-row' },
  { character: 'み', romaji: 'mi', row: 'm-row' },
  { character: 'む', romaji: 'mu', row: 'm-row' },
  { character: 'め', romaji: 'me', row: 'm-row' },
  { character: 'も', romaji: 'mo', row: 'm-row' },
  
  { character: 'や', romaji: 'ya', row: 'y-row' },
  { character: 'ゆ', romaji: 'yu', row: 'y-row' },
  { character: 'よ', romaji: 'yo', row: 'y-row' },
  
  { character: 'ら', romaji: 'ra', row: 'r-row' },
  { character: 'り', romaji: 'ri', row: 'r-row' },
  { character: 'る', romaji: 'ru', row: 'r-row' },
  { character: 'れ', romaji: 're', row: 'r-row' },
  { character: 'ろ', romaji: 'ro', row: 'r-row' },
  
  { character: 'わ', romaji: 'wa', row: 'w-row' },
  { character: 'を', romaji: 'wo', row: 'w-row' },
  
  { character: 'ん', romaji: 'n', row: 'n' },
];

export const hiraganaDakuten: KanaCharacter[] = [
  { character: 'が', romaji: 'ga', row: 'g-row' },
  { character: 'ぎ', romaji: 'gi', row: 'g-row' },
  { character: 'ぐ', romaji: 'gu', row: 'g-row' },
  { character: 'げ', romaji: 'ge', row: 'g-row' },
  { character: 'ご', romaji: 'go', row: 'g-row' },
  
  { character: 'ざ', romaji: 'za', row: 'z-row' },
  { character: 'じ', romaji: 'ji', row: 'z-row' },
  { character: 'ず', romaji: 'zu', row: 'z-row' },
  { character: 'ぜ', romaji: 'ze', row: 'z-row' },
  { character: 'ぞ', romaji: 'zo', row: 'z-row' },
  
  { character: 'だ', romaji: 'da', row: 'd-row' },
  { character: 'ぢ', romaji: 'ji', row: 'd-row' },
  { character: 'づ', romaji: 'zu', row: 'd-row' },
  { character: 'で', romaji: 'de', row: 'd-row' },
  { character: 'ど', romaji: 'do', row: 'd-row' },
  
  { character: 'ば', romaji: 'ba', row: 'b-row' },
  { character: 'び', romaji: 'bi', row: 'b-row' },
  { character: 'ぶ', romaji: 'bu', row: 'b-row' },
  { character: 'べ', romaji: 'be', row: 'b-row' },
  { character: 'ぼ', romaji: 'bo', row: 'b-row' },
  
  { character: 'ぱ', romaji: 'pa', row: 'p-row' },
  { character: 'ぴ', romaji: 'pi', row: 'p-row' },
  { character: 'ぷ', romaji: 'pu', row: 'p-row' },
  { character: 'ぺ', romaji: 'pe', row: 'p-row' },
  { character: 'ぽ', romaji: 'po', row: 'p-row' },
];

export const allHiragana = [...hiragana, ...hiraganaDakuten];
