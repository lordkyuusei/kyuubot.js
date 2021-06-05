import crypto from "crypto";

const hmacSign = async (key, message) => {
    const g = (str) => new Uint8Array([...unescape(encodeURIComponent(str))].map(c => c.charCodeAt(0)));
    const k = g(key);
    const m = g(message);
    const c = await crypto.subtle.importKey('raw', k, { name: "HMAC", hash: "SHA-256" }, true, ['sign']);
    const s = await crypto.subtle.sign("HMAC", c, m);
    [...new Uint8Array(s)].map(b => b.toString(16).padStart(2, '0')).join('');
    return btoa(String.fromCharCode(...new Uint8Array(s)));
}

export default hmacSign;