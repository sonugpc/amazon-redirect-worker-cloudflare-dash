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
      'amazon': 'https://www.bigtricks.in/wp-content/uploads/2020/06/amazon-logo-150x100.png'
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
  const metaRefresh = !invalid && targetUrl ? 
    `<meta http-equiv="refresh" content="0;URL='${targetUrl}'" />` : '';
  
  return `<!DOCTYPE html>
<html>
<head>
    <meta name="theme-color" content="#007aff" />
    <meta name="viewport" content="width=device-width" />
    <meta name="Referrer" content="origin" />
    <meta name="robots" content="noindex" />
    <style type="text/css">
        body, html {
            height: 100%;
            margin: 0;
            font-family: helvetica;
            font-weight: 100;
            z-index: 1;
        }
        .redirectbox {
            height: 350px;
            background-color: #ffffff;
            border-width: 1px;
            border-radius: 1rem;
            border: 1px solid #eee;
            width: 80vw;
            box-shadow: 0 12px 25px rgb(0 0 0 / 20%);
            border: transparent;
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
        }
        body {
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
        }
    </style>
    <title>Redirecting to Amazon</title>
    ${metaRefresh}
</head>
<body>
    <div class="redirectbox">
        <div align="center" style="margin-top:5px">
            <img width="auto" src="https://www.bigtricks.in/wp-content/uploads/2021/01/bt4-.png" alt="Bigtricks.in, Free Recharge Tricks, Cashback Offers & Loot Deals">
        </div>
        <div align="center">
            <b><span id="lblRedirect">Redirecting you to Partner website Please Wait.....</span></b>
        </div>
        <div align="center">
            ${!invalid && targetUrl ? 
                `<img id="Image1" src="${logoUrl}" style="height:100px;" />` : 
                'Invalid URL'
            }
        </div>
        <div>
            <b><span id="lblKeep">Keep Visiting us For more offers & deals</span></b>
        </div>
    </div>
</body>
</html>`;
}