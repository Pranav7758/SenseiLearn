export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export interface VocabularyWord {
  id: string;
  word: string;
  reading: string;
  romaji: string;
  meaning: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'particle' | 'expression' | 'counter' | 'pronoun' | 'conjunction';
  jlpt: JLPTLevel;
  category?: string;
  example?: {
    japanese: string;
    reading: string;
    english: string;
  };
}

export const vocabularyN5: VocabularyWord[] = [
  // Greetings & Common Expressions
  { id: 'n5-1', word: 'おはよう', reading: 'おはよう', romaji: 'ohayou', meaning: 'good morning (casual)', partOfSpeech: 'expression', jlpt: 'N5', category: 'greetings' },
  { id: 'n5-2', word: 'おはようございます', reading: 'おはようございます', romaji: 'ohayou gozaimasu', meaning: 'good morning (polite)', partOfSpeech: 'expression', jlpt: 'N5', category: 'greetings' },
  { id: 'n5-3', word: 'こんにちは', reading: 'こんにちは', romaji: 'konnichiwa', meaning: 'hello, good afternoon', partOfSpeech: 'expression', jlpt: 'N5', category: 'greetings' },
  { id: 'n5-4', word: 'こんばんは', reading: 'こんばんは', romaji: 'konbanwa', meaning: 'good evening', partOfSpeech: 'expression', jlpt: 'N5', category: 'greetings' },
  { id: 'n5-5', word: 'さようなら', reading: 'さようなら', romaji: 'sayounara', meaning: 'goodbye', partOfSpeech: 'expression', jlpt: 'N5', category: 'greetings' },
  { id: 'n5-6', word: 'ありがとう', reading: 'ありがとう', romaji: 'arigatou', meaning: 'thank you (casual)', partOfSpeech: 'expression', jlpt: 'N5', category: 'greetings' },
  { id: 'n5-7', word: 'ありがとうございます', reading: 'ありがとうございます', romaji: 'arigatou gozaimasu', meaning: 'thank you (polite)', partOfSpeech: 'expression', jlpt: 'N5', category: 'greetings' },
  { id: 'n5-8', word: 'すみません', reading: 'すみません', romaji: 'sumimasen', meaning: 'excuse me, sorry', partOfSpeech: 'expression', jlpt: 'N5', category: 'greetings' },
  { id: 'n5-9', word: 'ごめんなさい', reading: 'ごめんなさい', romaji: 'gomen nasai', meaning: 'I am sorry', partOfSpeech: 'expression', jlpt: 'N5', category: 'greetings' },
  { id: 'n5-10', word: 'はい', reading: 'はい', romaji: 'hai', meaning: 'yes', partOfSpeech: 'expression', jlpt: 'N5', category: 'greetings' },
  { id: 'n5-11', word: 'いいえ', reading: 'いいえ', romaji: 'iie', meaning: 'no', partOfSpeech: 'expression', jlpt: 'N5', category: 'greetings' },
  { id: 'n5-12', word: 'お願いします', reading: 'おねがいします', romaji: 'onegaishimasu', meaning: 'please', partOfSpeech: 'expression', jlpt: 'N5', category: 'greetings' },
  
  // Numbers
  { id: 'n5-13', word: '一', reading: 'いち', romaji: 'ichi', meaning: 'one', partOfSpeech: 'noun', jlpt: 'N5', category: 'numbers' },
  { id: 'n5-14', word: '二', reading: 'に', romaji: 'ni', meaning: 'two', partOfSpeech: 'noun', jlpt: 'N5', category: 'numbers' },
  { id: 'n5-15', word: '三', reading: 'さん', romaji: 'san', meaning: 'three', partOfSpeech: 'noun', jlpt: 'N5', category: 'numbers' },
  { id: 'n5-16', word: '四', reading: 'よん/し', romaji: 'yon/shi', meaning: 'four', partOfSpeech: 'noun', jlpt: 'N5', category: 'numbers' },
  { id: 'n5-17', word: '五', reading: 'ご', romaji: 'go', meaning: 'five', partOfSpeech: 'noun', jlpt: 'N5', category: 'numbers' },
  { id: 'n5-18', word: '六', reading: 'ろく', romaji: 'roku', meaning: 'six', partOfSpeech: 'noun', jlpt: 'N5', category: 'numbers' },
  { id: 'n5-19', word: '七', reading: 'なな/しち', romaji: 'nana/shichi', meaning: 'seven', partOfSpeech: 'noun', jlpt: 'N5', category: 'numbers' },
  { id: 'n5-20', word: '八', reading: 'はち', romaji: 'hachi', meaning: 'eight', partOfSpeech: 'noun', jlpt: 'N5', category: 'numbers' },
  { id: 'n5-21', word: '九', reading: 'きゅう/く', romaji: 'kyuu/ku', meaning: 'nine', partOfSpeech: 'noun', jlpt: 'N5', category: 'numbers' },
  { id: 'n5-22', word: '十', reading: 'じゅう', romaji: 'juu', meaning: 'ten', partOfSpeech: 'noun', jlpt: 'N5', category: 'numbers' },
  { id: 'n5-23', word: '百', reading: 'ひゃく', romaji: 'hyaku', meaning: 'hundred', partOfSpeech: 'noun', jlpt: 'N5', category: 'numbers' },
  { id: 'n5-24', word: '千', reading: 'せん', romaji: 'sen', meaning: 'thousand', partOfSpeech: 'noun', jlpt: 'N5', category: 'numbers' },
  { id: 'n5-25', word: '万', reading: 'まん', romaji: 'man', meaning: 'ten thousand', partOfSpeech: 'noun', jlpt: 'N5', category: 'numbers' },
  
  // Time
  { id: 'n5-26', word: '今日', reading: 'きょう', romaji: 'kyou', meaning: 'today', partOfSpeech: 'noun', jlpt: 'N5', category: 'time' },
  { id: 'n5-27', word: '明日', reading: 'あした', romaji: 'ashita', meaning: 'tomorrow', partOfSpeech: 'noun', jlpt: 'N5', category: 'time' },
  { id: 'n5-28', word: '昨日', reading: 'きのう', romaji: 'kinou', meaning: 'yesterday', partOfSpeech: 'noun', jlpt: 'N5', category: 'time' },
  { id: 'n5-29', word: '今', reading: 'いま', romaji: 'ima', meaning: 'now', partOfSpeech: 'noun', jlpt: 'N5', category: 'time' },
  { id: 'n5-30', word: '朝', reading: 'あさ', romaji: 'asa', meaning: 'morning', partOfSpeech: 'noun', jlpt: 'N5', category: 'time' },
  { id: 'n5-31', word: '昼', reading: 'ひる', romaji: 'hiru', meaning: 'noon, daytime', partOfSpeech: 'noun', jlpt: 'N5', category: 'time' },
  { id: 'n5-32', word: '夜', reading: 'よる', romaji: 'yoru', meaning: 'night, evening', partOfSpeech: 'noun', jlpt: 'N5', category: 'time' },
  { id: 'n5-33', word: '午前', reading: 'ごぜん', romaji: 'gozen', meaning: 'morning, AM', partOfSpeech: 'noun', jlpt: 'N5', category: 'time' },
  { id: 'n5-34', word: '午後', reading: 'ごご', romaji: 'gogo', meaning: 'afternoon, PM', partOfSpeech: 'noun', jlpt: 'N5', category: 'time' },
  { id: 'n5-35', word: '時', reading: 'じ', romaji: 'ji', meaning: 'hour, o\'clock', partOfSpeech: 'counter', jlpt: 'N5', category: 'time' },
  { id: 'n5-36', word: '分', reading: 'ふん/ぷん', romaji: 'fun/pun', meaning: 'minute', partOfSpeech: 'counter', jlpt: 'N5', category: 'time' },
  { id: 'n5-37', word: '週', reading: 'しゅう', romaji: 'shuu', meaning: 'week', partOfSpeech: 'noun', jlpt: 'N5', category: 'time' },
  { id: 'n5-38', word: '月', reading: 'つき/げつ', romaji: 'tsuki/getsu', meaning: 'month, moon', partOfSpeech: 'noun', jlpt: 'N5', category: 'time' },
  { id: 'n5-39', word: '年', reading: 'とし/ねん', romaji: 'toshi/nen', meaning: 'year', partOfSpeech: 'noun', jlpt: 'N5', category: 'time' },
  
  // Days of the week
  { id: 'n5-40', word: '日曜日', reading: 'にちようび', romaji: 'nichiyoubi', meaning: 'Sunday', partOfSpeech: 'noun', jlpt: 'N5', category: 'time' },
  { id: 'n5-41', word: '月曜日', reading: 'げつようび', romaji: 'getsuyoubi', meaning: 'Monday', partOfSpeech: 'noun', jlpt: 'N5', category: 'time' },
  { id: 'n5-42', word: '火曜日', reading: 'かようび', romaji: 'kayoubi', meaning: 'Tuesday', partOfSpeech: 'noun', jlpt: 'N5', category: 'time' },
  { id: 'n5-43', word: '水曜日', reading: 'すいようび', romaji: 'suiyoubi', meaning: 'Wednesday', partOfSpeech: 'noun', jlpt: 'N5', category: 'time' },
  { id: 'n5-44', word: '木曜日', reading: 'もくようび', romaji: 'mokuyoubi', meaning: 'Thursday', partOfSpeech: 'noun', jlpt: 'N5', category: 'time' },
  { id: 'n5-45', word: '金曜日', reading: 'きんようび', romaji: 'kinyoubi', meaning: 'Friday', partOfSpeech: 'noun', jlpt: 'N5', category: 'time' },
  { id: 'n5-46', word: '土曜日', reading: 'どようび', romaji: 'doyoubi', meaning: 'Saturday', partOfSpeech: 'noun', jlpt: 'N5', category: 'time' },
  
  // People
  { id: 'n5-47', word: '私', reading: 'わたし', romaji: 'watashi', meaning: 'I, me', partOfSpeech: 'pronoun', jlpt: 'N5', category: 'people' },
  { id: 'n5-48', word: 'あなた', reading: 'あなた', romaji: 'anata', meaning: 'you', partOfSpeech: 'pronoun', jlpt: 'N5', category: 'people' },
  { id: 'n5-49', word: '彼', reading: 'かれ', romaji: 'kare', meaning: 'he, boyfriend', partOfSpeech: 'pronoun', jlpt: 'N5', category: 'people' },
  { id: 'n5-50', word: '彼女', reading: 'かのじょ', romaji: 'kanojo', meaning: 'she, girlfriend', partOfSpeech: 'pronoun', jlpt: 'N5', category: 'people' },
  { id: 'n5-51', word: '人', reading: 'ひと', romaji: 'hito', meaning: 'person', partOfSpeech: 'noun', jlpt: 'N5', category: 'people' },
  { id: 'n5-52', word: '男', reading: 'おとこ', romaji: 'otoko', meaning: 'man, male', partOfSpeech: 'noun', jlpt: 'N5', category: 'people' },
  { id: 'n5-53', word: '女', reading: 'おんな', romaji: 'onna', meaning: 'woman, female', partOfSpeech: 'noun', jlpt: 'N5', category: 'people' },
  { id: 'n5-54', word: '子供', reading: 'こども', romaji: 'kodomo', meaning: 'child', partOfSpeech: 'noun', jlpt: 'N5', category: 'people' },
  { id: 'n5-55', word: '友達', reading: 'ともだち', romaji: 'tomodachi', meaning: 'friend', partOfSpeech: 'noun', jlpt: 'N5', category: 'people' },
  { id: 'n5-56', word: '先生', reading: 'せんせい', romaji: 'sensei', meaning: 'teacher', partOfSpeech: 'noun', jlpt: 'N5', category: 'people' },
  { id: 'n5-57', word: '学生', reading: 'がくせい', romaji: 'gakusei', meaning: 'student', partOfSpeech: 'noun', jlpt: 'N5', category: 'people' },
  { id: 'n5-58', word: '家族', reading: 'かぞく', romaji: 'kazoku', meaning: 'family', partOfSpeech: 'noun', jlpt: 'N5', category: 'people' },
  { id: 'n5-59', word: '父', reading: 'ちち', romaji: 'chichi', meaning: 'father (humble)', partOfSpeech: 'noun', jlpt: 'N5', category: 'people' },
  { id: 'n5-60', word: '母', reading: 'はは', romaji: 'haha', meaning: 'mother (humble)', partOfSpeech: 'noun', jlpt: 'N5', category: 'people' },
  { id: 'n5-61', word: 'お父さん', reading: 'おとうさん', romaji: 'otousan', meaning: 'father (polite)', partOfSpeech: 'noun', jlpt: 'N5', category: 'people' },
  { id: 'n5-62', word: 'お母さん', reading: 'おかあさん', romaji: 'okaasan', meaning: 'mother (polite)', partOfSpeech: 'noun', jlpt: 'N5', category: 'people' },
  { id: 'n5-63', word: '兄', reading: 'あに', romaji: 'ani', meaning: 'older brother (humble)', partOfSpeech: 'noun', jlpt: 'N5', category: 'people' },
  { id: 'n5-64', word: '姉', reading: 'あね', romaji: 'ane', meaning: 'older sister (humble)', partOfSpeech: 'noun', jlpt: 'N5', category: 'people' },
  { id: 'n5-65', word: '弟', reading: 'おとうと', romaji: 'otouto', meaning: 'younger brother', partOfSpeech: 'noun', jlpt: 'N5', category: 'people' },
  { id: 'n5-66', word: '妹', reading: 'いもうと', romaji: 'imouto', meaning: 'younger sister', partOfSpeech: 'noun', jlpt: 'N5', category: 'people' },
  
  // Places
  { id: 'n5-67', word: '家', reading: 'いえ/うち', romaji: 'ie/uchi', meaning: 'house, home', partOfSpeech: 'noun', jlpt: 'N5', category: 'places' },
  { id: 'n5-68', word: '学校', reading: 'がっこう', romaji: 'gakkou', meaning: 'school', partOfSpeech: 'noun', jlpt: 'N5', category: 'places' },
  { id: 'n5-69', word: '大学', reading: 'だいがく', romaji: 'daigaku', meaning: 'university', partOfSpeech: 'noun', jlpt: 'N5', category: 'places' },
  { id: 'n5-70', word: '会社', reading: 'かいしゃ', romaji: 'kaisha', meaning: 'company', partOfSpeech: 'noun', jlpt: 'N5', category: 'places' },
  { id: 'n5-71', word: '病院', reading: 'びょういん', romaji: 'byouin', meaning: 'hospital', partOfSpeech: 'noun', jlpt: 'N5', category: 'places' },
  { id: 'n5-72', word: '銀行', reading: 'ぎんこう', romaji: 'ginkou', meaning: 'bank', partOfSpeech: 'noun', jlpt: 'N5', category: 'places' },
  { id: 'n5-73', word: '郵便局', reading: 'ゆうびんきょく', romaji: 'yuubinkyoku', meaning: 'post office', partOfSpeech: 'noun', jlpt: 'N5', category: 'places' },
  { id: 'n5-74', word: '駅', reading: 'えき', romaji: 'eki', meaning: 'station', partOfSpeech: 'noun', jlpt: 'N5', category: 'places' },
  { id: 'n5-75', word: '店', reading: 'みせ', romaji: 'mise', meaning: 'shop, store', partOfSpeech: 'noun', jlpt: 'N5', category: 'places' },
  { id: 'n5-76', word: 'レストラン', reading: 'れすとらん', romaji: 'resutoran', meaning: 'restaurant', partOfSpeech: 'noun', jlpt: 'N5', category: 'places' },
  { id: 'n5-77', word: '図書館', reading: 'としょかん', romaji: 'toshokan', meaning: 'library', partOfSpeech: 'noun', jlpt: 'N5', category: 'places' },
  { id: 'n5-78', word: '公園', reading: 'こうえん', romaji: 'kouen', meaning: 'park', partOfSpeech: 'noun', jlpt: 'N5', category: 'places' },
  { id: 'n5-79', word: '部屋', reading: 'へや', romaji: 'heya', meaning: 'room', partOfSpeech: 'noun', jlpt: 'N5', category: 'places' },
  { id: 'n5-80', word: 'トイレ', reading: 'といれ', romaji: 'toire', meaning: 'toilet, bathroom', partOfSpeech: 'noun', jlpt: 'N5', category: 'places' },
  
  // Common Verbs
  { id: 'n5-81', word: '行く', reading: 'いく', romaji: 'iku', meaning: 'to go', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-82', word: '来る', reading: 'くる', romaji: 'kuru', meaning: 'to come', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-83', word: '帰る', reading: 'かえる', romaji: 'kaeru', meaning: 'to return, go home', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-84', word: '食べる', reading: 'たべる', romaji: 'taberu', meaning: 'to eat', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-85', word: '飲む', reading: 'のむ', romaji: 'nomu', meaning: 'to drink', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-86', word: '見る', reading: 'みる', romaji: 'miru', meaning: 'to see, watch', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-87', word: '聞く', reading: 'きく', romaji: 'kiku', meaning: 'to listen, ask', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-88', word: '読む', reading: 'よむ', romaji: 'yomu', meaning: 'to read', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-89', word: '書く', reading: 'かく', romaji: 'kaku', meaning: 'to write', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-90', word: '話す', reading: 'はなす', romaji: 'hanasu', meaning: 'to speak', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-91', word: '言う', reading: 'いう', romaji: 'iu', meaning: 'to say', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-92', word: '買う', reading: 'かう', romaji: 'kau', meaning: 'to buy', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-93', word: '売る', reading: 'うる', romaji: 'uru', meaning: 'to sell', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-94', word: '会う', reading: 'あう', romaji: 'au', meaning: 'to meet', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-95', word: '待つ', reading: 'まつ', romaji: 'matsu', meaning: 'to wait', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-96', word: '立つ', reading: 'たつ', romaji: 'tatsu', meaning: 'to stand', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-97', word: '座る', reading: 'すわる', romaji: 'suwaru', meaning: 'to sit', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-98', word: '歩く', reading: 'あるく', romaji: 'aruku', meaning: 'to walk', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-99', word: '走る', reading: 'はしる', romaji: 'hashiru', meaning: 'to run', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-100', word: '泳ぐ', reading: 'およぐ', romaji: 'oyogu', meaning: 'to swim', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-101', word: '寝る', reading: 'ねる', romaji: 'neru', meaning: 'to sleep', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-102', word: '起きる', reading: 'おきる', romaji: 'okiru', meaning: 'to wake up, get up', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-103', word: '働く', reading: 'はたらく', romaji: 'hataraku', meaning: 'to work', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-104', word: '勉強する', reading: 'べんきょうする', romaji: 'benkyou suru', meaning: 'to study', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-105', word: '遊ぶ', reading: 'あそぶ', romaji: 'asobu', meaning: 'to play', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-106', word: '使う', reading: 'つかう', romaji: 'tsukau', meaning: 'to use', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-107', word: '作る', reading: 'つくる', romaji: 'tsukuru', meaning: 'to make, create', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-108', word: '開ける', reading: 'あける', romaji: 'akeru', meaning: 'to open', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-109', word: '閉める', reading: 'しめる', romaji: 'shimeru', meaning: 'to close', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-110', word: '入る', reading: 'はいる', romaji: 'hairu', meaning: 'to enter', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-111', word: '出る', reading: 'でる', romaji: 'deru', meaning: 'to exit, leave', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-112', word: 'ある', reading: 'ある', romaji: 'aru', meaning: 'to exist (inanimate)', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-113', word: 'いる', reading: 'いる', romaji: 'iru', meaning: 'to exist (animate)', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-114', word: 'する', reading: 'する', romaji: 'suru', meaning: 'to do', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  { id: 'n5-115', word: 'なる', reading: 'なる', romaji: 'naru', meaning: 'to become', partOfSpeech: 'verb', jlpt: 'N5', category: 'verbs' },
  
  // Adjectives
  { id: 'n5-116', word: '大きい', reading: 'おおきい', romaji: 'ookii', meaning: 'big, large', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-117', word: '小さい', reading: 'ちいさい', romaji: 'chiisai', meaning: 'small', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-118', word: '新しい', reading: 'あたらしい', romaji: 'atarashii', meaning: 'new', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-119', word: '古い', reading: 'ふるい', romaji: 'furui', meaning: 'old', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-120', word: '高い', reading: 'たかい', romaji: 'takai', meaning: 'tall, expensive', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-121', word: '安い', reading: 'やすい', romaji: 'yasui', meaning: 'cheap', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-122', word: '長い', reading: 'ながい', romaji: 'nagai', meaning: 'long', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-123', word: '短い', reading: 'みじかい', romaji: 'mijikai', meaning: 'short', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-124', word: '良い', reading: 'よい/いい', romaji: 'yoi/ii', meaning: 'good', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-125', word: '悪い', reading: 'わるい', romaji: 'warui', meaning: 'bad', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-126', word: '暑い', reading: 'あつい', romaji: 'atsui', meaning: 'hot (weather)', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-127', word: '寒い', reading: 'さむい', romaji: 'samui', meaning: 'cold (weather)', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-128', word: '熱い', reading: 'あつい', romaji: 'atsui', meaning: 'hot (to touch)', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-129', word: '冷たい', reading: 'つめたい', romaji: 'tsumetai', meaning: 'cold (to touch)', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-130', word: '忙しい', reading: 'いそがしい', romaji: 'isogashii', meaning: 'busy', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-131', word: '楽しい', reading: 'たのしい', romaji: 'tanoshii', meaning: 'fun, enjoyable', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-132', word: '嬉しい', reading: 'うれしい', romaji: 'ureshii', meaning: 'happy, glad', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-133', word: '難しい', reading: 'むずかしい', romaji: 'muzukashii', meaning: 'difficult', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-134', word: '易しい', reading: 'やさしい', romaji: 'yasashii', meaning: 'easy', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-135', word: '美味しい', reading: 'おいしい', romaji: 'oishii', meaning: 'delicious', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-136', word: '甘い', reading: 'あまい', romaji: 'amai', meaning: 'sweet', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-137', word: '辛い', reading: 'からい', romaji: 'karai', meaning: 'spicy', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-138', word: '明るい', reading: 'あかるい', romaji: 'akarui', meaning: 'bright', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-139', word: '暗い', reading: 'くらい', romaji: 'kurai', meaning: 'dark', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-140', word: '広い', reading: 'ひろい', romaji: 'hiroi', meaning: 'wide, spacious', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-141', word: '狭い', reading: 'せまい', romaji: 'semai', meaning: 'narrow', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-142', word: '多い', reading: 'おおい', romaji: 'ooi', meaning: 'many, much', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-143', word: '少ない', reading: 'すくない', romaji: 'sukunai', meaning: 'few, little', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-144', word: '早い', reading: 'はやい', romaji: 'hayai', meaning: 'early, fast', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-145', word: '遅い', reading: 'おそい', romaji: 'osoi', meaning: 'late, slow', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-146', word: '近い', reading: 'ちかい', romaji: 'chikai', meaning: 'near, close', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-147', word: '遠い', reading: 'とおい', romaji: 'tooi', meaning: 'far', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-148', word: '若い', reading: 'わかい', romaji: 'wakai', meaning: 'young', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-149', word: '白い', reading: 'しろい', romaji: 'shiroi', meaning: 'white', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-150', word: '黒い', reading: 'くろい', romaji: 'kuroi', meaning: 'black', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-151', word: '赤い', reading: 'あかい', romaji: 'akai', meaning: 'red', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  { id: 'n5-152', word: '青い', reading: 'あおい', romaji: 'aoi', meaning: 'blue', partOfSpeech: 'adjective', jlpt: 'N5', category: 'adjectives' },
  
  // Food & Drink
  { id: 'n5-153', word: 'ご飯', reading: 'ごはん', romaji: 'gohan', meaning: 'rice, meal', partOfSpeech: 'noun', jlpt: 'N5', category: 'food' },
  { id: 'n5-154', word: 'パン', reading: 'ぱん', romaji: 'pan', meaning: 'bread', partOfSpeech: 'noun', jlpt: 'N5', category: 'food' },
  { id: 'n5-155', word: '肉', reading: 'にく', romaji: 'niku', meaning: 'meat', partOfSpeech: 'noun', jlpt: 'N5', category: 'food' },
  { id: 'n5-156', word: '魚', reading: 'さかな', romaji: 'sakana', meaning: 'fish', partOfSpeech: 'noun', jlpt: 'N5', category: 'food' },
  { id: 'n5-157', word: '野菜', reading: 'やさい', romaji: 'yasai', meaning: 'vegetables', partOfSpeech: 'noun', jlpt: 'N5', category: 'food' },
  { id: 'n5-158', word: '果物', reading: 'くだもの', romaji: 'kudamono', meaning: 'fruit', partOfSpeech: 'noun', jlpt: 'N5', category: 'food' },
  { id: 'n5-159', word: '卵', reading: 'たまご', romaji: 'tamago', meaning: 'egg', partOfSpeech: 'noun', jlpt: 'N5', category: 'food' },
  { id: 'n5-160', word: '水', reading: 'みず', romaji: 'mizu', meaning: 'water', partOfSpeech: 'noun', jlpt: 'N5', category: 'food' },
  { id: 'n5-161', word: 'お茶', reading: 'おちゃ', romaji: 'ocha', meaning: 'tea', partOfSpeech: 'noun', jlpt: 'N5', category: 'food' },
  { id: 'n5-162', word: 'コーヒー', reading: 'こーひー', romaji: 'koohii', meaning: 'coffee', partOfSpeech: 'noun', jlpt: 'N5', category: 'food' },
  { id: 'n5-163', word: '牛乳', reading: 'ぎゅうにゅう', romaji: 'gyuunyuu', meaning: 'milk', partOfSpeech: 'noun', jlpt: 'N5', category: 'food' },
  { id: 'n5-164', word: 'お酒', reading: 'おさけ', romaji: 'osake', meaning: 'alcohol, sake', partOfSpeech: 'noun', jlpt: 'N5', category: 'food' },
  { id: 'n5-165', word: '朝ご飯', reading: 'あさごはん', romaji: 'asagohan', meaning: 'breakfast', partOfSpeech: 'noun', jlpt: 'N5', category: 'food' },
  { id: 'n5-166', word: '昼ご飯', reading: 'ひるごはん', romaji: 'hirugohan', meaning: 'lunch', partOfSpeech: 'noun', jlpt: 'N5', category: 'food' },
  { id: 'n5-167', word: '晩ご飯', reading: 'ばんごはん', romaji: 'bangohan', meaning: 'dinner', partOfSpeech: 'noun', jlpt: 'N5', category: 'food' },
  
  // Objects
  { id: 'n5-168', word: '本', reading: 'ほん', romaji: 'hon', meaning: 'book', partOfSpeech: 'noun', jlpt: 'N5', category: 'objects' },
  { id: 'n5-169', word: 'ノート', reading: 'のーと', romaji: 'nooto', meaning: 'notebook', partOfSpeech: 'noun', jlpt: 'N5', category: 'objects' },
  { id: 'n5-170', word: '鉛筆', reading: 'えんぴつ', romaji: 'enpitsu', meaning: 'pencil', partOfSpeech: 'noun', jlpt: 'N5', category: 'objects' },
  { id: 'n5-171', word: 'ペン', reading: 'ぺん', romaji: 'pen', meaning: 'pen', partOfSpeech: 'noun', jlpt: 'N5', category: 'objects' },
  { id: 'n5-172', word: '机', reading: 'つくえ', romaji: 'tsukue', meaning: 'desk', partOfSpeech: 'noun', jlpt: 'N5', category: 'objects' },
  { id: 'n5-173', word: '椅子', reading: 'いす', romaji: 'isu', meaning: 'chair', partOfSpeech: 'noun', jlpt: 'N5', category: 'objects' },
  { id: 'n5-174', word: '窓', reading: 'まど', romaji: 'mado', meaning: 'window', partOfSpeech: 'noun', jlpt: 'N5', category: 'objects' },
  { id: 'n5-175', word: 'ドア', reading: 'どあ', romaji: 'doa', meaning: 'door', partOfSpeech: 'noun', jlpt: 'N5', category: 'objects' },
  { id: 'n5-176', word: '電話', reading: 'でんわ', romaji: 'denwa', meaning: 'telephone', partOfSpeech: 'noun', jlpt: 'N5', category: 'objects' },
  { id: 'n5-177', word: '時計', reading: 'とけい', romaji: 'tokei', meaning: 'clock, watch', partOfSpeech: 'noun', jlpt: 'N5', category: 'objects' },
  { id: 'n5-178', word: '傘', reading: 'かさ', romaji: 'kasa', meaning: 'umbrella', partOfSpeech: 'noun', jlpt: 'N5', category: 'objects' },
  { id: 'n5-179', word: '鍵', reading: 'かぎ', romaji: 'kagi', meaning: 'key', partOfSpeech: 'noun', jlpt: 'N5', category: 'objects' },
  { id: 'n5-180', word: '財布', reading: 'さいふ', romaji: 'saifu', meaning: 'wallet', partOfSpeech: 'noun', jlpt: 'N5', category: 'objects' },
  { id: 'n5-181', word: 'カメラ', reading: 'かめら', romaji: 'kamera', meaning: 'camera', partOfSpeech: 'noun', jlpt: 'N5', category: 'objects' },
  { id: 'n5-182', word: '車', reading: 'くるま', romaji: 'kuruma', meaning: 'car', partOfSpeech: 'noun', jlpt: 'N5', category: 'objects' },
  { id: 'n5-183', word: '自転車', reading: 'じてんしゃ', romaji: 'jitensha', meaning: 'bicycle', partOfSpeech: 'noun', jlpt: 'N5', category: 'objects' },
  { id: 'n5-184', word: '電車', reading: 'でんしゃ', romaji: 'densha', meaning: 'train', partOfSpeech: 'noun', jlpt: 'N5', category: 'objects' },
  { id: 'n5-185', word: 'バス', reading: 'ばす', romaji: 'basu', meaning: 'bus', partOfSpeech: 'noun', jlpt: 'N5', category: 'objects' },
  { id: 'n5-186', word: '飛行機', reading: 'ひこうき', romaji: 'hikouki', meaning: 'airplane', partOfSpeech: 'noun', jlpt: 'N5', category: 'objects' },
  { id: 'n5-187', word: '服', reading: 'ふく', romaji: 'fuku', meaning: 'clothes', partOfSpeech: 'noun', jlpt: 'N5', category: 'objects' },
  { id: 'n5-188', word: '靴', reading: 'くつ', romaji: 'kutsu', meaning: 'shoes', partOfSpeech: 'noun', jlpt: 'N5', category: 'objects' },
  { id: 'n5-189', word: '帽子', reading: 'ぼうし', romaji: 'boushi', meaning: 'hat', partOfSpeech: 'noun', jlpt: 'N5', category: 'objects' },
  { id: 'n5-190', word: '眼鏡', reading: 'めがね', romaji: 'megane', meaning: 'glasses', partOfSpeech: 'noun', jlpt: 'N5', category: 'objects' },
  
  // Nature & Weather
  { id: 'n5-191', word: '天気', reading: 'てんき', romaji: 'tenki', meaning: 'weather', partOfSpeech: 'noun', jlpt: 'N5', category: 'nature' },
  { id: 'n5-192', word: '雨', reading: 'あめ', romaji: 'ame', meaning: 'rain', partOfSpeech: 'noun', jlpt: 'N5', category: 'nature' },
  { id: 'n5-193', word: '雪', reading: 'ゆき', romaji: 'yuki', meaning: 'snow', partOfSpeech: 'noun', jlpt: 'N5', category: 'nature' },
  { id: 'n5-194', word: '風', reading: 'かぜ', romaji: 'kaze', meaning: 'wind', partOfSpeech: 'noun', jlpt: 'N5', category: 'nature' },
  { id: 'n5-195', word: '空', reading: 'そら', romaji: 'sora', meaning: 'sky', partOfSpeech: 'noun', jlpt: 'N5', category: 'nature' },
  { id: 'n5-196', word: '山', reading: 'やま', romaji: 'yama', meaning: 'mountain', partOfSpeech: 'noun', jlpt: 'N5', category: 'nature' },
  { id: 'n5-197', word: '川', reading: 'かわ', romaji: 'kawa', meaning: 'river', partOfSpeech: 'noun', jlpt: 'N5', category: 'nature' },
  { id: 'n5-198', word: '海', reading: 'うみ', romaji: 'umi', meaning: 'sea, ocean', partOfSpeech: 'noun', jlpt: 'N5', category: 'nature' },
  { id: 'n5-199', word: '木', reading: 'き', romaji: 'ki', meaning: 'tree', partOfSpeech: 'noun', jlpt: 'N5', category: 'nature' },
  { id: 'n5-200', word: '花', reading: 'はな', romaji: 'hana', meaning: 'flower', partOfSpeech: 'noun', jlpt: 'N5', category: 'nature' },
];

export const vocabularyN4: VocabularyWord[] = [
  // Common Verbs
  { id: 'n4-1', word: '届ける', reading: 'とどける', romaji: 'todokeru', meaning: 'to deliver', partOfSpeech: 'verb', jlpt: 'N4', category: 'verbs' },
  { id: 'n4-2', word: '届く', reading: 'とどく', romaji: 'todoku', meaning: 'to arrive, reach', partOfSpeech: 'verb', jlpt: 'N4', category: 'verbs' },
  { id: 'n4-3', word: '決める', reading: 'きめる', romaji: 'kimeru', meaning: 'to decide', partOfSpeech: 'verb', jlpt: 'N4', category: 'verbs' },
  { id: 'n4-4', word: '決まる', reading: 'きまる', romaji: 'kimaru', meaning: 'to be decided', partOfSpeech: 'verb', jlpt: 'N4', category: 'verbs' },
  { id: 'n4-5', word: '変える', reading: 'かえる', romaji: 'kaeru', meaning: 'to change', partOfSpeech: 'verb', jlpt: 'N4', category: 'verbs' },
  { id: 'n4-6', word: '変わる', reading: 'かわる', romaji: 'kawaru', meaning: 'to change (intransitive)', partOfSpeech: 'verb', jlpt: 'N4', category: 'verbs' },
  { id: 'n4-7', word: '続ける', reading: 'つづける', romaji: 'tsuzukeru', meaning: 'to continue', partOfSpeech: 'verb', jlpt: 'N4', category: 'verbs' },
  { id: 'n4-8', word: '続く', reading: 'つづく', romaji: 'tsuzuku', meaning: 'to continue (intransitive)', partOfSpeech: 'verb', jlpt: 'N4', category: 'verbs' },
  { id: 'n4-9', word: '伝える', reading: 'つたえる', romaji: 'tsutaeru', meaning: 'to convey, tell', partOfSpeech: 'verb', jlpt: 'N4', category: 'verbs' },
  { id: 'n4-10', word: '集める', reading: 'あつめる', romaji: 'atsumeru', meaning: 'to collect', partOfSpeech: 'verb', jlpt: 'N4', category: 'verbs' },
  { id: 'n4-11', word: '集まる', reading: 'あつまる', romaji: 'atsumaru', meaning: 'to gather', partOfSpeech: 'verb', jlpt: 'N4', category: 'verbs' },
  { id: 'n4-12', word: '始める', reading: 'はじめる', romaji: 'hajimeru', meaning: 'to begin', partOfSpeech: 'verb', jlpt: 'N4', category: 'verbs' },
  { id: 'n4-13', word: '始まる', reading: 'はじまる', romaji: 'hajimaru', meaning: 'to begin (intransitive)', partOfSpeech: 'verb', jlpt: 'N4', category: 'verbs' },
  { id: 'n4-14', word: '終わる', reading: 'おわる', romaji: 'owaru', meaning: 'to end', partOfSpeech: 'verb', jlpt: 'N4', category: 'verbs' },
  { id: 'n4-15', word: '調べる', reading: 'しらべる', romaji: 'shiraberu', meaning: 'to investigate', partOfSpeech: 'verb', jlpt: 'N4', category: 'verbs' },
  { id: 'n4-16', word: '比べる', reading: 'くらべる', romaji: 'kuraberu', meaning: 'to compare', partOfSpeech: 'verb', jlpt: 'N4', category: 'verbs' },
  { id: 'n4-17', word: '育てる', reading: 'そだてる', romaji: 'sodateru', meaning: 'to raise, bring up', partOfSpeech: 'verb', jlpt: 'N4', category: 'verbs' },
  { id: 'n4-18', word: '育つ', reading: 'そだつ', romaji: 'sodatsu', meaning: 'to grow up', partOfSpeech: 'verb', jlpt: 'N4', category: 'verbs' },
  { id: 'n4-19', word: '壊す', reading: 'こわす', romaji: 'kowasu', meaning: 'to break', partOfSpeech: 'verb', jlpt: 'N4', category: 'verbs' },
  { id: 'n4-20', word: '壊れる', reading: 'こわれる', romaji: 'kowareru', meaning: 'to be broken', partOfSpeech: 'verb', jlpt: 'N4', category: 'verbs' },
  
  // Common Nouns
  { id: 'n4-21', word: '経験', reading: 'けいけん', romaji: 'keiken', meaning: 'experience', partOfSpeech: 'noun', jlpt: 'N4', category: 'abstract' },
  { id: 'n4-22', word: '習慣', reading: 'しゅうかん', romaji: 'shuukan', meaning: 'habit, custom', partOfSpeech: 'noun', jlpt: 'N4', category: 'abstract' },
  { id: 'n4-23', word: '趣味', reading: 'しゅみ', romaji: 'shumi', meaning: 'hobby', partOfSpeech: 'noun', jlpt: 'N4', category: 'abstract' },
  { id: 'n4-24', word: '意見', reading: 'いけん', romaji: 'iken', meaning: 'opinion', partOfSpeech: 'noun', jlpt: 'N4', category: 'abstract' },
  { id: 'n4-25', word: '理由', reading: 'りゆう', romaji: 'riyuu', meaning: 'reason', partOfSpeech: 'noun', jlpt: 'N4', category: 'abstract' },
  { id: 'n4-26', word: '目的', reading: 'もくてき', romaji: 'mokuteki', meaning: 'purpose, goal', partOfSpeech: 'noun', jlpt: 'N4', category: 'abstract' },
  { id: 'n4-27', word: '関係', reading: 'かんけい', romaji: 'kankei', meaning: 'relationship', partOfSpeech: 'noun', jlpt: 'N4', category: 'abstract' },
  { id: 'n4-28', word: '問題', reading: 'もんだい', romaji: 'mondai', meaning: 'problem, question', partOfSpeech: 'noun', jlpt: 'N4', category: 'abstract' },
  { id: 'n4-29', word: '答え', reading: 'こたえ', romaji: 'kotae', meaning: 'answer', partOfSpeech: 'noun', jlpt: 'N4', category: 'abstract' },
  { id: 'n4-30', word: '予定', reading: 'よてい', romaji: 'yotei', meaning: 'plan, schedule', partOfSpeech: 'noun', jlpt: 'N4', category: 'abstract' },
  { id: 'n4-31', word: '約束', reading: 'やくそく', romaji: 'yakusoku', meaning: 'promise', partOfSpeech: 'noun', jlpt: 'N4', category: 'abstract' },
  { id: 'n4-32', word: '連絡', reading: 'れんらく', romaji: 'renraku', meaning: 'contact', partOfSpeech: 'noun', jlpt: 'N4', category: 'abstract' },
  { id: 'n4-33', word: '準備', reading: 'じゅんび', romaji: 'junbi', meaning: 'preparation', partOfSpeech: 'noun', jlpt: 'N4', category: 'abstract' },
  { id: 'n4-34', word: '注意', reading: 'ちゅうい', romaji: 'chuui', meaning: 'attention, caution', partOfSpeech: 'noun', jlpt: 'N4', category: 'abstract' },
  { id: 'n4-35', word: '説明', reading: 'せつめい', romaji: 'setsumei', meaning: 'explanation', partOfSpeech: 'noun', jlpt: 'N4', category: 'abstract' },
  { id: 'n4-36', word: '紹介', reading: 'しょうかい', romaji: 'shoukai', meaning: 'introduction', partOfSpeech: 'noun', jlpt: 'N4', category: 'abstract' },
  { id: 'n4-37', word: '相談', reading: 'そうだん', romaji: 'soudan', meaning: 'consultation', partOfSpeech: 'noun', jlpt: 'N4', category: 'abstract' },
  { id: 'n4-38', word: '練習', reading: 'れんしゅう', romaji: 'renshuu', meaning: 'practice', partOfSpeech: 'noun', jlpt: 'N4', category: 'abstract' },
  { id: 'n4-39', word: '発表', reading: 'はっぴょう', romaji: 'happyou', meaning: 'presentation', partOfSpeech: 'noun', jlpt: 'N4', category: 'abstract' },
  { id: 'n4-40', word: '研究', reading: 'けんきゅう', romaji: 'kenkyuu', meaning: 'research', partOfSpeech: 'noun', jlpt: 'N4', category: 'abstract' },
  
  // Adjectives
  { id: 'n4-41', word: '便利', reading: 'べんり', romaji: 'benri', meaning: 'convenient', partOfSpeech: 'adjective', jlpt: 'N4', category: 'adjectives' },
  { id: 'n4-42', word: '不便', reading: 'ふべん', romaji: 'fuben', meaning: 'inconvenient', partOfSpeech: 'adjective', jlpt: 'N4', category: 'adjectives' },
  { id: 'n4-43', word: '必要', reading: 'ひつよう', romaji: 'hitsuyou', meaning: 'necessary', partOfSpeech: 'adjective', jlpt: 'N4', category: 'adjectives' },
  { id: 'n4-44', word: '大切', reading: 'たいせつ', romaji: 'taisetsu', meaning: 'important', partOfSpeech: 'adjective', jlpt: 'N4', category: 'adjectives' },
  { id: 'n4-45', word: '特別', reading: 'とくべつ', romaji: 'tokubetsu', meaning: 'special', partOfSpeech: 'adjective', jlpt: 'N4', category: 'adjectives' },
  { id: 'n4-46', word: '普通', reading: 'ふつう', romaji: 'futsuu', meaning: 'normal, ordinary', partOfSpeech: 'adjective', jlpt: 'N4', category: 'adjectives' },
  { id: 'n4-47', word: '危険', reading: 'きけん', romaji: 'kiken', meaning: 'dangerous', partOfSpeech: 'adjective', jlpt: 'N4', category: 'adjectives' },
  { id: 'n4-48', word: '安全', reading: 'あんぜん', romaji: 'anzen', meaning: 'safe', partOfSpeech: 'adjective', jlpt: 'N4', category: 'adjectives' },
  { id: 'n4-49', word: '複雑', reading: 'ふくざつ', romaji: 'fukuzatsu', meaning: 'complicated', partOfSpeech: 'adjective', jlpt: 'N4', category: 'adjectives' },
  { id: 'n4-50', word: '簡単', reading: 'かんたん', romaji: 'kantan', meaning: 'simple, easy', partOfSpeech: 'adjective', jlpt: 'N4', category: 'adjectives' },
];

export const vocabularyN3: VocabularyWord[] = [
  { id: 'n3-1', word: '影響', reading: 'えいきょう', romaji: 'eikyou', meaning: 'influence', partOfSpeech: 'noun', jlpt: 'N3', category: 'abstract' },
  { id: 'n3-2', word: '原因', reading: 'げんいん', romaji: 'genin', meaning: 'cause', partOfSpeech: 'noun', jlpt: 'N3', category: 'abstract' },
  { id: 'n3-3', word: '結果', reading: 'けっか', romaji: 'kekka', meaning: 'result', partOfSpeech: 'noun', jlpt: 'N3', category: 'abstract' },
  { id: 'n3-4', word: '状況', reading: 'じょうきょう', romaji: 'joukyou', meaning: 'situation', partOfSpeech: 'noun', jlpt: 'N3', category: 'abstract' },
  { id: 'n3-5', word: '状態', reading: 'じょうたい', romaji: 'joutai', meaning: 'condition, state', partOfSpeech: 'noun', jlpt: 'N3', category: 'abstract' },
  { id: 'n3-6', word: '傾向', reading: 'けいこう', romaji: 'keikou', meaning: 'tendency', partOfSpeech: 'noun', jlpt: 'N3', category: 'abstract' },
  { id: 'n3-7', word: '可能性', reading: 'かのうせい', romaji: 'kanousei', meaning: 'possibility', partOfSpeech: 'noun', jlpt: 'N3', category: 'abstract' },
  { id: 'n3-8', word: '責任', reading: 'せきにん', romaji: 'sekinin', meaning: 'responsibility', partOfSpeech: 'noun', jlpt: 'N3', category: 'abstract' },
  { id: 'n3-9', word: '価値', reading: 'かち', romaji: 'kachi', meaning: 'value', partOfSpeech: 'noun', jlpt: 'N3', category: 'abstract' },
  { id: 'n3-10', word: '効果', reading: 'こうか', romaji: 'kouka', meaning: 'effect', partOfSpeech: 'noun', jlpt: 'N3', category: 'abstract' },
  { id: 'n3-11', word: '認める', reading: 'みとめる', romaji: 'mitomeru', meaning: 'to recognize, admit', partOfSpeech: 'verb', jlpt: 'N3', category: 'verbs' },
  { id: 'n3-12', word: '求める', reading: 'もとめる', romaji: 'motomeru', meaning: 'to seek, demand', partOfSpeech: 'verb', jlpt: 'N3', category: 'verbs' },
  { id: 'n3-13', word: '含む', reading: 'ふくむ', romaji: 'fukumu', meaning: 'to include', partOfSpeech: 'verb', jlpt: 'N3', category: 'verbs' },
  { id: 'n3-14', word: '示す', reading: 'しめす', romaji: 'shimesu', meaning: 'to show, indicate', partOfSpeech: 'verb', jlpt: 'N3', category: 'verbs' },
  { id: 'n3-15', word: '得る', reading: 'える', romaji: 'eru', meaning: 'to obtain', partOfSpeech: 'verb', jlpt: 'N3', category: 'verbs' },
  { id: 'n3-16', word: '与える', reading: 'あたえる', romaji: 'ataeru', meaning: 'to give', partOfSpeech: 'verb', jlpt: 'N3', category: 'verbs' },
  { id: 'n3-17', word: '述べる', reading: 'のべる', romaji: 'noberu', meaning: 'to state', partOfSpeech: 'verb', jlpt: 'N3', category: 'verbs' },
  { id: 'n3-18', word: '挙げる', reading: 'あげる', romaji: 'ageru', meaning: 'to raise, cite', partOfSpeech: 'verb', jlpt: 'N3', category: 'verbs' },
  { id: 'n3-19', word: '基づく', reading: 'もとづく', romaji: 'motozuku', meaning: 'to be based on', partOfSpeech: 'verb', jlpt: 'N3', category: 'verbs' },
  { id: 'n3-20', word: '異なる', reading: 'ことなる', romaji: 'kotonaru', meaning: 'to differ', partOfSpeech: 'verb', jlpt: 'N3', category: 'verbs' },
  { id: 'n3-21', word: '適切', reading: 'てきせつ', romaji: 'tekisetsu', meaning: 'appropriate', partOfSpeech: 'adjective', jlpt: 'N3', category: 'adjectives' },
  { id: 'n3-22', word: '具体的', reading: 'ぐたいてき', romaji: 'gutaiteki', meaning: 'concrete, specific', partOfSpeech: 'adjective', jlpt: 'N3', category: 'adjectives' },
  { id: 'n3-23', word: '積極的', reading: 'せっきょくてき', romaji: 'sekkyokuteki', meaning: 'positive, active', partOfSpeech: 'adjective', jlpt: 'N3', category: 'adjectives' },
  { id: 'n3-24', word: '消極的', reading: 'しょうきょくてき', romaji: 'shoukyokuteki', meaning: 'passive, negative', partOfSpeech: 'adjective', jlpt: 'N3', category: 'adjectives' },
  { id: 'n3-25', word: '明確', reading: 'めいかく', romaji: 'meikaku', meaning: 'clear, definite', partOfSpeech: 'adjective', jlpt: 'N3', category: 'adjectives' },
];

export const vocabularyN2: VocabularyWord[] = [
  { id: 'n2-1', word: '概念', reading: 'がいねん', romaji: 'gainen', meaning: 'concept', partOfSpeech: 'noun', jlpt: 'N2', category: 'abstract' },
  { id: 'n2-2', word: '観点', reading: 'かんてん', romaji: 'kanten', meaning: 'viewpoint', partOfSpeech: 'noun', jlpt: 'N2', category: 'abstract' },
  { id: 'n2-3', word: '現象', reading: 'げんしょう', romaji: 'genshou', meaning: 'phenomenon', partOfSpeech: 'noun', jlpt: 'N2', category: 'abstract' },
  { id: 'n2-4', word: '根拠', reading: 'こんきょ', romaji: 'konkyo', meaning: 'basis, grounds', partOfSpeech: 'noun', jlpt: 'N2', category: 'abstract' },
  { id: 'n2-5', word: '仮説', reading: 'かせつ', romaji: 'kasetsu', meaning: 'hypothesis', partOfSpeech: 'noun', jlpt: 'N2', category: 'abstract' },
  { id: 'n2-6', word: '前提', reading: 'ぜんてい', romaji: 'zentei', meaning: 'premise', partOfSpeech: 'noun', jlpt: 'N2', category: 'abstract' },
  { id: 'n2-7', word: '矛盾', reading: 'むじゅん', romaji: 'mujun', meaning: 'contradiction', partOfSpeech: 'noun', jlpt: 'N2', category: 'abstract' },
  { id: 'n2-8', word: '妥協', reading: 'だきょう', romaji: 'dakyou', meaning: 'compromise', partOfSpeech: 'noun', jlpt: 'N2', category: 'abstract' },
  { id: 'n2-9', word: '葛藤', reading: 'かっとう', romaji: 'kattou', meaning: 'conflict', partOfSpeech: 'noun', jlpt: 'N2', category: 'abstract' },
  { id: 'n2-10', word: '克服', reading: 'こくふく', romaji: 'kokufuku', meaning: 'overcoming', partOfSpeech: 'noun', jlpt: 'N2', category: 'abstract' },
  { id: 'n2-11', word: '把握', reading: 'はあく', romaji: 'haaku', meaning: 'to grasp', partOfSpeech: 'verb', jlpt: 'N2', category: 'verbs' },
  { id: 'n2-12', word: '検討', reading: 'けんとう', romaji: 'kentou', meaning: 'to examine', partOfSpeech: 'verb', jlpt: 'N2', category: 'verbs' },
  { id: 'n2-13', word: '推測', reading: 'すいそく', romaji: 'suisoku', meaning: 'to guess', partOfSpeech: 'verb', jlpt: 'N2', category: 'verbs' },
  { id: 'n2-14', word: '主張', reading: 'しゅちょう', romaji: 'shuchou', meaning: 'to assert', partOfSpeech: 'verb', jlpt: 'N2', category: 'verbs' },
  { id: 'n2-15', word: '指摘', reading: 'してき', romaji: 'shiteki', meaning: 'to point out', partOfSpeech: 'verb', jlpt: 'N2', category: 'verbs' },
  { id: 'n2-16', word: '曖昧', reading: 'あいまい', romaji: 'aimai', meaning: 'vague, ambiguous', partOfSpeech: 'adjective', jlpt: 'N2', category: 'adjectives' },
  { id: 'n2-17', word: '顕著', reading: 'けんちょ', romaji: 'kencho', meaning: 'remarkable', partOfSpeech: 'adjective', jlpt: 'N2', category: 'adjectives' },
  { id: 'n2-18', word: '妥当', reading: 'だとう', romaji: 'datou', meaning: 'valid, proper', partOfSpeech: 'adjective', jlpt: 'N2', category: 'adjectives' },
  { id: 'n2-19', word: '不可欠', reading: 'ふかけつ', romaji: 'fukaketsu', meaning: 'indispensable', partOfSpeech: 'adjective', jlpt: 'N2', category: 'adjectives' },
  { id: 'n2-20', word: '著しい', reading: 'いちじるしい', romaji: 'ichijirushii', meaning: 'remarkable', partOfSpeech: 'adjective', jlpt: 'N2', category: 'adjectives' },
];

export const vocabularyN1: VocabularyWord[] = [
  { id: 'n1-1', word: '洞察', reading: 'どうさつ', romaji: 'dousatsu', meaning: 'insight', partOfSpeech: 'noun', jlpt: 'N1', category: 'abstract' },
  { id: 'n1-2', word: '懸念', reading: 'けねん', romaji: 'kenen', meaning: 'concern, apprehension', partOfSpeech: 'noun', jlpt: 'N1', category: 'abstract' },
  { id: 'n1-3', word: '帰結', reading: 'きけつ', romaji: 'kiketsu', meaning: 'consequence', partOfSpeech: 'noun', jlpt: 'N1', category: 'abstract' },
  { id: 'n1-4', word: '逆説', reading: 'ぎゃくせつ', romaji: 'gyakusetsu', meaning: 'paradox', partOfSpeech: 'noun', jlpt: 'N1', category: 'abstract' },
  { id: 'n1-5', word: '暗示', reading: 'あんじ', romaji: 'anji', meaning: 'hint, suggestion', partOfSpeech: 'noun', jlpt: 'N1', category: 'abstract' },
  { id: 'n1-6', word: '抽象', reading: 'ちゅうしょう', romaji: 'chuushou', meaning: 'abstraction', partOfSpeech: 'noun', jlpt: 'N1', category: 'abstract' },
  { id: 'n1-7', word: '含蓄', reading: 'がんちく', romaji: 'ganchiku', meaning: 'implication', partOfSpeech: 'noun', jlpt: 'N1', category: 'abstract' },
  { id: 'n1-8', word: '示唆', reading: 'しさ', romaji: 'shisa', meaning: 'suggestion, implication', partOfSpeech: 'noun', jlpt: 'N1', category: 'abstract' },
  { id: 'n1-9', word: '逸脱', reading: 'いつだつ', romaji: 'itsudatsu', meaning: 'deviation', partOfSpeech: 'noun', jlpt: 'N1', category: 'abstract' },
  { id: 'n1-10', word: '帰納', reading: 'きのう', romaji: 'kinou', meaning: 'induction', partOfSpeech: 'noun', jlpt: 'N1', category: 'abstract' },
  { id: 'n1-11', word: '看過', reading: 'かんか', romaji: 'kanka', meaning: 'to overlook', partOfSpeech: 'verb', jlpt: 'N1', category: 'verbs' },
  { id: 'n1-12', word: '糾弾', reading: 'きゅうだん', romaji: 'kyuudan', meaning: 'to denounce', partOfSpeech: 'verb', jlpt: 'N1', category: 'verbs' },
  { id: 'n1-13', word: '凌駕', reading: 'りょうが', romaji: 'ryouga', meaning: 'to surpass', partOfSpeech: 'verb', jlpt: 'N1', category: 'verbs' },
  { id: 'n1-14', word: '払拭', reading: 'ふっしょく', romaji: 'fusshoku', meaning: 'to wipe away', partOfSpeech: 'verb', jlpt: 'N1', category: 'verbs' },
  { id: 'n1-15', word: '醸成', reading: 'じょうせい', romaji: 'jousei', meaning: 'to brew, foster', partOfSpeech: 'verb', jlpt: 'N1', category: 'verbs' },
  { id: 'n1-16', word: '甚大', reading: 'じんだい', romaji: 'jindai', meaning: 'enormous', partOfSpeech: 'adjective', jlpt: 'N1', category: 'adjectives' },
  { id: 'n1-17', word: '膨大', reading: 'ぼうだい', romaji: 'boudai', meaning: 'enormous, vast', partOfSpeech: 'adjective', jlpt: 'N1', category: 'adjectives' },
  { id: 'n1-18', word: '微細', reading: 'びさい', romaji: 'bisai', meaning: 'minute, detailed', partOfSpeech: 'adjective', jlpt: 'N1', category: 'adjectives' },
  { id: 'n1-19', word: '稀有', reading: 'けう', romaji: 'keu', meaning: 'rare, uncommon', partOfSpeech: 'adjective', jlpt: 'N1', category: 'adjectives' },
  { id: 'n1-20', word: '円滑', reading: 'えんかつ', romaji: 'enkatsu', meaning: 'smooth, harmonious', partOfSpeech: 'adjective', jlpt: 'N1', category: 'adjectives' },
];

export const allVocabulary: Record<JLPTLevel, VocabularyWord[]> = {
  N5: vocabularyN5,
  N4: vocabularyN4,
  N3: vocabularyN3,
  N2: vocabularyN2,
  N1: vocabularyN1,
};

export const getVocabularyByLevel = (level: JLPTLevel): VocabularyWord[] => {
  return allVocabulary[level] || [];
};

export const getVocabularyCount = (level: JLPTLevel): number => {
  return allVocabulary[level]?.length || 0;
};

export const getAllVocabularyFlat = (): VocabularyWord[] => {
  return [...vocabularyN5, ...vocabularyN4, ...vocabularyN3, ...vocabularyN2, ...vocabularyN1];
};

export const getCategories = (level: JLPTLevel): string[] => {
  const words = getVocabularyByLevel(level);
  const categories = new Set(words.map(w => w.category).filter(Boolean));
  return Array.from(categories) as string[];
};
