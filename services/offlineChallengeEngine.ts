// Offline Challenge Engine — runs games completely without the Gemini API
// Smart responses that feel like a real AI tutor
import {
  OFFLINE_SENTENCE_SCRAMBLE, OFFLINE_MATH_PROBLEMS, OFFLINE_PATTERNS,
  OFFLINE_SYNONYMS, OFFLINE_RHYMES, OFFLINE_ODD_ONE_OUT, OFFLINE_SPELLING,
  OFFLINE_STORY_STARTERS, getRandomQuestions
} from '../data/offlineQuestions';

export type OfflineChallengeState = {
  challengeId: string;
  questionIndex: number;
  correctCount: number;
  questions: any[];
  storyTurns: number;
  waitingForStory: boolean;
  attempts: number; // how many times user tried current question
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Detect when user is confused, giving up, or asking for help
function isConfused(input: string): boolean {
  return /^(idk|i don'?t know|dont know|no idea|not sure|unsure|confused|help|hint|skip|pass|give up|i give up|tell me|what is it|what'?s the answer|show me|i'?m stuck|stuck|can'?t|cannot|nope|nah|hmm+|ugh|what\?*)$/i.test(input.trim());
}

function isSkipRequest(input: string): boolean {
  return /^(skip|next|pass|move on|next question|next one)$/i.test(input.trim());
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// AI-like encouraging phrases
const PRAISE = [
  "That's absolutely correct! 🎉 Well done!",
  "Excellent work! ✨ You nailed it!",
  "Brilliant! 🌟 That's exactly right!",
  "Perfect! 🏆 You're doing amazing!",
  "Fantastic! 🎯 Spot on!",
  "You got it! 🥳 Great thinking!",
  "Outstanding! 💫 Keep it up!",
];

const ENCOURAGEMENT = [
  "Don't worry, learning takes practice! Let me explain...",
  "That's okay! Even the best learners need help sometimes. Here's how to think about it...",
  "No problem at all! Let me walk you through this step by step...",
  "It's completely fine not to know — that's why we're here to learn! Let me help...",
  "Great question to ask for help! Here's the explanation...",
];

export function initOfflineChallenge(challengeId: string): OfflineChallengeState | null {
  const questions = getRandomQuestions(challengeId, challengeId === 'story-1' ? 1 : 5);
  if (!questions.length) return null;
  return { challengeId, questionIndex: 0, correctCount: 0, questions, storyTurns: 0, waitingForStory: false, attempts: 0 };
}

export function getOpeningMessage(state: OfflineChallengeState): string {
  const q = state.questions[0];
  switch (state.challengeId) {
    case 'scramble-1':
      return `🎉 Welcome to **Sentence Scramble**!\n\nI'll give you words that are all mixed up, and your job is to put them in the correct order to make a proper sentence.\n\nHere's your first one:\n\n**"${q.scrambled}"**\n\nType the words in the correct order! You can do it! 😊`;
    case 'math-1':
      return `🧙 Welcome to **Math Magician**!\n\nI'll give you fun math word problems to solve. Don't worry if you find them tricky — I'm here to help!\n\nHere's your first problem:\n\n${q.question}\n\nWhat's your answer?`;
    case 'pattern-1':
      return `🔢 Welcome to **Pattern Power**!\n\nI'll show you a sequence of numbers with one missing. Your job is to figure out the pattern and find the missing number!\n\nHere's your first sequence:\n\n**${q.sequence}**\n\nWhat number goes in the blank?`;
    case 'synonym-1':
      return `🔍 Welcome to **Synonym Hunt**!\n\nA synonym is a word that means the same thing as another word. For example, "happy" and "joyful" are synonyms!\n\nHere's your first word:\n\n**"${q.word}"**\n\nCan you think of a word that means the same thing?`;
    case 'rhyme-1':
      return `🎵 Welcome to **Rhyme Time**!\n\nTwo words rhyme when they have the same ending sound. Like "cat" and "hat" — they both end with the "at" sound!\n\nHere's your first word:\n\n**"${q.word}"**\n\nCan you think of a word that rhymes with it?`;
    case 'odd-one-out-1':
      return `💡 Welcome to **Odd One Out**!\n\nI'll show you 4 words. Three of them belong to the same group, but one doesn't fit. Your job is to find the one that doesn't belong!\n\nHere are your 4 words:\n\n**${q.words.join(', ')}**\n\nWhich one is the odd one out?`;
    case 'spelling-1':
      return `✏️ Welcome to **Spelling Squad**!\n\nI'll show you a sentence with one word that's spelled incorrectly. Your mission is to find that word and type the correct spelling!\n\nHere's your first sentence:\n\n*"${q.sentence}"*\n\nWhich word is misspelled? Type the correct spelling!`;
    case 'story-1':
      return `📖 Welcome to **Story Starter**!\n\nWe're going to write a story together! I'll write the first sentence, then you write the next one, and we'll take turns building an amazing story!\n\nHere's how our story begins:\n\n*"${q}"*\n\nNow it's your turn — what happens next? Write the next sentence of our story!`;
    default:
      return 'Welcome to the challenge!';
  }
}

// Generate a full AI-like explanation when user is confused
function getFullExplanation(challengeId: string, q: any): string {
  const enc = pick(ENCOURAGEMENT);
  switch (challengeId) {
    case 'scramble-1':
      return `${enc}\n\nThe words are: **${q.scrambled}**\n\nTo unscramble them, think about what makes sense as a sentence. A sentence usually starts with "The" or "A" and has a subject (who/what) and an action (what they do).\n\nThe correct sentence is: **"${q.answer}"**\n\nNow let's try the next one! You've got this! 💪`;
    case 'math-1':
      return `${enc}\n\n**${q.question}**\n\nLet me solve this step by step:\n- Read the problem carefully\n- Find the numbers: we're working with the quantities in the story\n- The answer is **${q.answer}**\n\nGreat — now you know! Let's move to the next problem! 🧙`;
    case 'pattern-1':
      return `${enc}\n\nThe sequence is: **${q.sequence}**\n\n**${q.hint}**\n\nSo the missing number is **${q.answer}**!\n\nThe trick with patterns is to look at the difference between each number. Ready for the next one? 🔢`;
    case 'synonym-1':
      return `${enc}\n\nThe word is **"${q.word}"**.\n\nA synonym is a word with the same meaning. Here are some synonyms for "${q.word}":\n${q.synonyms.map((s: string) => `• **${s}**`).join('\n')}\n\nAny of these would be correct! Let's try the next word! 🔍`;
    case 'rhyme-1':
      return `${enc}\n\nThe word is **"${q.word}"**.\n\nWords that rhyme with "${q.word}" include:\n${q.rhymes.map((r: string) => `• **${r}**`).join('\n')}\n\nRhyming words share the same ending sound! Ready for the next one? 🎵`;
    case 'odd-one-out-1':
      return `${enc}\n\nThe words are: **${q.words.join(', ')}**\n\nLet's think about what each word is:\n${q.words.map((w: string) => `• **${w}** — ${w === q.odd ? '(this is different!)' : '(fits the group)'}`).join('\n')}\n\nThe odd one out is **"${q.odd}"** because ${q.reason}.\n\nGreat learning moment! Next question! 💡`;
    case 'spelling-1':
      return `${enc}\n\nThe sentence is: *"${q.sentence}"*\n\nLook at the word **"${q.wrong}"** — it doesn't look quite right, does it?\n\nThe correct spelling is **"${q.correct}"**.\n\nA good trick: sound out the word slowly and think about which letters make each sound. Let's try the next one! ✏️`;
    default:
      return enc;
  }
}

export function processAnswer(state: OfflineChallengeState, userInput: string): {
  response: string;
  correct: boolean;
  points: number;
  complete: boolean;
  newState: OfflineChallengeState;
} {
  const q = state.questions[state.questionIndex];
  const input = userInput.trim().toLowerCase();
  let correct = false;
  let response = '';
  let points = 0;
  let complete = false;
  let newState = { ...state, attempts: state.attempts + 1 };

  // Story mode — always accept and continue
  if (state.challengeId === 'story-1') {
    newState.storyTurns += 1;
    if (newState.storyTurns >= 5) {
      response = `What a wonderful story we created together! 🌟\n\nYou have a fantastic imagination! Every sentence you wrote made the story more exciting. You should be really proud of yourself!\n\n**Our story is complete!** 🎊\n\n[CHALLENGE_COMPLETE:40]`;
      complete = true;
      points = 40;
    } else {
      const continuations = [
        "Suddenly, something completely unexpected happened...",
        "But then, a mysterious figure appeared from the shadows and whispered...",
        "Everyone gasped in amazement when they discovered that...",
        "The adventure took an exciting turn as they stumbled upon...",
        "Just when they thought everything was over, they realized...",
      ];
      const storyContinuation = continuations[newState.storyTurns - 1] || "And the story continued...";
      response = `I love that! 🎉 What a creative sentence!\n\nHere's what happens next in our story:\n\n*"${storyContinuation}"*\n\nYour turn again! Write the next sentence — what do you think happens? *(Turn ${newState.storyTurns}/5)*`;
    }
    return { response, correct: true, points, complete, newState };
  }

  // Handle confused/help/skip inputs with full AI-like explanation
  if (isConfused(input)) {
    const explanation = getFullExplanation(state.challengeId, q);
    // Move to next question after explaining
    newState.questionIndex += 1;
    newState.attempts = 0;
    if (newState.questionIndex >= newState.questions.length) {
      response = `${explanation}\n\n🎊 That was the last question! You completed the challenge by learning through it — that counts too! Keep practicing!\n\n[CHALLENGE_COMPLETE:25]`;
      complete = true;
      points = 25;
    } else {
      const nextQ = newState.questions[newState.questionIndex];
      response = `${explanation}\n\n---\n\nReady for the next one? Here it is:\n\n${getNextQuestion(state.challengeId, nextQ)} *(${newState.correctCount}/5)*`;
    }
    return { response, correct: false, points, complete, newState };
  }

  // Check answer
  switch (state.challengeId) {
    case 'scramble-1':
      correct = input.replace(/[^a-z0-9 ]/gi, '').toLowerCase() === q.answer.replace(/[^a-z0-9 ]/gi, '').toLowerCase();
      break;
    case 'math-1':
      correct = parseInt(input.replace(/[^0-9]/g, '')) === q.answer;
      break;
    case 'pattern-1':
      correct = parseInt(input.replace(/[^0-9]/g, '')) === q.answer;
      break;
    case 'synonym-1':
      correct = q.synonyms.some((s: string) => s.toLowerCase() === input);
      break;
    case 'rhyme-1':
      correct = q.rhymes.some((r: string) => r.toLowerCase() === input) ||
        (input.length >= 2 && q.word.toLowerCase().slice(-2) === input.slice(-2) && input !== q.word.toLowerCase());
      break;
    case 'odd-one-out-1':
      correct = input === q.odd.toLowerCase() || input.includes(q.odd.toLowerCase());
      break;
    case 'spelling-1':
      correct = input === q.correct.toLowerCase();
      break;
  }

  if (correct) {
    newState.correctCount += 1;
    newState.questionIndex += 1;
    newState.attempts = 0;
    const pointsMap: Record<string, number> = {
      'scramble-1': 15, 'math-1': 20, 'pattern-1': 15,
      'synonym-1': 10, 'rhyme-1': 10, 'odd-one-out-1': 10, 'spelling-1': 15
    };
    points = pointsMap[state.challengeId] || 10;

    if (newState.correctCount >= 5) {
      complete = true;
      response = `${pick(PRAISE)}\n\n🎊 **You completed the challenge!** You got all 5 correct!\n\nYou're absolutely brilliant! Keep up this amazing work — you're learning so fast! ⭐\n\n[CHALLENGE_COMPLETE:50]`;
    } else {
      const nextQ = newState.questions[newState.questionIndex];
      response = `${pick(PRAISE)}\n\n${getNextQuestion(state.challengeId, nextQ)} *(${newState.correctCount}/5 correct)*`;
    }
  } else {
    // After 2 wrong attempts, give a stronger hint
    if (newState.attempts >= 2) {
      const strongHint = getStrongHint(state.challengeId, q);
      response = `Almost there! 🤔 Let me give you a bigger hint:\n\n${strongHint}\n\nTry again — you're so close! Or type **"idk"** if you'd like me to explain the answer.`;
    } else {
      const hint = getHint(state.challengeId, q);
      response = `Not quite right! 😊 Don't worry, let me give you a hint:\n\n${hint}\n\nHave another go! You can do it! 💪`;
    }
  }

  return { response, correct, points, complete, newState };
}

function getNextQuestion(challengeId: string, q: any): string {
  switch (challengeId) {
    case 'scramble-1': return `Here's your next scrambled sentence:\n\n**"${q.scrambled}"**\n\nPut the words in the right order!`;
    case 'math-1': return `Here's your next problem:\n\n${q.question}`;
    case 'pattern-1': return `Here's your next pattern:\n\n**${q.sequence}**\n\nWhat number is missing?`;
    case 'synonym-1': return `What is a synonym for **"${q.word}"**?`;
    case 'rhyme-1': return `What word rhymes with **"${q.word}"**?`;
    case 'odd-one-out-1': return `Which word doesn't belong?\n\n**${q.words.join(', ')}**`;
    case 'spelling-1': return `Find and fix the misspelled word:\n\n*"${q.sentence}"*`;
    default: return '';
  }
}

function getHint(challengeId: string, q: any): string {
  switch (challengeId) {
    case 'scramble-1': return `💡 The sentence starts with the word **"${q.answer.split(' ')[0]}"**`;
    case 'math-1': return `💡 Try reading the problem again carefully. What numbers do you see?`;
    case 'pattern-1': return `💡 ${q.hint}`;
    case 'synonym-1': return `💡 Think of a word that means the same as "${q.word}". For example, if the word was "happy", you could say "joyful".`;
    case 'rhyme-1': return `💡 Think of words that end with the same sound as "${q.word}". Say "${q.word}" out loud — what sound does it end with?`;
    case 'odd-one-out-1': return `💡 Think about what category the words belong to. What do most of them have in common?`;
    case 'spelling-1': return `💡 Read each word carefully. One of them doesn't look right — try sounding it out!`;
    default: return '';
  }
}

function getStrongHint(challengeId: string, q: any): string {
  switch (challengeId) {
    case 'scramble-1':
      const words = q.answer.split(' ');
      return `The sentence has ${words.length} words. It starts with **"${words[0]} ${words[1] || ''}"**...`;
    case 'math-1':
      return `The answer is a number. Try adding or subtracting the numbers in the problem. The answer is close to **${q.answer}**.`;
    case 'pattern-1':
      return `${q.hint}. The missing number is between ${q.answer - 5} and ${q.answer + 5}.`;
    case 'synonym-1':
      return `Here's a clue: the synonym starts with the letter **"${q.synonyms[0][0].toUpperCase()}"**. One example is **"${q.synonyms[0]}"**.`;
    case 'rhyme-1':
      return `Here's a rhyming word to help you: **"${q.rhymes[0]}"** rhymes with "${q.word}". Can you think of another one?`;
    case 'odd-one-out-1':
      return `Three of the words are **${q.words.filter((w: string) => w !== q.odd).join(', ')}** — they all belong to the same group. The odd one out is different from them.`;
    case 'spelling-1':
      return `The misspelled word is **"${q.wrong}"**. Try spelling it correctly — it should be **"${q.correct[0]}${q.correct.slice(1, -2)}..."**`;
    default: return '';
  }
}

export const OFFLINE_CHALLENGE_IDS = new Set([
  'scramble-1', 'math-1', 'pattern-1', 'synonym-1',
  'rhyme-1', 'odd-one-out-1', 'spelling-1', 'story-1'
]);
