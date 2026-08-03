# CoerVora AI — Widget Integration Guide

## Quick Start

Add CoerVora AI chatbot to any website with a single line of code.

### 1. Get Your Embed Token

After creating and training a chatbot in the CoerVora AI dashboard:
1. Go to **Chatbots** → Select your chatbot → **Settings**
2. Copy the **Embed Token** from the Widget section

### 2. Add the Script

Paste this code before the closing `</body>` tag of your website:

```html
<script
  async
  src="https://your-coervora-domain.com/widget/v1/loader.js"
  data-chatbot-id="YOUR_EMBED_TOKEN"
  data-theme="dark"
  data-position="bottom-right"
></script>
```

### 3. Configuration Options

| Attribute | Values | Default | Description |
|-----------|--------|---------|-------------|
| `data-chatbot-id` | string | *(required)* | Your chatbot's embed token |
| `data-theme` | `dark`, `light` | `dark` | Widget color theme |
| `data-position` | `bottom-right`, `bottom-left` | `bottom-right` | Widget position |
| `data-primary-color` | hex color | `#6366f1` | Primary accent color |
| `data-bubble-text` | string | `Chat with us` | Tooltip on the chat bubble |

### Example with Custom Options

```html
<script
  async
  src="https://your-coervora-domain.com/widget/v1/loader.js"
  data-chatbot-id="abc123def456"
  data-theme="light"
  data-position="bottom-left"
  data-primary-color="#8b5cf6"
  data-bubble-text="Need help?"
></script>
```

## How It Works

1. The loader script (`loader.js`) is loaded asynchronously — it never blocks your page
2. It creates a floating chat bubble button on your page
3. When clicked, it opens an iframe containing the chat interface
4. The iframe communicates with the CoerVora AI backend via REST API
5. All styles are fully isolated — no CSS conflicts with your site

## Security

- The widget uses **iframe isolation** for complete CSS/JS sandboxing
- All communication uses **HTTPS** and **origin validation**
- The embed token is public-facing but only grants chat access (no admin capabilities)
- Rate limiting prevents abuse

## Framework-Specific Guides

### React / Next.js
```jsx
// Add to your layout or page component
useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://your-domain.com/widget/v1/loader.js';
  script.async = true;
  script.setAttribute('data-chatbot-id', 'YOUR_TOKEN');
  document.body.appendChild(script);
  return () => document.body.removeChild(script);
}, []);
```

### WordPress
Add the script tag to your theme's `footer.php` or use a plugin like "Insert Headers and Footers".

### Shopify
Add the script to **Online Store → Themes → Edit Code → theme.liquid** before `</body>`.
