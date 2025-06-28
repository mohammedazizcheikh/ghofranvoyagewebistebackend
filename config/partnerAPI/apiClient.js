const { Pool } = require("undici");
const {partnerApi} = require("../config");
const API_URL = partnerApi.url;

const CREDENTIAL = {
  Login: partnerApi.login,
  Password: partnerApi.password,
};

const pool = new Pool(API_URL);

// Cache structure: { data: ..., expiresAt: timestamp }
const cache = new Map();

// TTL for cache entries in milliseconds (e.g. 5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

async function post(method, data) {
  const cacheKey = method + JSON.stringify(data);

  // Check cache and expiry
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const url = `/Postman/postman.php?url=${method}`;
  const requestParam = encodeURIComponent(
    JSON.stringify({
      Credential: CREDENTIAL,
      ...data,
    })
  );
  const finalUrl = `${url}&request=${requestParam}&HTTP_HOST=`;

  try {
    const { body, statusCode } = await pool.request({
      path: finalUrl,
      method: "GET",
      headers: {
        Accept: "text/plain, */*; q=0.01",
        "Content-Type": "application/json",
        "x-requested-with": "XMLHttpRequest",
      },
    });

    if (statusCode !== 200) {
      throw new Error(`API responded with status ${statusCode}`);
    }

    let responseBody = await body.text();
    responseBody = responseBody.replace(/<pre>|<\/pre>/g, "").trim();

    const json = JSON.parse(responseBody);

    // Save to cache with expiry
    cache.set(cacheKey, { data: json, expiresAt: Date.now() + CACHE_TTL });

    return json;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
}

module.exports = {
  listCity: () => post("ListCity", {}),
  listTag: () => post("ListTag", {}),
  ListCategorie: () => post("ListCategorie", {}),
  listHotels: () => post("ListHotels", {}),
  listThemes: () => post("ListThemes", {}),
  // Add more as needed
};
