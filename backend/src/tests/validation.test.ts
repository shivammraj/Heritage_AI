import { validatePromptIsNameFree, validateAllContent } from '../services/validation.service';

console.log('🧪 Heritage AI — Validation Service Tests\n');

let passed = 0;
let failed = 0;

function test(name: string, fn: () => boolean) {
  const result = fn();
  if (result) {
    console.log(`  ✅ ${name}`);
    passed++;
  } else {
    console.log(`  ❌ ${name}`);
    failed++;
  }
}

// ── Kerala tests ─────────────────────────────────────────────────────────────
test('Kerala: rejects "kerala" in prompt', () => {
  const result = validatePromptIsNameFree('A beautiful kerala landscape', 'kerala');
  return !result.isValid && result.foundTerms.includes('kerala');
});

test('Kerala: rejects "Malayalam" (case-insensitive)', () => {
  const result = validatePromptIsNameFree('People speaking Malayalam by the backwaters', 'kerala');
  return !result.isValid;
});

test('Kerala: rejects "Thiruvananthapuram"', () => {
  const result = validatePromptIsNameFree('Near the city of Thiruvananthapuram', 'kerala');
  return !result.isValid;
});

test('Kerala: rejects "Keralite"', () => {
  const result = validatePromptIsNameFree('A Keralite fisherman on a boat', 'kerala');
  return !result.isValid;
});

test('Kerala: allows valid cultural description', () => {
  const result = validatePromptIsNameFree(
    'Fishermen on narrow boats through emerald waterways lined with coconut palms, traditional white and gold sarees, early morning mist',
    'kerala'
  );
  return result.isValid;
});

// ── Rajasthan tests ───────────────────────────────────────────────────────────
test('Rajasthan: rejects "jaipur"', () => {
  const result = validatePromptIsNameFree('The pink city of Jaipur at sunset', 'rajasthan');
  return !result.isValid;
});

test('Rajasthan: rejects "Rajasthani"', () => {
  const result = validatePromptIsNameFree('A Rajasthani woman in colorful attire', 'rajasthan');
  return !result.isValid;
});

test('Rajasthan: rejects "marwari"', () => {
  const result = validatePromptIsNameFree('Marwari merchants at a desert market', 'rajasthan');
  return !result.isValid;
});

test('Rajasthan: allows valid desert scene', () => {
  const result = validatePromptIsNameFree(
    'Golden sand dunes at dusk, ornate havelis with mirror-work facades, camels silhouetted against an orange sky, turban-wearing traders',
    'rajasthan'
  );
  return result.isValid;
});

// ── Punjab tests ──────────────────────────────────────────────────────────────
test('Punjab: rejects "punjabi"', () => {
  const result = validatePromptIsNameFree('Punjabi folk dancers at harvest festival', 'punjab');
  return !result.isValid;
});

test('Punjab: rejects "sikh"', () => {
  const result = validatePromptIsNameFree('Sikh devotees at a golden temple', 'punjab');
  return !result.isValid;
});

test('Punjab: rejects "amritsar"', () => {
  const result = validatePromptIsNameFree('A sacred pool near Amritsar', 'punjab');
  return !result.isValid;
});

// ── Tamil Nadu tests ──────────────────────────────────────────────────────────
test('Tamil Nadu: rejects "tamil"', () => {
  const result = validatePromptIsNameFree('Tamil classical dance performance', 'tamil_nadu');
  return !result.isValid;
});

test('Tamil Nadu: rejects "chennai"', () => {
  const result = validatePromptIsNameFree('Marina beach in Chennai at sunrise', 'tamil_nadu');
  return !result.isValid;
});

// ── Maharashtra tests ─────────────────────────────────────────────────────────
test('Maharashtra: rejects "mumbai"', () => {
  const result = validatePromptIsNameFree('The bustling streets of Mumbai at night', 'maharashtra');
  return !result.isValid;
});

test('Maharashtra: rejects "marathi"', () => {
  const result = validatePromptIsNameFree('Marathi theatre and lavani dancers', 'maharashtra');
  return !result.isValid;
});

// ── validateAllContent tests ──────────────────────────────────────────────────
test('validateAllContent: flags if any field invalid', () => {
  const result = validateAllContent(
    {
      prompt: 'Golden sand dunes',
      clues: ['warm spices', 'desert culture', 'A kerala fisherman'],
      shareText: 'Mystery image',
    },
    'kerala'
  );
  return !result.allValid;
});

test('validateAllContent: passes when all fields clean', () => {
  const result = validateAllContent(
    {
      prompt: 'Golden sand dunes',
      clues: ['warm spices', 'desert culture', 'Ancient rock-cut temples'],
      shareText: 'A cultural mystery',
    },
    'kerala'
  );
  return result.allValid;
});

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('✅ ALL TESTS PASSED — ValidationService is working correctly');
} else {
  console.log('❌ SOME TESTS FAILED');
  process.exit(1);
}
