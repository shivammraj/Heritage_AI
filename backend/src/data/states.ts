import { State } from '../types';

export const INDIAN_STATES: State[] = [
  { id: 'andhra_pradesh', name: 'Andhra Pradesh', capital: 'Amaravati', demonym: 'Andhra', language: 'Telugu', aliases: ['ap', 'andhra'], region: 'south', neighbors: ['telangana', 'karnataka', 'tamil_nadu', 'odisha', 'chhattisgarh'] },
  { id: 'arunachal_pradesh', name: 'Arunachal Pradesh', capital: 'Itanagar', demonym: 'Arunachali', language: 'Nyishi', aliases: ['arunachal'], region: 'northeast', neighbors: ['assam', 'nagaland'] },
  { id: 'assam', name: 'Assam', capital: 'Dispur', demonym: 'Assamese', language: 'Assamese', aliases: [], region: 'northeast', neighbors: ['arunachal_pradesh', 'nagaland', 'manipur', 'mizoram', 'tripura', 'meghalaya', 'west_bengal'] },
  { id: 'bihar', name: 'Bihar', capital: 'Patna', demonym: 'Bihari', language: 'Hindi', aliases: ['bihaar'], region: 'east', neighbors: ['uttar_pradesh', 'jharkhand', 'west_bengal'] },
  { id: 'chhattisgarh', name: 'Chhattisgarh', capital: 'Raipur', demonym: 'Chhattisgarhi', language: 'Chhattisgarhi', aliases: ['chattisgarh'], region: 'central', neighbors: ['madhya_pradesh', 'maharashtra', 'telangana', 'andhra_pradesh', 'odisha', 'jharkhand', 'uttar_pradesh'] },
  { id: 'goa', name: 'Goa', capital: 'Panaji', demonym: 'Goan', language: 'Konkani', aliases: ['goanese'], region: 'west', neighbors: ['maharashtra', 'karnataka'] },
  { id: 'gujarat', name: 'Gujarat', capital: 'Gandhinagar', demonym: 'Gujarati', language: 'Gujarati', aliases: ['gujrat'], region: 'west', neighbors: ['rajasthan', 'maharashtra', 'madhya_pradesh'] },
  { id: 'haryana', name: 'Haryana', capital: 'Chandigarh', demonym: 'Haryanvi', language: 'Hindi', aliases: ['haryana'], region: 'north', neighbors: ['punjab', 'himachal_pradesh', 'uttarakhand', 'uttar_pradesh', 'rajasthan', 'delhi'] },
  { id: 'himachal_pradesh', name: 'Himachal Pradesh', capital: 'Shimla', demonym: 'Himachali', language: 'Hindi', aliases: ['himachal', 'hp'], region: 'north', neighbors: ['jammu_kashmir', 'punjab', 'haryana', 'uttarakhand'] },
  { id: 'jharkhand', name: 'Jharkhand', capital: 'Ranchi', demonym: 'Jharkhandi', language: 'Hindi', aliases: [], region: 'east', neighbors: ['bihar', 'west_bengal', 'odisha', 'chhattisgarh', 'uttar_pradesh'] },
  { id: 'karnataka', name: 'Karnataka', capital: 'Bengaluru', demonym: 'Kannadiga', language: 'Kannada', aliases: ['bangalore', 'bengaluru', 'mysore', 'mysuru'], region: 'south', neighbors: ['goa', 'maharashtra', 'telangana', 'andhra_pradesh', 'tamil_nadu', 'kerala'] },
  { id: 'kerala', name: 'Kerala', capital: 'Thiruvananthapuram', demonym: 'Keralite', language: 'Malayalam', aliases: ['trivandrum', 'thiruvananthapuram', 'cochin', 'kochi', 'malayali'], region: 'south', neighbors: ['karnataka', 'tamil_nadu'] },
  { id: 'madhya_pradesh', name: 'Madhya Pradesh', capital: 'Bhopal', demonym: 'Madhya Pradeshi', language: 'Hindi', aliases: ['mp'], region: 'central', neighbors: ['rajasthan', 'uttar_pradesh', 'chhattisgarh', 'maharashtra', 'gujarat'] },
  { id: 'maharashtra', name: 'Maharashtra', capital: 'Mumbai', demonym: 'Maharashtrian', language: 'Marathi', aliases: ['bombay', 'mumbai', 'pune', 'marathi', 'nagpur'], region: 'west', neighbors: ['gujarat', 'madhya_pradesh', 'chhattisgarh', 'telangana', 'karnataka', 'goa'] },
  { id: 'manipur', name: 'Manipur', capital: 'Imphal', demonym: 'Manipuri', language: 'Meitei', aliases: ['meitei', 'meetei'], region: 'northeast', neighbors: ['assam', 'nagaland', 'mizoram'] },
  { id: 'meghalaya', name: 'Meghalaya', capital: 'Shillong', demonym: 'Meghalayan', language: 'Khasi', aliases: ['khasi', 'shillong'], region: 'northeast', neighbors: ['assam'] },
  { id: 'mizoram', name: 'Mizoram', capital: 'Aizawl', demonym: 'Mizo', language: 'Mizo', aliases: ['mizo', 'aizawl'], region: 'northeast', neighbors: ['assam', 'manipur', 'tripura'] },
  { id: 'nagaland', name: 'Nagaland', capital: 'Kohima', demonym: 'Naga', language: 'Nagamese', aliases: ['naga', 'kohima'], region: 'northeast', neighbors: ['assam', 'arunachal_pradesh', 'manipur'] },
  { id: 'odisha', name: 'Odisha', capital: 'Bhubaneswar', demonym: 'Odia', language: 'Odia', aliases: ['orissa', 'odia', 'bhubaneswar'], region: 'east', neighbors: ['west_bengal', 'jharkhand', 'chhattisgarh', 'andhra_pradesh'] },
  { id: 'punjab', name: 'Punjab', capital: 'Chandigarh', demonym: 'Punjabi', language: 'Punjabi', aliases: ['sikh', 'chandigarh', 'amritsar', 'ludhiana'], region: 'north', neighbors: ['jammu_kashmir', 'himachal_pradesh', 'haryana', 'rajasthan'] },
  { id: 'rajasthan', name: 'Rajasthan', capital: 'Jaipur', demonym: 'Rajasthani', language: 'Rajasthani', aliases: ['jaipur', 'rajput', 'marwari', 'marwar', 'jodhpur', 'udaipur', 'jaisalmer'], region: 'north', neighbors: ['punjab', 'haryana', 'uttar_pradesh', 'madhya_pradesh', 'gujarat'] },
  { id: 'sikkim', name: 'Sikkim', capital: 'Gangtok', demonym: 'Sikkimese', language: 'Nepali', aliases: ['gangtok'], region: 'northeast', neighbors: ['west_bengal'] },
  { id: 'tamil_nadu', name: 'Tamil Nadu', capital: 'Chennai', demonym: 'Tamil', language: 'Tamil', aliases: ['tamil', 'madras', 'chennai', 'tamilian'], region: 'south', neighbors: ['kerala', 'karnataka', 'andhra_pradesh'] },
  { id: 'telangana', name: 'Telangana', capital: 'Hyderabad', demonym: 'Telangani', language: 'Telugu', aliases: ['hyderabad', 'telugu'], region: 'south', neighbors: ['maharashtra', 'chhattisgarh', 'odisha', 'andhra_pradesh', 'karnataka'] },
  { id: 'tripura', name: 'Tripura', capital: 'Agartala', demonym: 'Tripuri', language: 'Bengali', aliases: ['agartala', 'tripuri'], region: 'northeast', neighbors: ['assam', 'mizoram'] },
  { id: 'uttar_pradesh', name: 'Uttar Pradesh', capital: 'Lucknow', demonym: 'Uttar Pradeshi', language: 'Hindi', aliases: ['up', 'lucknow', 'agra', 'varanasi', 'benares', 'allahabad', 'prayagraj'], region: 'north', neighbors: ['uttarakhand', 'himachal_pradesh', 'haryana', 'rajasthan', 'madhya_pradesh', 'chhattisgarh', 'jharkhand', 'bihar'] },
  { id: 'uttarakhand', name: 'Uttarakhand', capital: 'Dehradun', demonym: 'Uttarakhandi', language: 'Hindi', aliases: ['uttaranchal', 'dehradun', 'haridwar', 'rishikesh'], region: 'north', neighbors: ['himachal_pradesh', 'uttar_pradesh'] },
  { id: 'west_bengal', name: 'West Bengal', capital: 'Kolkata', demonym: 'Bengali', language: 'Bengali', aliases: ['bengal', 'calcutta', 'kolkata', 'bengali'], region: 'east', neighbors: ['sikkim', 'assam', 'jharkhand', 'odisha', 'bihar'] },
];

export const STATE_FORBIDDEN_TERMS: Record<string, string[]> = {};
INDIAN_STATES.forEach(state => {
  const terms = [
    state.id.replace(/_/g, ' '),
    state.name.toLowerCase(),
    state.capital.toLowerCase(),
    state.demonym.toLowerCase(),
    state.language.toLowerCase(),
    ...state.aliases.map(a => a.toLowerCase()),
  ];
  STATE_FORBIDDEN_TERMS[state.id] = [...new Set(terms)];
});

export function getStateById(id: string): State | undefined {
  return INDIAN_STATES.find(s => s.id === id);
}

export function getDecoyStates(stateId: string, count: number = 5): State[] {
  const state = getStateById(stateId);
  if (!state) return [];
  // Prefer neighbors first, then same region, then random
  const neighbors = INDIAN_STATES.filter(s => s.id !== stateId && state.neighbors.includes(s.id));
  const sameRegion = INDIAN_STATES.filter(s => s.id !== stateId && s.region === state.region && !state.neighbors.includes(s.id));
  const rest = INDIAN_STATES.filter(s => s.id !== stateId && s.region !== state.region && !state.neighbors.includes(s.id));
  const pool = [...neighbors, ...sameRegion, ...rest];
  return pool.slice(0, count);
}
