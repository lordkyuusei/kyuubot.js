import fetch from "node-fetch";
import bodies from "./authorizations";

const baseUrl = "https://id.twitch.tv/";
const eventUrl = "https://api.twitch.tv/helix/eventsub/subscriptions";

const store = {
    accessToken: "",
    refreshToken: "",
};

export const getStore = () => store;
export const setStore = (prop, value) => store[prop] = value;

export const authorize = (clientId, clientRedirect, clientScope) => {
    return `${baseUrl}oauth2/authorize?client_id=${clientId}&redirect_uri=${clientRedirect}&response_type=code&scope=${clientScope}`;
}

export const getAccessToken = async (clientId, clientSecret, code, clientRedirect) => {
    const url = `${baseUrl}oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}&grant_type=authorization_code&redirect_uri=${clientRedirect}`;
    const response = await fetch(url, { method: "POST" });
    return await response.json();
}

export const getAppToken = async (clientId, clientSecret, clientScope) => {
    const url = `${baseUrl}oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials&scope=${clientScope}`;
    const response = await fetch(url, { method: "POST" });
    return await response.json();
}

export const refreshAccessToken = async (clientId, clientSecret, refreshToken) => {
    const url = `${baseUrl}oauth2/token?grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${clientId}&client_secret=${clientSecret}`;
    const response = await fetch(url, { method: "POST" });
    return await response.json();
}

export const subscribeEvent = async (clientId, accessToken, eventType, callback, secret) => {
    const url = eventUrl;
    const headers = {
        "Client-ID": clientId,
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
    };
    const body = bodies.onair;
    body.type = eventType;
    body.transport.callback = callback;
    body.transport.secret = secret;
    const response = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
    return await response.json();
}

export const activeEvent = async (challenge, clientId, accessToken) => {
    const url = eventUrl;
    const headers = {
        "Client-ID": clientId,
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
    };
    const response = await fetch(url, { method: "POST", headers, body: JSON.stringify(challenge)});
    return response.json();
}