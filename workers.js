// Remove this line, as we will use KV for storage:
// const URL_MAP = new Map();

// CORS Fix Start
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

async function handleOptions(request) {
    if (
        request.headers.get("Origin") !== null &&
        request.headers.get("Access-Control-Request-Method") !== null &&
        request.headers.get("Access-Control-Request-Headers") !== null
    ) {
        return new Response(null, {
            headers: corsHeaders,
        });
    } else {
        return new Response(null, {
            headers: {
                Allow: "GET, HEAD, POST, OPTIONS",
            },
        });
    }
}
// CORS Fix End

function generateRandomString(length) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        randomString += chars.substring(randomIndex, randomIndex + 1);
    }
    return randomString;
}

export default {
    // Note: The 'env' parameter is where KV bindings will be available
    async fetch(request, env, ctx) { // Ensure 'env' is passed here
        if (request.method === "OPTIONS") {
            return await handleOptions(request);
        }

        const url = new URL(request.url);
        const path = url.pathname;

        if (request.method === "POST" && path === "/shorten") {
            try {
                const { longUrl } = await request.json();
                if (!longUrl || typeof longUrl !== 'string') {
                    return new Response(JSON.stringify({ error: "Invalid 'longUrl' provided." }), {
                        status: 400,
                        headers: { "Content-Type": "application/json", ...corsHeaders },
                    });
                }

                // Check if the longUrl already exists to avoid duplicate short codes for the same URL (optional)
                // This is a more advanced feature and requires iterating KV keys or storing a reverse map.
                // For simplicity, we'll generate a new short code each time for now.

                let shortCode;
                let existsInKv;
                do {
                    shortCode = generateRandomString(6);
                    // Check if this short code already exists in KV
                    existsInKv = await env.URL_STORE.get(shortCode); // Use env.URL_STORE
                } while (existsInKv !== null); // Loop until we find a unique short code

                // Store the mapping in KV: await env.KV_NAMESPACE.put(key, value);
                await env.URL_STORE.put(shortCode, longUrl); // Use env.URL_STORE.put

                const shortUrl = `${url.origin}/s/${shortCode}`;

                return new Response(JSON.stringify({ shortUrl, longUrl }), {
                    status: 200,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                });
            } catch (error) {
                console.error("Error processing POST request:", error);
                return new Response(JSON.stringify({ error: "Failed to shorten URL.", details: error.message }), {
                    status: 500,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                });
            }
        }

        if (request.method === "GET" && path.startsWith("/s/")) {
            const shortCode = path.substring(3);

            // Retrieve the original URL from KV: await env.KV_NAMESPACE.get(key);
            const longUrl = await env.URL_STORE.get(shortCode); // Use env.URL_STORE.get

            if (longUrl) {
                return Response.redirect(longUrl, 302);
            } else {
                return new Response("Short URL not found.", {
                    status: 404,
                    headers: corsHeaders,
                });
            }
        }

        return new Response('URL Shortener Worker is running!\n\nUsage:\n- POST /shorten with {"longUrl": "your_long_url"}\n- GET /s/{shortCode} to redirect', {
            status: 200,
            headers: corsHeaders,
        });
    }
};
