const securityHeaders = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-frame-options': 'DENY',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  'content-security-policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"
};

function json(body, status = 200, method = 'GET') {
  return new Response(method === 'HEAD' ? null : JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...securityHeaders
    }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/health') {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        const response = json({ error: 'Method not allowed' }, 405, request.method);
        response.headers.set('allow', 'GET, HEAD');
        return response;
      }
      const colo = request.cf?.colo;
      return json({
        status: 'ok',
        service: 'systemzero-edge',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        colo: typeof colo === 'string' ? colo : 'LOCAL'
      }, 200, request.method);
    }
    if (url.pathname.startsWith('/api/')) {
      return json({ error: 'API route not found' }, 404);
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return json({ error: 'Method not allowed' }, 405, request.method);
    }
    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    for (const [name, value] of Object.entries(securityHeaders)) headers.set(name, value);
    if (headers.get('content-type')?.includes('text/html')) headers.set('cache-control', 'no-cache');
    return new Response(response.body, { status: response.status, headers });
  }
};
