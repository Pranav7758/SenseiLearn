export interface GrammarTopic {
  id: string;
  title: string;
  titleJp: string;
  explanation: string;
  examples: {
    japanese: string;
    romaji: string;
    english: string;
  }[];
  questions: GrammarQuestion[];
}

export interface GrammarQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-blank';
  question: string;
  questionJp?: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export const grammarTopics: GrammarTopic[] = [
  {
    id: 'particle-wa',
    title: 'Topic Marker は (wa)',
    titleJp: 'は',
    explanation: 'The particle は (pronounced "wa") marks the topic of a sentence. It tells the listener what the sentence is about.',
    examples: [
      { japanese: '私は学生です。', romaji: 'Watashi wa gakusei desu.', english: 'I am a student.' },
      { japanese: '田中さんは先生です。', romaji: 'Tanaka-san wa sensei desu.', english: 'Mr. Tanaka is a teacher.' },
      { japanese: '今日は暑いです。', romaji: 'Kyou wa atsui desu.', english: 'Today is hot.' },
    ],
    questions: [
      {
        id: 'wa-1',
        type: 'fill-blank',
        question: '私___学生です。(I am a student.)',
        correctAnswer: 'は',
        explanation: 'は marks "私" (I) as the topic of the sentence.',
      },
      {
        id: 'wa-2',
        type: 'multiple-choice',
        question: 'Which particle marks the topic of a sentence?',
        options: ['は', 'が', 'を', 'に'],
        correctAnswer: 'は',
        explanation: 'は is the topic marker particle.',
      },
    ],
  },
  {
    id: 'particle-ga',
    title: 'Subject Marker が (ga)',
    titleJp: 'が',
    explanation: 'The particle が marks the subject of a sentence, especially when introducing new information or emphasizing the subject.',
    examples: [
      { japanese: '猫がいます。', romaji: 'Neko ga imasu.', english: 'There is a cat.' },
      { japanese: '誰が来ましたか？', romaji: 'Dare ga kimashita ka?', english: 'Who came?' },
      { japanese: '私が田中です。', romaji: 'Watashi ga Tanaka desu.', english: 'I am Tanaka (emphasis).' },
    ],
    questions: [
      {
        id: 'ga-1',
        type: 'fill-blank',
        question: '猫___います。(There is a cat.)',
        correctAnswer: 'が',
        explanation: 'が marks the subject "猫" (cat) when stating existence.',
      },
      {
        id: 'ga-2',
        type: 'multiple-choice',
        question: 'Which particle is used to mark a subject, especially for new information?',
        options: ['は', 'が', 'を', 'で'],
        correctAnswer: 'が',
        explanation: 'が is used to introduce new information or emphasize the subject.',
      },
    ],
  },
  {
    id: 'particle-wo',
    title: 'Object Marker を (wo)',
    titleJp: 'を',
    explanation: 'The particle を (pronounced "o") marks the direct object of an action verb - the thing that receives the action.',
    examples: [
      { japanese: 'りんごを食べます。', romaji: 'Ringo wo tabemasu.', english: 'I eat an apple.' },
      { japanese: '本を読みます。', romaji: 'Hon wo yomimasu.', english: 'I read a book.' },
      { japanese: '音楽を聞きます。', romaji: 'Ongaku wo kikimasu.', english: 'I listen to music.' },
    ],
    questions: [
      {
        id: 'wo-1',
        type: 'fill-blank',
        question: 'りんご___食べます。(I eat an apple.)',
        correctAnswer: 'を',
        explanation: 'を marks "りんご" (apple) as the object being eaten.',
      },
      {
        id: 'wo-2',
        type: 'multiple-choice',
        question: 'Which particle marks the direct object of a verb?',
        options: ['は', 'が', 'を', 'に'],
        correctAnswer: 'を',
        explanation: 'を marks what receives the action of the verb.',
      },
    ],
  },
  {
    id: 'particle-ni',
    title: 'Location/Time Marker に (ni)',
    titleJp: 'に',
    explanation: 'The particle に indicates location of existence, destination, time, or indirect object.',
    examples: [
      { japanese: '学校に行きます。', romaji: 'Gakkou ni ikimasu.', english: 'I go to school.' },
      { japanese: '7時に起きます。', romaji: 'Shichi-ji ni okimasu.', english: 'I wake up at 7 o\'clock.' },
      { japanese: '東京に住んでいます。', romaji: 'Tokyo ni sunde imasu.', english: 'I live in Tokyo.' },
    ],
    questions: [
      {
        id: 'ni-1',
        type: 'fill-blank',
        question: '学校___行きます。(I go to school.)',
        correctAnswer: 'に',
        explanation: 'に marks "学校" (school) as the destination.',
      },
      {
        id: 'ni-2',
        type: 'multiple-choice',
        question: 'Which particle indicates time or destination?',
        options: ['は', 'で', 'に', 'を'],
        correctAnswer: 'に',
        explanation: 'に is used for time and destination.',
      },
    ],
  },
  {
    id: 'particle-de',
    title: 'Location of Action/Means で (de)',
    titleJp: 'で',
    explanation: 'The particle で indicates where an action takes place or the means/method of doing something.',
    examples: [
      { japanese: '学校で勉強します。', romaji: 'Gakkou de benkyou shimasu.', english: 'I study at school.' },
      { japanese: '電車で行きます。', romaji: 'Densha de ikimasu.', english: 'I go by train.' },
      { japanese: '日本語で話します。', romaji: 'Nihongo de hanashimasu.', english: 'I speak in Japanese.' },
    ],
    questions: [
      {
        id: 'de-1',
        type: 'fill-blank',
        question: '学校___勉強します。(I study at school.)',
        correctAnswer: 'で',
        explanation: 'で marks where the action of studying takes place.',
      },
      {
        id: 'de-2',
        type: 'multiple-choice',
        question: 'Which particle indicates the location where an action happens?',
        options: ['に', 'で', 'へ', 'を'],
        correctAnswer: 'で',
        explanation: 'で is used for location of action and means.',
      },
    ],
  },
  {
    id: 'demonstratives',
    title: 'Demonstratives: これ/それ/あれ',
    titleJp: 'これ・それ・あれ',
    explanation: 'これ (this) refers to things near the speaker. それ (that) refers to things near the listener. あれ (that over there) refers to things far from both.',
    examples: [
      { japanese: 'これは本です。', romaji: 'Kore wa hon desu.', english: 'This is a book.' },
      { japanese: 'それは何ですか？', romaji: 'Sore wa nan desu ka?', english: 'What is that (near you)?' },
      { japanese: 'あれは山です。', romaji: 'Are wa yama desu.', english: 'That (over there) is a mountain.' },
    ],
    questions: [
      {
        id: 'demo-1',
        type: 'multiple-choice',
        question: 'Which word means "this" (near the speaker)?',
        options: ['これ', 'それ', 'あれ', 'どれ'],
        correctAnswer: 'これ',
        explanation: 'これ refers to things near the speaker.',
      },
      {
        id: 'demo-2',
        type: 'multiple-choice',
        question: 'Which word refers to something far from both speaker and listener?',
        options: ['これ', 'それ', 'あれ', 'どれ'],
        correctAnswer: 'あれ',
        explanation: 'あれ is used for things far from both people.',
      },
    ],
  },
  {
    id: 'desu-masu',
    title: 'Polite Form: です/ます',
    titleJp: 'です・ます',
    explanation: 'です is the polite copula (is/am/are). ます is the polite verb ending. Both are used in formal and polite speech.',
    examples: [
      { japanese: '私は学生です。', romaji: 'Watashi wa gakusei desu.', english: 'I am a student.' },
      { japanese: '毎日日本語を勉強します。', romaji: 'Mainichi nihongo wo benkyou shimasu.', english: 'I study Japanese every day.' },
      { japanese: '明日行きます。', romaji: 'Ashita ikimasu.', english: 'I will go tomorrow.' },
    ],
    questions: [
      {
        id: 'desu-1',
        type: 'multiple-choice',
        question: 'Which is the polite copula meaning "is/am/are"?',
        options: ['です', 'ます', 'だ', 'ある'],
        correctAnswer: 'です',
        explanation: 'です is the polite form of the copula.',
      },
      {
        id: 'desu-2',
        type: 'fill-blank',
        question: '私は学生___。(I am a student.)',
        correctAnswer: 'です',
        explanation: 'です is used after nouns to mean "is/am".',
      },
    ],
  },
  {
    id: 'past-tense',
    title: 'Simple Past Tense',
    titleJp: '過去形',
    explanation: 'For polite form, です becomes でした, and ます becomes ました. This indicates past tense.',
    examples: [
      { japanese: '昨日は暑かったです。', romaji: 'Kinou wa atsukatta desu.', english: 'Yesterday was hot.' },
      { japanese: '本を読みました。', romaji: 'Hon wo yomimashita.', english: 'I read a book.' },
      { japanese: '学生でした。', romaji: 'Gakusei deshita.', english: 'I was a student.' },
    ],
    questions: [
      {
        id: 'past-1',
        type: 'multiple-choice',
        question: 'What is the past tense of ます?',
        options: ['ました', 'ません', 'ましょう', 'ませんでした'],
        correctAnswer: 'ました',
        explanation: 'ました is the polite past tense verb ending.',
      },
      {
        id: 'past-2',
        type: 'multiple-choice',
        question: 'What is the past tense of です?',
        options: ['でした', 'ではありません', 'だった', 'ではない'],
        correctAnswer: 'でした',
        explanation: 'でした is the polite past tense of です.',
      },
    ],
  },
  {
    id: 'negative',
    title: 'Simple Negative',
    titleJp: '否定形',
    explanation: 'For polite form, です becomes ではありません/じゃありません, and ます becomes ません.',
    examples: [
      { japanese: '私は先生ではありません。', romaji: 'Watashi wa sensei dewa arimasen.', english: 'I am not a teacher.' },
      { japanese: '今日は行きません。', romaji: 'Kyou wa ikimasen.', english: 'I will not go today.' },
      { japanese: '魚は食べません。', romaji: 'Sakana wa tabemasen.', english: 'I do not eat fish.' },
    ],
    questions: [
      {
        id: 'neg-1',
        type: 'multiple-choice',
        question: 'What is the negative form of ます?',
        options: ['ません', 'ました', 'ましょう', 'ませんでした'],
        correctAnswer: 'ません',
        explanation: 'ません is the polite negative verb ending.',
      },
      {
        id: 'neg-2',
        type: 'fill-blank',
        question: '私は先生では___。(I am not a teacher.)',
        correctAnswer: 'ありません',
        explanation: 'ではありません is the polite negative of です.',
      },
    ],
  },
];

export const allGrammarTopics = grammarTopics;
