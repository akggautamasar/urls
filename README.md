🔗 QuantX Shortener
QuantX Shortener is a fast, efficient, and reliable URL shortening service built on Cloudflare Workers and KV. It allows users to convert long, unwieldy URLs into concise, shareable links, making them easier to manage and distribute.

✨ Features
URL Shortening: Convert any long URL into a short, unique link.

Persistent Storage: Utilizes Cloudflare Workers KV to ensure your shortened URLs are saved and accessible permanently.

Instant Redirection: Shortened links redirect instantly to their original destination.

User-Friendly Interface: A simple and intuitive web interface for shortening URLs.

Copy to Clipboard: Easily copy the generated short URL with a single click.

Direct Visit: Instantly open the shortened URL in a new tab.

Responsive Design: Optimized for a seamless experience across various devices (desktop, tablet, mobile).

🛠️ Technologies Used
Cloudflare Workers: For serverless backend logic and edge deployment.

Cloudflare Workers KV: A distributed key-value store for persistent URL mapping.

HTML5: Structure of the web page.

Tailwind CSS: A utility-first CSS framework for rapid and responsive styling.

JavaScript: For frontend interactivity and communication with the Cloudflare Worker.

🚀 Setup Instructions
To get your QuantX Shortener running, you'll need to deploy the Cloudflare Worker and set up a KV Namespace.

1. Deploy the Cloudflare Worker
The core logic of the URL shortener resides in a Cloudflare Worker.

Worker Code: Use the workers.js file (provided in previous interactions) as your Worker script. This code includes the logic for handling /shorten (POST) and /s/{shortCode} (GET) requests.

Deployment: Deploy this JavaScript code to your Cloudflare account as a Worker. You can do this via the Cloudflare Dashboard or using the wrangler CLI tool.

2. Configure Cloudflare Workers KV
For persistent storage of your URL mappings, you must bind a KV Namespace to your Worker.

Using wrangler CLI (Recommended)
Create KV Namespace:

wrangler kv:namespace create URL_STORE

This command will output a binding name and an id.

Update wrangler.toml: Add the outputted kv_namespaces block to your wrangler.toml file:

kv_namespaces = [
  { binding = "URL_STORE", id = "YOUR_GENERATED_KV_ID" }
]

Ensure the binding name URL_STORE matches the env.URL_STORE used in your Worker's JavaScript code.

Redeploy Worker: After updating wrangler.toml, redeploy your Worker:

wrangler deploy

Using Cloudflare Dashboard
Create KV Namespace:

Log in to your Cloudflare Dashboard.

Navigate to Workers & Pages -> KV (under Storage).

Click "Create a namespace" and give it a name (e.g., quantx-shortener-data).

Bind to Worker:

Go back to Workers & Pages -> Overview.

Click on your deployed Worker (e.g., urls.worksbeyondworks.workers.dev).

Go to the "Settings" tab.

Under "Variables", find "KV Namespace Bindings" and click "Add binding".

Set "Variable name" to URL_STORE.

Select the KV Namespace you just created from the "KV namespace" dropdown.

Click "Save and deploy".

3. Set up the Frontend (Homepage)
The provided index.html (or quantx-shortener.html) file serves as the frontend for your URL shortener.

Save the HTML: Save the HTML code to a file named index.html (or any .html extension) on your local machine.

Update Worker URL: Open the index.html file in a text editor and locate the WORKER_URL constant in the <script> section:

const WORKER_URL = "https://urls.worksbeyondworks.workers.dev"; // Your URL here!

Replace "https://urls.worksbeyondworks.workers.dev" with the actual URL of your deployed Cloudflare Worker.

Open in Browser: Open the saved index.html file directly in your web browser.

🚀 How to Use
Open the Homepage: Navigate to your index.html file in your web browser.

Enter Long URL: In the input field labeled "Enter a long URL:", paste or type the URL you wish to shorten.

Shorten URL: Click the "Shorten URL" button.

View Results: The shortened URL will appear in the "Your Shortened URL:" section.

Copy or Visit:

Click the "Copy" button to copy the short URL to your clipboard.

Click the "Visit" button to open the shortened URL in a new browser tab.

🤝 Support
If you encounter any issues or have questions, please refer to the Cloudflare Workers documentation or community forums.
