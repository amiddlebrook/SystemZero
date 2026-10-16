import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.js';

const env = {
  ASSETS: {
    fetch: async () => new Response('<html><body>SystemZero</body></html>', { status: 200, headers: { 'content-type': 'text/html' } })
  }
};

test('Cloudflare health endpoint returns a verified JSON response', async () => {
  const response = await worker.fetch(new Request('https://systemzero.example/api/health'), env);
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.equal(data.status, 'ok');
  assert.equal(data.service, 'systemzero-edge');
  assert.equal(data.colo, 'LOCAL');
  assert.ok(!Number.isNaN(Date.parse(data.timestamp)));
  assert.equal(response.headers.get('cache-control'), 'no-store');
});

test('HEAD health request sends no body', async () => {
  const response = await worker.fetch(new Request('https://systemzero.example/api/health', { method: 'HEAD' }), env);
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '');
});

test('Unknown endpoints fail closed, no SPA fallback', async () => {
  const response = await worker.fetch(new Request('https://systemzero.example/api/secret'), env);
  assert.equal(response.status, 404);
  assert.equal((await response.json()).error, 'API route not found');
});

test('Health endpoint rejects writes', async () => {
  const response = await worker.fetch(new Request('https://systemzero.example/api/health', { method: 'POST' }), env);
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'GET, HEAD');
});

test('Static routes use bundled Cloudflare assets', async () => {
  const response = await worker.fetch(new Request('https://systemzero.example/'), env);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /SystemZero/);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('cache-control'), 'no-cache');
});
