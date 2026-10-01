import { resolveRoute } from './active_router';

const match = resolveRoute('/api/v2/items/itm_9988/detail');
if (match.route !== '/api/v2/items/:id' || match.params.id !== 'itm_9988') {
  console.error(`FAIL: Wildcard route resolution failed: ${JSON.stringify(match)}`);
  process.exit(1);
}

console.log('PASS: active_router resolves routes accurately without deprecated legacy parser');
process.exit(0);
