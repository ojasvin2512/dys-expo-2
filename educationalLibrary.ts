import { ENCYCLOPEDIA_LIBRARY } from './encyclopediaLibrary';

export interface EducationalAsset {
    keywords: string[];
    path: string;
}

export const EDUCATIONAL_LIBRARY: EducationalAsset[] = [
    ...ENCYCLOPEDIA_LIBRARY,
    {
        keywords: ['heart', 'human heart', 'cardiac', 'circulatory system', 'pulse', 'beat', 'blood', 'artery', 'vein', 'valve', 'aorta', 'ventricle', 'atrium', 'chest', 'organ', 'doctor', 'medical', 'health', 'pumping', 'stethoscope'],
        path: 'assets/educational/heart.png'
    },
    {
        keywords: ['solar system', 'planets', 'sun and planets', 'space', 'galaxy', 'universe', 'orbit', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'asteroid', 'comet', 'astronomy', 'stars', 'cosmos', 'rocket', 'astronaut'],
        path: 'assets/educational/solar_system.png'
    },
    {
        keywords: ['water cycle', 'rain', 'evaporation', 'condensation', 'precipitation', 'clouds', 'water', 'cycle', 'weather', 'lake', 'ocean', 'river', 'runoff', 'transpiration', 'moisture', 'humidity', 'atmosphere', 'droplets'],
        path: 'assets/educational/water_cycle.png'
    },
    {
        keywords: ['lungs', 'breathing', 'respiratory system', 'oxygen', 'air', 'inhale', 'exhale', 'chest', 'ribs', 'diaphragm', 'bronchi', 'trachea', 'windpipe', 'gas exchange', 'nose', 'mouth', 'breath', 'lung', 'vitality'],
        path: 'assets/educational/lungs.png'
    },
    {
        keywords: ['brain', 'thinking', 'nervous system', 'mind', 'logic', 'memory', 'intelligence', 'skull', 'neurons', 'synapse', 'spine', 'reflex', 'creativity', 'thoughts', 'mental', 'problem solving', 'head', 'control center', 'neuroscience'],
        path: 'assets/educational/brain.png'
    },
    {
        keywords: ['shapes', 'geometric', 'round', 'long', 'circle', 'square', 'triangle', 'rectangle', 'oval', 'pentagon', 'hexagon', 'octagon', 'sphere', 'cube', 'pyramid', 'cone', 'cylinder', 'geometry', 'dimensions', 'lines', 'corners', 'edges'],
        path: 'assets/educational/shapes.png'
    },
    {
        keywords: ['numbers', 'counting', '1 to 9', 'digits', 'math', 'numerals', 'arithmetic', 'basic math', 'preschool math', 'quantity', 'amount', 'sequence', 'order', 'sorting', 'value', 'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'],
        path: 'assets/educational/numbers_1_9.png'
    },
    {
        keywords: ['family', 'parents', 'children', 'home', 'mother', 'father', 'brother', 'sister', 'grandparents', 'love', 'care', 'relatives', 'siblings', 'household', 'community', 'belonging', 'relationships', 'baby', 'elderly'],
        path: 'assets/educational/family.png'
    },
    {
        keywords: ['seasons', 'spring', 'summer', 'autumn', 'winter', 'fall', 'climate', 'temperature', 'weather', 'equinox', 'solstice', 'hemisphere', 'flowers', 'snow', 'heat', 'cold', 'changing leaves', 'seasonal', 'yearly cycle'],
        path: 'assets/educational/seasons.jpg'
    },
    {
        keywords: ['rainbow', 'colors', 'sky', 'prism', 'light', 'spectrum', 'optics', 'reflection', 'refraction', 'rainy day', 'vibgyor', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'arch', 'meteorology', 'nature beauty'],
        path: 'assets/educational/rainbow.jpg'
    },
    {
        keywords: ['digestion', 'stomach', 'digestive system', 'food', 'eating', 'energy', 'intestines', 'esophagus', 'mouth', 'enzymes', 'nutrition', 'nutrients', 'bowel', 'metabolism', 'hunger', 'tummy', 'organ system', 'biology', 'internal'],
        path: 'assets/educational/digestion.png'
    },
    {
        keywords: ['seeds', 'plants', 'growing', 'sprout', 'germination', 'dirt', 'soil', 'earth', 'gardening', 'farming', 'roots', 'botany', 'nature', 'life cycle', 'pollen', 'agriculture', 'fruit', 'vegetable', 'seedling'],
        path: 'assets/educational/seeds.png'
    },
    {
        keywords: ['water conservation', 'save water', 'environment', 'ecology', 'pollution', 'cleaning rivers', 'fresh water', 'protection', 'scarcity', 'resources', 'drought', 'recycling', 'sustainability', 'green energy', 'nature guard'],
        path: 'assets/educational/water_drop.jpg'
    },
    {
        keywords: ['fractions', 'parts', 'whole', 'half', 'quarter', 'numerator', 'denominator', 'division', 'ratio', 'percentage', 'share', 'equal parts', 'pie chart', 'slice', 'segment', 'proportion', 'math concepts'],
        path: 'assets/educational/fractions.png'
    },
    {
        keywords: ['integers', 'number line', 'negative numbers', 'positive numbers', 'zero', 'absolute value', 'alignment', 'comparison', 'greater than', 'less than', 'order of numbers', 'counting numbers', 'middle school math'],
        path: 'assets/educational/number_line.png'
    },
    {
        keywords: ['electricity', 'circuit', 'wires', 'power', 'battery', 'light bulb', 'voltage', 'current', 'flow', 'electrons', 'positive', 'negative', 'switch', 'energy source', 'conductor', 'insulator', 'physics', 'sparks'],
        path: 'assets/educational/circuit.png'
    },
    {
        keywords: ['matter', 'solid', 'liquid', 'gas', 'states of matter', 'molecules', 'particles', 'ice', 'water', 'steam', 'property', 'freezing', 'melting', 'boiling', 'chemistry', 'physical science', 'substance'],
        path: 'assets/educational/states_of_matter.png'
    },
    {
        keywords: ['democracy', 'voting', 'election', 'government', 'freedom', 'rights', 'citizens', 'ballot', 'policy', 'leader', 'president', 'parliament', 'law', 'constitution', 'justice', 'equality', 'politics', 'civics'],
        path: 'assets/educational/democracy.png'
    },
    {
        keywords: ['python', 'programming', 'coding', 'algorithms', 'software', 'script', 'developer', 'automation', 'computer science', 'language', 'logic', 'computer', 'tech', 'apps', 'web', 'data science', 'ai'],
        path: 'assets/educational/python.png'
    },
    {
        keywords: ['animal', 'animals', 'lion', 'wildlife', 'habitat', 'forest', 'predator', 'mammal', 'carnivore', 'africa', 'savanna', 'zoo', 'nature', 'creatures', 'zoology', 'biodiversity', 'wild', 'jungle', 'species'],
        path: 'assets/educational/lion.jpg'
    },
    {
        keywords: ['plant', 'plants', 'leaf', 'root', 'stem', 'flower', 'photosynthesis', 'flora', 'botany', 'chloroplast', 'xylem', 'phloem', 'tree', 'growth', 'greenery', 'garden', 'vegetation', 'biology'],
        path: 'assets/educational/plant.jpg'
    },
    {
        keywords: ['india', 'map', 'states', 'capitals', 'delhi', 'mumbai', 'geography', 'border', 'subcontinent', 'asia', 'indian', 'location', 'atlas', 'coordinates', 'terrain', 'regions', 'nation', 'country'],
        path: 'assets/educational/india_map.png'
    },
    {
        keywords: ['history', 'monument', 'taj mahal', 'pyramid', 'ancient', 'architecture', 'heritage', 'ruins', 'past', 'civilization', 'temple', 'castle', 'culture', 'archaeology', 'timeline', 'world history'],
        path: 'assets/educational/taj_mahal.jpg'
    },
    {
        keywords: ['math', 'mathematics', 'addition', 'subtraction', 'multiplication', 'division', 'sum', 'difference', 'product', 'quotient', 'arithmetic', 'equation', 'calculator', 'plus', 'minus', 'times', 'numbers', 'geometry', 'algebra'],
        path: 'assets/educational/math_ops.png'
    },
    {
        keywords: ['time', 'clock', 'hour', 'minute', 'second', 'day', 'night', 'watch', 'calendar', 'schedule', 'morning', 'afternoon', 'evening', 'midnight', 'measurement', 'duration', 'timer', 'history of time'],
        path: 'assets/educational/clock.png'
    },
    {
        keywords: ['money', 'coins', 'notes', 'rupee', 'cash', 'currency', 'bank', 'saving', 'spend', 'cost', 'price', 'wallet', 'market', 'trade', 'economy', 'financial', 'finance', 'commerce', 'buying'],
        path: 'assets/educational/money.jpg'
    },
    {
        keywords: ['computer', 'technology', 'laptop', 'screen', 'keyboard', 'mouse', 'hardware', 'software', 'internet', 'digital', 'data', 'processing', 'electronic', 'device', 'coding', 'computing', 'it'],
        path: 'assets/educational/computer.png'
    },
    {
        keywords: ['weather', 'sun', 'clouds', 'rain', 'sky', 'climate', 'meteorology', 'forecast', 'temperature', 'atmosphere', 'wind', 'storm', 'humidity', 'sunny', 'cloudy', 'seasons', 'nature', 'elements'],
        path: 'assets/educational/weather.png'
    },
    {
        keywords: ['school', 'education', 'classroom', 'student', 'teacher', 'learning', 'lesson', 'desk', 'chalkboard', 'academic', 'college', 'university', 'study', 'teaching', 'knowledge'],
        path: 'assets/educational/classroom.jpg'
    },
    {
        keywords: ['lab', 'science', 'laboratory', 'experiment', 'research', 'test tube', 'discovery', 'scientist', 'chemistry', 'biology', 'physics', 'scientific', 'investigation', 'microscope'],
        path: 'assets/educational/lab.jpg'
    },
    {
        keywords: ['sports', 'physical education', 'fitness', 'game', 'team', 'exercise', 'health', 'athletics', 'football', 'soccer', 'basketball', 'cricket', 'competition', 'activity'],
        path: 'assets/educational/sports.jpg'
    },
    {
        keywords: ['art', 'painting', 'drawing', 'creativity', 'artist', 'colors', 'masterpiece', 'culture', 'design', 'craft', 'imagination', 'sketch', 'museum', 'gallery'],
        path: 'assets/educational/art.jpg'
    },
    {
        keywords: ['music', 'instruments', 'song', 'melody', 'rhythm', 'sound', 'orchestra', 'band', 'concert', 'audio', 'performance', 'singing', 'guitar', 'piano', 'drums'],
        path: 'assets/educational/music.jpg'
    },
    {
        keywords: ['transport', 'transportation', 'vehicle', 'car', 'bus', 'train', 'plane', 'travel', 'logistics', 'movement', 'engine', 'fuel', 'road', 'rail', 'aviation', 'ship'],
        path: 'assets/educational/transport.jpg'
    },
    {
        keywords: ['food', 'healthy', 'nutrition', 'eating', 'diet', 'vegetables', 'fruits', 'meal', 'cooking', 'energy', 'vitamins', 'minerals', 'cuisine', 'breakfast', 'lunch', 'dinner'],
        path: 'assets/educational/food.jpg'
    },
    // Alphabets A-Z
    { keywords: ['letter a', 'alphabet a', 'capital a'], path: 'assets/educational/alphabets/A.png' },
    { keywords: ['letter b', 'alphabet b', 'capital b'], path: 'assets/educational/alphabets/B.png' },
    { keywords: ['letter c', 'alphabet c', 'capital c'], path: 'assets/educational/alphabets/C.png' },
    { keywords: ['letter d', 'alphabet d', 'capital d'], path: 'assets/educational/alphabets/D.png' },
    { keywords: ['letter e', 'alphabet e', 'capital e'], path: 'assets/educational/alphabets/E.png' },
    { keywords: ['letter f', 'alphabet f', 'capital f'], path: 'assets/educational/alphabets/F.png' },
    { keywords: ['letter g', 'alphabet g', 'capital g'], path: 'assets/educational/alphabets/G.png' },
    { keywords: ['letter h', 'alphabet h', 'capital h'], path: 'assets/educational/alphabets/H.png' },
    { keywords: ['letter i', 'alphabet i', 'capital i'], path: 'assets/educational/alphabets/I.png' },
    { keywords: ['letter j', 'alphabet j', 'capital j'], path: 'assets/educational/alphabets/J.png' },
    { keywords: ['letter k', 'alphabet k', 'capital k'], path: 'assets/educational/alphabets/K.png' },
    { keywords: ['letter l', 'alphabet l', 'capital l'], path: 'assets/educational/alphabets/L.png' },
    { keywords: ['letter m', 'alphabet m', 'capital m'], path: 'assets/educational/alphabets/M.png' },
    { keywords: ['letter n', 'alphabet n', 'capital n'], path: 'assets/educational/alphabets/N.png' },
    { keywords: ['letter o', 'alphabet o', 'capital o'], path: 'assets/educational/alphabets/O.png' },
    { keywords: ['letter p', 'alphabet p', 'capital p'], path: 'assets/educational/alphabets/P.png' },
    { keywords: ['letter q', 'alphabet q', 'capital q'], path: 'assets/educational/alphabets/Q.png' },
    { keywords: ['letter r', 'alphabet r', 'capital r'], path: 'assets/educational/alphabets/R.png' },
    { keywords: ['letter s', 'alphabet s', 'capital s'], path: 'assets/educational/alphabets/S.png' },
    { keywords: ['letter t', 'alphabet t', 'capital t'], path: 'assets/educational/alphabets/T.png' },
    { keywords: ['letter u', 'alphabet u', 'capital u'], path: 'assets/educational/alphabets/U.png' },
    { keywords: ['letter v', 'alphabet v', 'capital v'], path: 'assets/educational/alphabets/V.png' },
    { keywords: ['letter w', 'alphabet w', 'capital w'], path: 'assets/educational/alphabets/W.png' },
    { keywords: ['letter x', 'alphabet x', 'capital x'], path: 'assets/educational/alphabets/X.png' },
    { keywords: ['letter y', 'alphabet y', 'capital y'], path: 'assets/educational/alphabets/Y.png' },
    { keywords: ['letter z', 'alphabet z', 'capital z'], path: 'assets/educational/alphabets/Z.png' },
    // Numbers 0-9
    { keywords: ['digit 0', 'number 0', 'zero icon'], path: 'assets/educational/numbers/0.svg' },
    { keywords: ['digit 1', 'number 1', 'one icon'], path: 'assets/educational/numbers/1.svg' },
    { keywords: ['digit 2', 'number 2', 'two icon'], path: 'assets/educational/numbers/2.svg' },
    { keywords: ['digit 3', 'number 3', 'three icon'], path: 'assets/educational/numbers/3.svg' },
    { keywords: ['digit 4', 'number 4', 'four icon'], path: 'assets/educational/numbers/4.svg' },
    { keywords: ['digit 5', 'number 5', 'five icon'], path: 'assets/educational/numbers/5.svg' },
    { keywords: ['digit 6', 'number 6', 'six icon'], path: 'assets/educational/numbers/6.svg' },
    { keywords: ['digit 7', 'number 7', 'seven icon'], path: 'assets/educational/numbers/7.svg' },
    { keywords: ['digit 8', 'number 8', 'eight icon'], path: 'assets/educational/numbers/8.svg' },
    { keywords: ['lion', 'king of jungle', 'roar'], path: 'assets/educational/library/lion.svg' },
    { keywords: ['tiger', 'stripes', 'feline'], path: 'assets/educational/library/tiger.svg' },
    { keywords: ['zebra', 'stripes', 'africa'], path: 'assets/educational/library/zebra.svg' },
    { keywords: ['cat', 'kitten', 'pussycat', 'meow'], path: 'assets/educational/library/cat.svg' },
    { keywords: ['dog', 'puppy', 'hound', 'bark'], path: 'assets/educational/library/dog.svg' },
    { keywords: ['monkey', 'primate', 'ape'], path: 'assets/educational/library/monkey.svg' },
    { keywords: ['owl', 'bird of prey', 'hoot'], path: 'assets/educational/library/owl.svg' },
    { keywords: ['penguin', 'antarctica', 'waddle'], path: 'assets/educational/library/penguin.svg' },
    { keywords: ['shark', 'fin', 'ocean predator'], path: 'assets/educational/library/shark.svg' },
    { keywords: ['whale', 'marine mammal', 'ocean'], path: 'assets/educational/library/whale.svg' },
    { keywords: ['spouting whale', 'blowhole'], path: 'assets/educational/library/spouting_whale.svg' },
    { keywords: ['fish', 'fins', 'swim'], path: 'assets/educational/library/fish.svg' },
    { keywords: ['octopus', 'tentacles', 'ink'], path: 'assets/educational/library/octopus.svg' },
    { keywords: ['butterfly', 'wings', 'insect'], path: 'assets/educational/library/butterfly.svg' },
    { keywords: ['bee', 'honey', 'pollinate', 'stinger'], path: 'assets/educational/library/bee.svg' },
    { keywords: ['spider', 'web', 'eight legs', 'arachnid'], path: 'assets/educational/library/spider.svg' },
    // Objects & Technology
    { keywords: ['computer', 'laptop', 'desktop', 'pc'], path: 'assets/educational/library/computer.svg' },
    { keywords: ['mobile phone', 'smartphone', 'cellphone'], path: 'assets/educational/library/mobile_phone.svg' },
    { keywords: ['car', 'automobile', 'vehicle', 'drive'], path: 'assets/educational/library/car.svg' },
    { keywords: ['rocket', 'spacecraft', 'launch', 'nasa'], path: 'assets/educational/library/rocket.svg' },
    { keywords: ['train', 'locomotive', 'railway', 'track'], path: 'assets/educational/library/locomotive.svg' },
    { keywords: ['bicycle', 'bike', 'cycle', 'pedal'], path: 'assets/educational/library/bicycle.svg' },
    { keywords: ['airplane', 'plane', 'flight', 'aviation'], path: 'assets/educational/library/airplane.svg' },
    { keywords: ['sailboat', 'yacht', 'ship', 'sailing'], path: 'assets/educational/library/sailboat.svg' },
    { keywords: ['book', 'reading', 'library', 'story'], path: 'assets/educational/library/open_book.svg' },
    { keywords: ['pencil', 'pen', 'writing', 'stationery'], path: 'assets/educational/library/pen.svg' },
    { keywords: ['memo', 'note', 'paper', 'list'], path: 'assets/educational/library/memo.svg' },
    { keywords: ['ruler', 'measure', 'geometry'], path: 'assets/educational/library/ruler.svg' },
    { keywords: ['microscope', 'cells', 'biology lab'], path: 'assets/educational/library/microscope.svg' },
    { keywords: ['telescope', 'stars', 'astronomy lab'], path: 'assets/educational/library/telescope.svg' },
    { keywords: ['light bulb', 'idea', 'electricity'], path: 'assets/educational/library/light_bulb.svg' },
    { keywords: ['battery', 'power source', 'energy'], path: 'assets/educational/library/battery.svg' },
    { keywords: ['bone', 'skeleton', 'anatomy'], path: 'assets/educational/library/bone.svg' },
    { keywords: ['puzzle', 'game', 'piece', 'logic'], path: 'assets/educational/library/puzzle_piece.svg' },
    { keywords: ['music note', 'sound', 'song'], path: 'assets/educational/library/music_note.svg' },
    // Food
    { keywords: ['apple', 'fruit', 'red fruit'], path: 'assets/educational/library/apple_red.svg' },
    { keywords: ['banana', 'fruit', 'yellow fruit'], path: 'assets/educational/library/banana.svg' },
    { keywords: ['orange', 'citrus', 'orange fruit'], path: 'assets/educational/library/orange_fruit.svg' },
    { keywords: ['strawberry', 'berry', 'red berry'], path: 'assets/educational/library/strawberry.svg' },
    { keywords: ['carrot', 'vegetable', 'orange vegetable'], path: 'assets/educational/library/carrot.svg' },
    { keywords: ['tomato', 'red vegetable', 'salad'], path: 'assets/educational/library/tomato.svg' },
    { keywords: ['pizza', 'fractions', 'slice', 'pepperoni'], path: 'assets/educational/library/pizza_fractions.svg' }
];

/**
 * Searches the library for a matching educational asset based on the prompt.
 */
/**
 * Searches the library for a matching educational asset based on the prompt.
 * Uses a score-based system to prioritize specific matches and prevent false positives.
 */
export function findEducationalAsset(prompt: string): string | null {
    const lowerPrompt = prompt.toLowerCase();
    let bestMatch: { path: string, score: number } | null = null;

    for (const asset of EDUCATIONAL_LIBRARY) {
        let totalAssetScore = 0;
        let matchedKeywordsCount = 0;
        
        for (const keyword of asset.keywords) {
            const lowerKeyword = keyword.toLowerCase();
            
            // Exact match is the highest priority
            if (lowerPrompt === lowerKeyword) {
                return asset.path;
            }
            
            // Substring match
            if (lowerPrompt.includes(lowerKeyword)) {
                // Bonus for whole word match
                const isWordMatch = new RegExp(`\\b${lowerKeyword}\\b`, 'i').test(lowerPrompt);
                
                if (isWordMatch) {
                    // Whole word match gets massive points based on length
                    // Longer words correlate with specificity
                    totalAssetScore += lowerKeyword.length * 10;
                    matchedKeywordsCount++;
                } else if (lowerKeyword.length > 4) {
                    // Partial matches only contribute minor points, and only if the word is long enough
                    // This prevents 'cat' from matching inside 'education'
                    totalAssetScore += lowerKeyword.length;
                }
            }
        }
        
        if (totalAssetScore > 0) {
            // Multiplier massively rewards assets where multiple keywords matched the prompt
            // E.g., matching "volcano", "eruption", and "magma" will outscore matching just "atmosphere"
            const finalScore = totalAssetScore * (1 + (matchedKeywordsCount * 0.5));
            
            if (!bestMatch || finalScore > bestMatch.score) {
                bestMatch = { path: asset.path, score: finalScore };
            }
        }
    }

    return bestMatch?.path || null;
}
