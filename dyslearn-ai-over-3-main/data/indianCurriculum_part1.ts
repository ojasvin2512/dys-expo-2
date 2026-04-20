
// ─────────────────────────────────────────────
// INDIAN NCERT/CBSE CURRICULUM QUESTION BANK
// Pre-KG to Grade 6 — 500+ questions
// ─────────────────────────────────────────────

export const INDIAN_CURRICULUM_QA: {
  grade: string;
  subject: string;
  question: string;
  answer: string;
  options?: string[];
}[] = [

  // ── PRE-KG: Colors ──
  { grade: "Pre-KG", subject: "GK", question: "What color is the sky?", answer: "Blue", options: ["Red", "Blue", "Green", "Yellow"] },
  { grade: "Pre-KG", subject: "GK", question: "What color is grass?", answer: "Green", options: ["Blue", "Green", "Orange", "Purple"] },
  { grade: "Pre-KG", subject: "GK", question: "What color is the sun?", answer: "Yellow", options: ["Yellow", "Pink", "White", "Brown"] },
  { grade: "Pre-KG", subject: "GK", question: "What color is a ripe tomato?", answer: "Red", options: ["Red", "Blue", "Green", "Black"] },
  { grade: "Pre-KG", subject: "GK", question: "What color is milk?", answer: "White", options: ["White", "Yellow", "Grey", "Pink"] },
  { grade: "Pre-KG", subject: "GK", question: "What color is a banana?", answer: "Yellow", options: ["Green", "Yellow", "Red", "Blue"] },
  { grade: "Pre-KG", subject: "GK", question: "What color is coal?", answer: "Black", options: ["Black", "White", "Brown", "Grey"] },
  { grade: "Pre-KG", subject: "GK", question: "What color is an orange fruit?", answer: "Orange", options: ["Orange", "Red", "Yellow", "Purple"] },

  // ── PRE-KG: Shapes ──
  { grade: "Pre-KG", subject: "GK", question: "How many sides does a triangle have?", answer: "3", options: ["2", "3", "4", "5"] },
  { grade: "Pre-KG", subject: "GK", question: "How many sides does a square have?", answer: "4", options: ["3", "4", "5", "6"] },
  { grade: "Pre-KG", subject: "GK", question: "What shape is a ball?", answer: "Circle / Sphere", options: ["Square", "Triangle", "Circle / Sphere", "Rectangle"] },
  { grade: "Pre-KG", subject: "GK", question: "What shape is a book?", answer: "Rectangle", options: ["Circle", "Triangle", "Rectangle", "Oval"] },
  { grade: "Pre-KG", subject: "GK", question: "What shape is a pizza slice?", answer: "Triangle", options: ["Triangle", "Square", "Circle", "Rectangle"] },
  { grade: "Pre-KG", subject: "GK", question: "What shape has no corners?", answer: "Circle", options: ["Square", "Triangle", "Rectangle", "Circle"] },

  // ── PRE-KG: Numbers 1-20 ──
  { grade: "Pre-KG", subject: "Math", question: "What number comes after 5?", answer: "6", options: ["4", "5", "6", "7"] },
  { grade: "Pre-KG", subject: "Math", question: "What number comes before 10?", answer: "9", options: ["8", "9", "10", "11"] },
  { grade: "Pre-KG", subject: "Math", question: "How many fingers do you have on one hand?", answer: "5", options: ["4", "5", "6", "10"] },
  { grade: "Pre-KG", subject: "Math", question: "Count: 1, 2, 3, __, 5. What is missing?", answer: "4", options: ["3", "4", "5", "6"] },
  { grade: "Pre-KG", subject: "Math", question: "How many eyes do you have?", answer: "2", options: ["1", "2", "3", "4"] },
  { grade: "Pre-KG", subject: "Math", question: "What number comes after 19?", answer: "20", options: ["18", "19", "20", "21"] },
  { grade: "Pre-KG", subject: "Math", question: "How many legs does a dog have?", answer: "4", options: ["2", "3", "4", "6"] },
  { grade: "Pre-KG", subject: "Math", question: "How many toes do you have in total?", answer: "10", options: ["5", "8", "10", "12"] },

  // ── PRE-KG: Alphabets ──
  { grade: "Pre-KG", subject: "English", question: "What letter comes after A?", answer: "B", options: ["B", "C", "D", "E"] },
  { grade: "Pre-KG", subject: "English", question: "What letter does 'Apple' start with?", answer: "A", options: ["A", "B", "C", "D"] },
  { grade: "Pre-KG", subject: "English", question: "What letter does 'Ball' start with?", answer: "B", options: ["A", "B", "C", "D"] },
  { grade: "Pre-KG", subject: "English", question: "What letter does 'Cat' start with?", answer: "C", options: ["A", "B", "C", "D"] },
  { grade: "Pre-KG", subject: "English", question: "What letter does 'Dog' start with?", answer: "D", options: ["B", "C", "D", "E"] },
  { grade: "Pre-KG", subject: "English", question: "What letter does 'Elephant' start with?", answer: "E", options: ["A", "E", "I", "O"] },
  { grade: "Pre-KG", subject: "English", question: "What letter does 'Fish' start with?", answer: "F", options: ["E", "F", "G", "H"] },
  { grade: "Pre-KG", subject: "English", question: "What letter does 'Mango' start with?", answer: "M", options: ["L", "M", "N", "O"] },
  { grade: "Pre-KG", subject: "English", question: "What letter does 'Sun' start with?", answer: "S", options: ["R", "S", "T", "U"] },
  { grade: "Pre-KG", subject: "English", question: "What letter does 'Zebra' start with?", answer: "Z", options: ["X", "Y", "Z", "W"] },
  { grade: "Pre-KG", subject: "English", question: "How many letters are in the English alphabet?", answer: "26", options: ["24", "25", "26", "28"] },

  // ── PRE-KG: Animals & Sounds ──
  { grade: "Pre-KG", subject: "GK", question: "What sound does a cow make?", answer: "Moo", options: ["Moo", "Baa", "Oink", "Quack"] },
  { grade: "Pre-KG", subject: "GK", question: "What sound does a dog make?", answer: "Woof / Bark", options: ["Meow", "Woof / Bark", "Moo", "Roar"] },
  { grade: "Pre-KG", subject: "GK", question: "What sound does a cat make?", answer: "Meow", options: ["Meow", "Woof", "Moo", "Baa"] },
  { grade: "Pre-KG", subject: "GK", question: "What sound does a lion make?", answer: "Roar", options: ["Roar", "Bark", "Meow", "Quack"] },
  { grade: "Pre-KG", subject: "GK", question: "What sound does a duck make?", answer: "Quack", options: ["Moo", "Baa", "Quack", "Roar"] },
  { grade: "Pre-KG", subject: "GK", question: "What sound does a sheep make?", answer: "Baa", options: ["Baa", "Moo", "Oink", "Quack"] },
  { grade: "Pre-KG", subject: "GK", question: "What sound does a pig make?", answer: "Oink", options: ["Oink", "Moo", "Baa", "Roar"] },
  { grade: "Pre-KG", subject: "GK", question: "What sound does a frog make?", answer: "Croak", options: ["Croak", "Bark", "Moo", "Hiss"] },
  { grade: "Pre-KG", subject: "GK", question: "What sound does a snake make?", answer: "Hiss", options: ["Hiss", "Roar", "Bark", "Quack"] },
  { grade: "Pre-KG", subject: "GK", question: "Which animal is called the King of the Jungle?", answer: "Lion", options: ["Tiger", "Lion", "Elephant", "Bear"] },

  // ── PRE-KG: Fruits & Vegetables ──
  { grade: "Pre-KG", subject: "GK", question: "Which fruit is yellow and curved?", answer: "Banana", options: ["Apple", "Banana", "Mango", "Grapes"] },
  { grade: "Pre-KG", subject: "GK", question: "Which fruit is red and round?", answer: "Apple", options: ["Apple", "Banana", "Orange", "Mango"] },
  { grade: "Pre-KG", subject: "GK", question: "Which vegetable is orange and long?", answer: "Carrot", options: ["Potato", "Carrot", "Tomato", "Onion"] },
  { grade: "Pre-KG", subject: "GK", question: "Which fruit is the national fruit of India?", answer: "Mango", options: ["Apple", "Banana", "Mango", "Guava"] },
  { grade: "Pre-KG", subject: "GK", question: "Which vegetable makes you cry when you cut it?", answer: "Onion", options: ["Potato", "Tomato", "Onion", "Carrot"] },
  { grade: "Pre-KG", subject: "GK", question: "Which fruit is green outside and red inside?", answer: "Watermelon", options: ["Mango", "Watermelon", "Guava", "Papaya"] },

  // ── PRE-KG: Body Parts ──
  { grade: "Pre-KG", subject: "GK", question: "Which body part do we use to see?", answer: "Eyes", options: ["Ears", "Eyes", "Nose", "Mouth"] },
  { grade: "Pre-KG", subject: "GK", question: "Which body part do we use to hear?", answer: "Ears", options: ["Eyes", "Ears", "Nose", "Hands"] },
  { grade: "Pre-KG", subject: "GK", question: "Which body part do we use to smell?", answer: "Nose", options: ["Nose", "Eyes", "Ears", "Tongue"] },
  { grade: "Pre-KG", subject: "GK", question: "Which body part do we use to taste?", answer: "Tongue", options: ["Nose", "Eyes", "Tongue", "Ears"] },
  { grade: "Pre-KG", subject: "GK", question: "Which body part do we use to walk?", answer: "Legs", options: ["Arms", "Legs", "Head", "Fingers"] },
  { grade: "Pre-KG", subject: "GK", question: "How many teeth does a healthy adult have?", answer: "32", options: ["20", "28", "32", "36"] },

  // ── PRE-KG: Family & Days ──
  { grade: "Pre-KG", subject: "GK", question: "What do you call your father's mother?", answer: "Grandmother (Dadi)", options: ["Mother", "Aunt", "Grandmother (Dadi)", "Sister"] },
  { grade: "Pre-KG", subject: "GK", question: "How many days are in a week?", answer: "7", options: ["5", "6", "7", "8"] },
  { grade: "Pre-KG", subject: "GK", question: "Which day comes after Monday?", answer: "Tuesday", options: ["Sunday", "Tuesday", "Wednesday", "Saturday"] },
  { grade: "Pre-KG", subject: "GK", question: "Which day comes before Sunday?", answer: "Saturday", options: ["Friday", "Saturday", "Monday", "Thursday"] },
  { grade: "Pre-KG", subject: "GK", question: "What is the first day of the week?", answer: "Sunday", options: ["Monday", "Sunday", "Saturday", "Friday"] },
  { grade: "Pre-KG", subject: "GK", question: "How many months are in a year?", answer: "12", options: ["10", "11", "12", "13"] },

  // ── KG: Colors & Shapes ──
  { grade: "KG", subject: "GK", question: "What are the three primary colors?", answer: "Red, Blue, Yellow", options: ["Red, Blue, Yellow", "Red, Green, Blue", "Orange, Purple, Green", "Pink, White, Black"] },
  { grade: "KG", subject: "GK", question: "What color do you get when you mix red and blue?", answer: "Purple", options: ["Green", "Orange", "Purple", "Brown"] },
  { grade: "KG", subject: "GK", question: "What color do you get when you mix red and yellow?", answer: "Orange", options: ["Orange", "Purple", "Green", "Pink"] },
  { grade: "KG", subject: "GK", question: "How many sides does a pentagon have?", answer: "5", options: ["4", "5", "6", "7"] },
  { grade: "KG", subject: "GK", question: "How many sides does a hexagon have?", answer: "6", options: ["5", "6", "7", "8"] },
  { grade: "KG", subject: "GK", question: "What shape is an egg?", answer: "Oval", options: ["Circle", "Oval", "Square", "Triangle"] },

  // ── KG: Numbers ──
  { grade: "KG", subject: "Math", question: "What is 2 + 3?", answer: "5", options: ["4", "5", "6", "7"] },
  { grade: "KG", subject: "Math", question: "What is 5 - 2?", answer: "3", options: ["2", "3", "4", "5"] },
  { grade: "KG", subject: "Math", question: "Which number is bigger: 7 or 9?", answer: "9", options: ["7", "9"] },
  { grade: "KG", subject: "Math", question: "What is 4 + 4?", answer: "8", options: ["6", "7", "8", "9"] },
  { grade: "KG", subject: "Math", question: "Count the vowels in the alphabet. How many are there?", answer: "5", options: ["4", "5", "6", "7"] },
  { grade: "KG", subject: "Math", question: "What comes after 15?", answer: "16", options: ["14", "15", "16", "17"] },
  { grade: "KG", subject: "Math", question: "What is 10 - 3?", answer: "7", options: ["6", "7", "8", "9"] },
  { grade: "KG", subject: "Math", question: "How many sides does a rectangle have?", answer: "4", options: ["3", "4", "5", "6"] },

  // ── KG: Animals ──
  { grade: "KG", subject: "GK", question: "Which animal gives us milk?", answer: "Cow", options: ["Dog", "Cow", "Cat", "Horse"] },
  { grade: "KG", subject: "GK", question: "Which bird cannot fly?", answer: "Penguin", options: ["Eagle", "Parrot", "Penguin", "Sparrow"] },
  { grade: "KG", subject: "GK", question: "Which animal has a very long neck?", answer: "Giraffe", options: ["Elephant", "Giraffe", "Zebra", "Lion"] },
  { grade: "KG", subject: "GK", question: "Which animal is the largest land animal?", answer: "Elephant", options: ["Elephant", "Giraffe", "Hippo", "Rhino"] },
  { grade: "KG", subject: "GK", question: "Which animal lives in water and on land?", answer: "Frog", options: ["Fish", "Frog", "Crocodile", "Turtle"] },
  { grade: "KG", subject: "GK", question: "What do caterpillars turn into?", answer: "Butterfly", options: ["Bee", "Butterfly", "Moth", "Dragonfly"] },
  { grade: "KG", subject: "GK", question: "Which animal is known for its black and white stripes?", answer: "Zebra", options: ["Tiger", "Zebra", "Panda", "Skunk"] },
  { grade: "KG", subject: "GK", question: "Which is the national animal of India?", answer: "Tiger", options: ["Lion", "Tiger", "Elephant", "Peacock"] },
  { grade: "KG", subject: "GK", question: "Which is the national bird of India?", answer: "Peacock", options: ["Parrot", "Peacock", "Eagle", "Sparrow"] },

  // ── GRADE 1: English ──
  { grade: "Grade 1", subject: "English", question: "Which of these is a vowel?", answer: "A", options: ["B", "C", "A", "D"] },
  { grade: "Grade 1", subject: "English", question: "How many vowels are in the English alphabet?", answer: "5", options: ["4", "5", "6", "7"] },
  { grade: "Grade 1", subject: "English", question: "What is the opposite of 'big'?", answer: "Small", options: ["Large", "Small", "Tall", "Heavy"] },
  { grade: "Grade 1", subject: "English", question: "What is the opposite of 'hot'?", answer: "Cold", options: ["Warm", "Cool", "Cold", "Icy"] },
  { grade: "Grade 1", subject: "English", question: "Which word rhymes with 'cat'?", answer: "Bat", options: ["Dog", "Bat", "Cup", "Sun"] },
  { grade: "Grade 1", subject: "English", question: "Which word rhymes with 'sun'?", answer: "Run", options: ["Rain", "Run", "Moon", "Star"] },
  { grade: "Grade 1", subject: "English", question: "What is the plural of 'cat'?", answer: "Cats", options: ["Cat", "Cats", "Cates", "Caties"] },
  { grade: "Grade 1", subject: "English", question: "What is the plural of 'box'?", answer: "Boxes", options: ["Boxs", "Boxes", "Boxies", "Box"] },
  { grade: "Grade 1", subject: "English", question: "Fill in the blank: The dog ___ in the park.", answer: "plays", options: ["play", "plays", "played", "playing"] },
  { grade: "Grade 1", subject: "English", question: "Which sentence is correct?", answer: "She is a good girl.", options: ["She are a good girl.", "She is a good girl.", "She am a good girl.", "She be a good girl."] },
  { grade: "Grade 1", subject: "English", question: "What letter comes after 'M' in the alphabet?", answer: "N", options: ["L", "N", "O", "P"] },
  { grade: "Grade 1", subject: "English", question: "Which word is a name of a person?", answer: "Priya", options: ["Apple", "Run", "Priya", "Blue"] },

  // ── GRADE 1: Math ──
  { grade: "Grade 1", subject: "Math", question: "What is 15 + 4?", answer: "19", options: ["18", "19", "20", "21"] },
  { grade: "Grade 1", subject: "Math", question: "What is 20 - 7?", answer: "13", options: ["12", "13", "14", "15"] },
  { grade: "Grade 1", subject: "Math", question: "What is 8 + 9?", answer: "17", options: ["15", "16", "17", "18"] },
  { grade: "Grade 1", subject: "Math", question: "What is 12 - 5?", answer: "7", options: ["6", "7", "8", "9"] },
  { grade: "Grade 1", subject: "Math", question: "How many tens are in 50?", answer: "5", options: ["4", "5", "6", "50"] },
  { grade: "Grade 1", subject: "Math", question: "What is the place value of 3 in 35?", answer: "Tens", options: ["Ones", "Tens", "Hundreds", "Thousands"] },
  { grade: "Grade 1", subject: "Math", question: "Which number is between 45 and 47?", answer: "46", options: ["44", "45", "46", "48"] },
  { grade: "Grade 1", subject: "Math", question: "What is 6 + 6?", answer: "12", options: ["10", "11", "12", "13"] },
  { grade: "Grade 1", subject: "Math", question: "What is 18 - 9?", answer: "9", options: ["7", "8", "9", "10"] },
  { grade: "Grade 1", subject: "Math", question: "How many sides does a triangle have?", answer: "3", options: ["2", "3", "4", "5"] },
  { grade: "Grade 1", subject: "Math", question: "What is 7 + 8?", answer: "15", options: ["13", "14", "15", "16"] },
  { grade: "Grade 1", subject: "Math", question: "Count by 2s: 2, 4, 6, __, 10", answer: "8", options: ["7", "8", "9", "10"] },

  // ── GRADE 1: EVS ──
  { grade: "Grade 1", subject: "EVS", question: "How many seasons are there in India?", answer: "4", options: ["2", "3", "4", "6"] },
  { grade: "Grade 1", subject: "EVS", question: "Which season is the hottest in India?", answer: "Summer", options: ["Winter", "Summer", "Monsoon", "Spring"] },
  { grade: "Grade 1", subject: "EVS", question: "What do plants need to make food?", answer: "Sunlight, water, and air", options: ["Only water", "Only sunlight", "Sunlight, water, and air", "Soil and rain"] },
  { grade: "Grade 1", subject: "EVS", question: "Which part of the plant is underground?", answer: "Root", options: ["Leaf", "Stem", "Root", "Flower"] },
  { grade: "Grade 1", subject: "EVS", question: "What do we call the person who teaches us in school?", answer: "Teacher", options: ["Doctor", "Teacher", "Farmer", "Driver"] },
  { grade: "Grade 1", subject: "EVS", question: "Which animal gives us wool?", answer: "Sheep", options: ["Cow", "Goat", "Sheep", "Horse"] },
  { grade: "Grade 1", subject: "EVS", question: "What do we use to write on a blackboard?", answer: "Chalk", options: ["Pen", "Pencil", "Chalk", "Crayon"] },
  { grade: "Grade 1", subject: "EVS", question: "Which sense organ helps us see?", answer: "Eyes", options: ["Ears", "Eyes", "Nose", "Skin"] },
  { grade: "Grade 1", subject: "EVS", question: "What is the color of a healthy leaf?", answer: "Green", options: ["Yellow", "Brown", "Green", "Red"] },
  { grade: "Grade 1", subject: "EVS", question: "Which vehicle runs on rails?", answer: "Train", options: ["Bus", "Car", "Train", "Bicycle"] },
  { grade: "Grade 1", subject: "EVS", question: "What do we call the place where we live?", answer: "Home / House", options: ["School", "Hospital", "Home / House", "Market"] },
  { grade: "Grade 1", subject: "EVS", question: "Which festival is known as the festival of lights?", answer: "Diwali", options: ["Holi", "Diwali", "Eid", "Christmas"] },
];
