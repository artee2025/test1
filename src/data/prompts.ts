export const morningQuestions = [
  {
    id: 'q1',
    prompt: 'What would you do with your life if money, status, and others\' opinions were completely irrelevant?',
  },
  {
    id: 'q2',
    prompt: 'What have you been avoiding that you know, deep down, you need to face?',
  },
  {
    id: 'q3',
    prompt: 'What are you doing daily that you know is pulling you further from the life you want?',
  },
  {
    id: 'q4',
    prompt: 'When was the last time you felt truly alive? What were you doing?',
  },
  {
    id: 'q5',
    prompt: 'What beliefs about yourself are you defending that may not even be true?',
  },
  {
    id: 'q6',
    prompt: 'What would the person you want to become do today — right now?',
  },
  {
    id: 'q7',
    prompt: 'What goals are you pursuing because someone else decided they were important?',
  },
  {
    id: 'q8',
    prompt: 'If you stripped away every role you play — employee, partner, child — who is left?',
  },
  {
    id: 'q9',
    prompt: 'What is the one thing you\'re most afraid of others finding out about you?',
  },
  {
    id: 'q10',
    prompt: 'Where in your life are you choosing comfort over growth?',
  },
  {
    id: 'q11',
    prompt: 'What would you attempt if you knew the process itself would be enjoyable, regardless of outcome?',
  },
];

export const antiVisionPrompts = [
  {
    id: 'av-5yr',
    prompt: 'Imagine it\'s 5 years from now and absolutely nothing has changed. Describe an average Tuesday.\n\nWhere do you wake up? What does your body feel like? What\'s the first thing you think about? Who\'s around you? What do you do between 9 AM and 6 PM? How do you feel at 10 PM?',
  },
  {
    id: 'av-10yr',
    prompt: 'Now stretch it to 10 years of the same pattern.\n\nWhat have you missed? What opportunities closed? Who gave up on you? What do people say about you when you\'re not in the room?',
  },
  {
    id: 'av-end',
    prompt: 'You\'re at the end of your life. You lived the safe version. You never broke the pattern.\n\nWhat was the cost? What words would you use to describe that life?',
  },
];

export const visionPrompts = [
  {
    id: 'v-5yr',
    prompt: 'Now imagine the opposite. 5 years from now, you\'ve made the shift.\n\nDescribe that same Tuesday. Where do you wake up? What does your morning look like? What work are you doing? How does your body feel? Who are you surrounded by?',
  },
  {
    id: 'v-10yr',
    prompt: '10 years of building on that momentum.\n\nWhat have you created? What do people come to you for? What problems have you solved? What does freedom feel like?',
  },
  {
    id: 'v-end',
    prompt: 'End of your life — but this time you went all in.\n\nWhat are you most proud of? What would you tell your younger self? What legacy did you leave?',
  },
];

export const compressionPrompts = {
  antiVision: 'Write a single sentence that captures the life you refuse to let happen. It should make you feel something when you read it.',
  vision: 'Write a single sentence that captures what you\'re building toward. This is your north star — it will evolve as you do.',
  yearGoal: 'What would have to be true in one year for you to know you\'ve broken the old pattern? Be specific.',
};

export const interruptCheckpoints = [
  {
    id: 'c1',
    time: '11:00',
    label: '11:00 AM',
    questions: [
      'What am I avoiding right now?',
      'Is this action moving me toward my vision or my anti-vision?',
      'What would the person I\'m becoming do right now?',
    ],
  },
  {
    id: 'c2',
    time: '13:30',
    label: '1:30 PM',
    questions: [
      'Am I on autopilot or am I conscious?',
      'What unconscious goal am I pursuing right now?',
      'What story am I telling myself about why I can\'t change?',
    ],
  },
  {
    id: 'c3',
    time: '15:15',
    label: '3:15 PM',
    questions: [
      'Where am I choosing comfort over growth right now?',
      'What would make this hour count?',
      'Am I defending an identity that no longer serves me?',
    ],
  },
  {
    id: 'c4',
    time: '17:00',
    label: '5:00 PM',
    questions: [
      'Did I move the needle today, or just stay busy?',
      'What pattern did I repeat today that I promised I\'d break?',
      'What is one thing I can still do before tonight that matters?',
    ],
  },
  {
    id: 'c5',
    time: '19:30',
    label: '7:30 PM',
    questions: [
      'What did I learn about myself today?',
      'Where did I feel resistance — and what was behind it?',
      'Am I proud of how I spent this day?',
    ],
  },
  {
    id: 'c6',
    time: '21:00',
    label: '9:00 PM',
    questions: [
      'What feels most true right now?',
      'What do I need to let go of to move forward?',
      'What will I do differently tomorrow?',
    ],
  },
];

export const eveningPrompts = [
  {
    id: 'e1',
    prompt: 'What feels most true about why you\'ve been stuck? Don\'t censor yourself — write the raw, uncomfortable answer.',
  },
  {
    id: 'e2',
    prompt: 'What is the actual enemy? Not circumstances, not other people — what inside you keeps the pattern alive?',
  },
  {
    id: 'e3',
    prompt: 'What one thing, if you committed to it fully and eliminated all distractions, would change everything?',
  },
  {
    id: 'e4',
    prompt: 'Looking at today\'s excavation and interruptions — what is the single most important insight you uncovered?',
  },
];

export const gameLabels = {
  stakes: { title: 'STAKES', subtitle: 'What\'s at stake if you lose', icon: '💀' },
  endgame: { title: 'ENDGAME', subtitle: 'How you win', icon: '🏆' },
  mission: { title: 'THE MISSION', subtitle: 'Your 1-year sole priority', icon: '🎯' },
  bossFight: { title: 'BOSS FIGHT', subtitle: '1-month project — gain XP & level up', icon: '⚔️' },
  quests: { title: 'DAILY QUESTS', subtitle: 'The actions that compound', icon: '📋' },
  rules: { title: 'THE RULES', subtitle: 'Constraints that breed creativity', icon: '🛡️' },
};
