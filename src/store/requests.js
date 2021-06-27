import fetch from "node-fetch";
import bodies from "./authorizations";

const baseUrl = "https://id.twitch.tv/";
const eventUrl = "https://api.twitch.tv/helix/eventsub/subscriptions";
const helixUrl = "https://api.twitch.tv/helix/";

const store = {
    clientId: "",
    clientSecret: "",
    clientScope: "",
    accessToken: "",
    refreshToken: "",
    requestsIds: [],
};

export const getStore = () => store;
export const setStore = (prop, value) => store[prop] = value;

export const authorize = (clientId, clientRedirect, clientScope) => {
    return `${baseUrl}oauth2/authorize?client_id=${clientId}&redirect_uri=${clientRedirect}&response_type=code&scope=${clientScope}`;
};

export const getAccessToken = async (clientId, clientSecret, code, clientRedirect) => {
    const url = `${baseUrl}oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}&grant_type=authorization_code&redirect_uri=${clientRedirect}`;
    const response = await fetch(url, { method: "POST" });
    return await response.json();
};

export const getAppToken = async () => {
    const { clientId, clientSecret, clientScope } = getStore();
    const url = `${baseUrl}oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials&scope=${clientScope}`;
    const response = await fetch(url, { method: "POST" });
    return await response.json();
};

export const refreshAppToken = async () => {
    const { clientId, clientSecret, refreshToken } = getStore();
    const url = `${baseUrl}oauth2/token?grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${clientId}&client_secret=${clientSecret}`;
    const response = await fetch(url, { method: "POST" });
    return await response.json();
};

export const subscribeEvent = async (eventType, callback) => {
    const { clientId, clientSecret, accessToken } = getStore();
    const url = eventUrl;
    const headers = {
        "Client-ID": clientId,
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
    };
    const body = bodies.onair;
    body.type = eventType;
    body.transport.callback = callback;
    body.transport.secret = clientSecret;
    const response = await myFetch(url, "POST", headers, JSON.stringify(body));
    return await response.json();
};

export const activeEvent = async (challenge) => {
    const { clientId, accessToken } = getStore();
    const url = eventUrl;
    const headers = {
        "Client-ID": clientId,
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
    };
    const response = await await myFetch(url, "POST", headers, JSON.stringify(challenge));
    return response.json();
};

export const getEventsList = async () => {
    const { clientId, accessToken } = getStore();
    const url = eventUrl;
    const headers = {
        "Client-ID": clientId,
        "Authorization": `Bearer ${accessToken}`,
    };
    const response = await myFetch(url, "GET", headers);
    return response.json();
};

export const getChannelData = async (broadcaster_id) => {
    const { clientId, accessToken } = getStore();
    const url = `${helixUrl}channels?broadcaster_id=${broadcaster_id}`;
    const headers = {
        "Client-ID": clientId,
        "Authorization": `Bearer ${accessToken}`
    };
    const response = await myFetch(url, "GET", headers);
    return response.json();
};

export const getStreamData = async (broadcaster_id) => {
    const { clientId, accessToken } = getStore();
    const url = `${helixUrl}streams?user_id=${broadcaster_id}`;
    const headers = {
        "Client-ID": clientId,
        "Authorization": `Bearer ${accessToken}`
    };
    const response = await myFetch(url, "GET", headers);
    return response.json();
};

export const myFetch = async (url, method, headers, body) => {
    let response = await fetch(url, { method, headers, body });
    if ([400, 401, 402, 403].includes(response.status)) {
        const { access_token, refresh_token } = await refreshAppToken();
        setStore("accessToken", access_token);
        setStore("refreshToken", refresh_token);
        headers["Authorization"] = `Bearer ${access_token}`;
        response = await fetch(url, { method, headers, body});
    }
    return response;
};