const min_5 = 5 * 60 * 1000; // 5 minutes
const min_60 = 60 * 60 * 1000; // 60 minutes
const hours_9 = 9 * 60 * 60 * 1000; // 9 hours
const currentYear = new Date().getFullYear();
const threshold = 25;

function getPaddedMin() {
    const now = new Date();
    const minutes = Math.floor(now.getTime() / 60000) % 1000;
    return minutes.toString().padStart(3, '0');
}

async function makeProxyCall(targetUrl, key, ttlSec) {
    const cacheKey = `cache_${key}`;
    const cacheExpiryKey = `cache_expiry_${key}`;
    const cacheExpiryTime = ttlSec || 5 * 60 * 1000;
    const proxyUrl = 'https://proxy.cors.sh/';

    const cachedData = sessionStorage.getItem(cacheKey);
    const cachedExpiry = sessionStorage.getItem(cacheExpiryKey);

    if (cachedData && cachedExpiry && new Date().getTime() < cachedExpiry) {
        return cachedData;
    }
    try {

        const response = await fetch(proxyUrl + targetUrl);

        const data = await response.text();
        sessionStorage.setItem(cacheKey, data);
        sessionStorage.setItem(cacheExpiryKey, new Date().getTime() + cacheExpiryTime);

        return data;
    } catch (error) {
        console.error(`Error fetching data from URL: ${targetUrl}`, error);
        return cachedData;
    }
}

function removeDomainFrom(url) {
    return  new URL(url).pathname;
}

function getApplicationTable(tables) {
    let appTable;
    tables.forEach(table => {
        const th = table.querySelector('th');
        if (th && th.textContent === 'Application') {
            appTable = table;
        }
    });
    return appTable;
}