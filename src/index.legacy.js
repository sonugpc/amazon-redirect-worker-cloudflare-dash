export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('o');
    
    // Check if URL parameter exists
    if (!targetUrl) {
      return new Response(generateHTML(null, true), {
        headers: { 'Content-Type': 'text/html' },
        status: 400
      });
    }
    
    // Validate if the URL is from amazon.in
    let invalid = false;
    try {
      const parsedUrl = new URL(targetUrl);
      if (parsedUrl.hostname !== 'www.amazon.in') {
        invalid = true;
      }
    } catch (e) {
      invalid = true;
    }
    
    const logo = {
      'amazon': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'
    };
    
    // Generate HTML response
    const html = generateHTML(targetUrl, invalid, logo.amazon);
    
    return new Response(html, {
      headers: { 
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
      }
    });
  }
};

function generateHTML(targetUrl, invalid, logoUrl = '') {
  const metaRefresh = !invalid && targetUrl ? `<meta http-equiv="refresh" content="0;URL='${targetUrl}'" />` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirecting...</title>
    <meta name="robots" content="noindex">
    ${metaRefresh}
    <style>
        body, html {
            height: 100%;
            margin: 0;
            font-family: 'Inter', sans-serif;
            background-color: #f0f2f5;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
            padding: 40px;
            text-align: center;
            max-width: 400px;
            width: 90%;
        }
        .logo {
            max-width: 150px;
            margin-bottom: 20px;
        }
        .partner-logo {
            max-width: 120px;
            margin: 20px 0;
        }
        h2 {
            font-size: 1.25rem;
            color: #333;
            margin: 0 0 15px;
        }
        p {
            color: #666;
            margin: 0 0 25px;
        }
        .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border-left-color: #007aff;
            animation: spin 1s ease infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .footer-text {
            font-size: 0.9rem;
            color: #888;
            margin-top: 20px;
        }
        .error-message {
            color: #d9534f;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="https://www.bigtricks.in/wp-content/uploads/2021/01/bt4-.png" alt="Bigtricks.in" class="logo">
        
        ${invalid ? 
            `<p class="error-message">Invalid or missing URL. Please check the link and try again.</p>` :
            `
            <h2>Redirecting to Amazon</h2>
            <p>Please wait while we securely transfer you to Amazon.</p>
            <div class="spinner"></div>
            <img src="${logoUrl}" alt="Amazon" class="partner-logo">
            `
        }
        
        <p class="footer-text">Thank you for visiting Bigtricks!</p>
        <p class="footer-text" style="font-size: 0.8rem; color: #999; margin-top: 10px;">As an Amazon Associate, we earn from qualifying purchases.</p>
    </div>
</body>
</html>`;
}
