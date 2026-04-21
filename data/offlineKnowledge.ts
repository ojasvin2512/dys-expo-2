// Offline Knowledge Base for AI-like responses without internet
export type KnowledgeEntry = {
  category: string;
  keywords: string[];
  question: string;
  answer: string;
};

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // Animals
  {
    category: 'animals',
    keywords: ['dog', 'dogs', 'puppy', 'puppies'],
    question: 'What are dogs?',
    answer: 'Dogs are loyal animals that have been friends with humans for thousands of years. They can be trained to help people, guard homes, and provide companionship. Dogs come in many breeds and sizes!'
  },
  {
    category: 'animals',
    keywords: ['cat', 'cats', 'kitten', 'kittens'],
    question: 'What are cats?',
    answer: 'Cats are independent and graceful animals. They are excellent hunters and can see very well in the dark. Cats purr when they are happy and use their whiskers to sense their surroundings.'
  },
  {
    category: 'animals',
    keywords: ['elephant', 'elephants'],
    question: 'What are elephants?',
    answer: 'Elephants are the largest land animals on Earth. They have long trunks that they use like a hand to grab food and water. Elephants are very smart and have excellent memories!'
  },
  {
    category: 'animals',
    keywords: ['lion', 'lions'],
    question: 'What are lions?',
    answer: 'Lions are powerful big cats known as the "king of the jungle." They live in groups called prides and are excellent hunters. Male lions have beautiful manes around their heads.'
  },
  {
    category: 'animals',
    keywords: ['butterfly', 'butterflies'],
    question: 'What are butterflies?',
    answer: 'Butterflies are beautiful insects with colorful wings. They start life as caterpillars, then transform inside a cocoon and emerge as butterflies. This amazing change is called metamorphosis!'
  },

  // Science
  {
    category: 'science',
    keywords: ['water', 'h2o', 'liquid'],
    question: 'What is water?',
    answer: 'Water is a clear liquid that all living things need to survive. It can be solid (ice), liquid (water), or gas (steam). Water covers about 70% of Earth\'s surface!'
  },
  {
    category: 'science',
    keywords: ['sun', 'solar', 'star'],
    question: 'What is the sun?',
    answer: 'The sun is a giant ball of hot gas that gives us light and warmth. It\'s actually a star, and it\'s so big that over a million Earths could fit inside it! The sun is about 93 million miles away from Earth.'
  },
  {
    category: 'science',
    keywords: ['moon', 'lunar'],
    question: 'What is the moon?',
    answer: 'The moon is Earth\'s natural satellite that orbits around our planet. It doesn\'t make its own light but reflects sunlight. The moon affects ocean tides and goes through phases as it orbits Earth.'
  },
  {
    category: 'science',
    keywords: ['plant', 'plants', 'tree', 'trees'],
    question: 'How do plants grow?',
    answer: 'Plants need sunlight, water, and air to grow. They use sunlight to make their own food through a process called photosynthesis. Plants give us oxygen to breathe and food to eat!'
  },
  {
    category: 'science',
    keywords: ['rainbow', 'rainbows'],
    question: 'What is a rainbow?',
    answer: 'A rainbow is a beautiful arc of colors that appears in the sky when sunlight shines through water droplets. The colors always appear in the same order: red, orange, yellow, green, blue, indigo, and violet!'
  },

  // Math
  {
    category: 'math',
    keywords: ['add', 'addition', 'plus', 'sum'],
    question: 'What is addition?',
    answer: 'Addition means putting numbers together to find the total. When you add 2 + 3, you get 5. The + symbol means "plus" or "add." Addition is one of the basic math operations we use every day!'
  },
  {
    category: 'math',
    keywords: ['subtract', 'subtraction', 'minus', 'difference'],
    question: 'What is subtraction?',
    answer: 'Subtraction means taking away one number from another. When you subtract 5 - 2, you get 3. The - symbol means "minus" or "take away." We use subtraction to find how many are left.'
  },
  {
    category: 'math',
    keywords: ['multiply', 'multiplication', 'times'],
    question: 'What is multiplication?',
    answer: 'Multiplication is a fast way to add the same number many times. For example, 3 × 4 means "3 groups of 4" which equals 12. The × symbol means "times" or "multiplied by."'
  },
  {
    category: 'math',
    keywords: ['shape', 'shapes', 'circle', 'square', 'triangle'],
    question: 'What are shapes?',
    answer: 'Shapes are the forms of objects we see around us. Common shapes include circles (round), squares (4 equal sides), triangles (3 sides), and rectangles (4 sides with opposite sides equal).'
  },

  // Language
  {
    category: 'language',
    keywords: ['alphabet', 'letters', 'abc'],
    question: 'What is the alphabet?',
    answer: 'The alphabet is a set of letters we use to write words. The English alphabet has 26 letters from A to Z. Each letter has a capital (big) form and a lowercase (small) form.'
  },
  {
    category: 'language',
    keywords: ['vowel', 'vowels'],
    question: 'What are vowels?',
    answer: 'Vowels are special letters in the alphabet: A, E, I, O, U (and sometimes Y). Every word needs at least one vowel. Vowels make open sounds when you say them.'
  },
  {
    category: 'language',
    keywords: ['sentence', 'sentences'],
    question: 'What is a sentence?',
    answer: 'A sentence is a group of words that expresses a complete thought. It starts with a capital letter and ends with a punctuation mark like a period (.), question mark (?), or exclamation point (!).'
  },
  {
    category: 'language',
    keywords: ['rhyme', 'rhymes', 'rhyming'],
    question: 'What are rhyming words?',
    answer: 'Rhyming words are words that end with the same sound. For example, "cat" and "hat" rhyme, and so do "dog" and "log." Rhymes make poems and songs fun to say and remember!'
  },

  // Geography
  {
    category: 'geography',
    keywords: ['earth', 'planet', 'world'],
    question: 'What is Earth?',
    answer: 'Earth is the planet we live on. It\'s the third planet from the sun and the only planet we know that has life. Earth has land, water, and air that make it perfect for living things.'
  },
  {
    category: 'geography',
    keywords: ['ocean', 'oceans', 'sea', 'seas'],
    question: 'What are oceans?',
    answer: 'Oceans are huge bodies of salt water that cover most of Earth\'s surface. There are five oceans: Pacific, Atlantic, Indian, Arctic, and Southern. Oceans are home to millions of sea creatures!'
  },
  {
    category: 'geography',
    keywords: ['mountain', 'mountains'],
    question: 'What are mountains?',
    answer: 'Mountains are very tall landforms that rise high above the ground. They are formed over millions of years by movements in Earth\'s crust. The tallest mountain on Earth is Mount Everest!'
  },
  {
    category: 'geography',
    keywords: ['river', 'rivers'],
    question: 'What are rivers?',
    answer: 'Rivers are flowing bodies of fresh water that move from higher ground to lower ground, usually ending in an ocean or lake. Rivers provide water for drinking, farming, and transportation.'
  },
];

/**
 * Search knowledge base by keywords
 */
export function searchKnowledge(query: string): KnowledgeEntry | null {
  const lowerQuery = query.toLowerCase();
  
  // Find exact keyword match
  for (const entry of KNOWLEDGE_BASE) {
    for (const keyword of entry.keywords) {
      if (lowerQuery.includes(keyword)) {
        return entry;
      }
    }
  }
  
  return null;
}

/**
 * Get a random knowledge entry
 */
export function getRandomKnowledge(): KnowledgeEntry {
  const randomIndex = Math.floor(Math.random() * KNOWLEDGE_BASE.length);
  return KNOWLEDGE_BASE[randomIndex];
}
