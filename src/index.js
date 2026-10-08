const ALLOWED_HOSTNAMES = new Set(['www.amazon.in']);

const NO_INDEX_HEADERS = {
  'Content-Type': 'text/plain',
  'X-Robots-Tag': 'noindex'
};

export default {
  async fetch(request) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: { 'Allow': 'GET, HEAD' }
      });
    }

    const url = new URL(request.url);
    const targetParam = url.searchParams.get('o');

    if (!targetParam) {
      return new Response('Missing "o" query parameter.', {
        status: 400,
        headers: NO_INDEX_HEADERS
      });
    }

    let targetUrl;
    try {
      targetUrl = new URL(targetParam);
    } catch {
      return new Response('Invalid URL.', {
        status: 400,
        headers: NO_INDEX_HEADERS
      });
    }

    if (targetUrl.protocol !== 'https:' || !ALLOWED_HOSTNAMES.has(targetUrl.hostname)) {
      return new Response('URL not allowed.', {
        status: 400,
        headers: NO_INDEX_HEADERS
      });
    }

    // Rebuild the Location from the parsed URL (never the raw query param)
    // so header injection and open-redirect tricks can't ride along.
    return new Response(null, {
      status: 302,
      headers: {
        'Location': targetUrl.toString(),
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex'
      }
    });
  }
};
