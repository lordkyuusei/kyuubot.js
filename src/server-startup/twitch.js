import fs from "fs";
import https from "https";
import express from "express";

import home from "../vues/home.js";

import { getStore, setStore, getAppToken } from "../store/requests";

import eventsListComponent from '../routes/eventsList';
import oauthenticationComponent from '../routes/oauthentication';
import { authorizationComponent, validationComponent, validationUpdateChannelComponent } from "../routes/eventSubscribe";

const setupStore = async (isDebugMode) => {
    const { TWITCH_ID, TWITCH_SECRET, TWITCH_SCOPE } = process.env;
    setStore("clientId", TWITCH_ID);
    setStore("clientSecret", TWITCH_SECRET);
    setStore("clientScope", TWITCH_SCOPE);

    const { access_token, refresh_token } = await getAppToken();
    setStore("accessToken", access_token);
    setStore("refreshToken", refresh_token);

    if (isDebugMode) {
        console.log(TWITCH_ID, TWITCH_SECRET, TWITCH_SCOPE, access_token, refresh_token);
    }
};

const setupTwitchService = async (config, client) => {
    const [eventsListRoute, eventsListCallback] = eventsListComponent();
    const [oauthenticationRoute, oauthenticationCallback] = oauthenticationComponent();
    const [authorizationRoute, authorizationCallback] = authorizationComponent(config.twitch);
    const [validationRoute, validationCallback] = validationComponent(client, config.onair);

    const app = express();
    app.use(express.json());

    app.get("/", (_, res) => {
        const { accessToken } = getStore();
        if (accessToken) {
            const onair = home(accessToken, "stream.online");
            const update = home(accessToken, "channel.update");
            const follow = home(accessToken, "channel.follow");
            const subs = `<a href='/api/twitch/events'><button>get events</button></a>`
            res.send(`<div>${onair}</div><div>${update}</div><div>${follow}</div><div>${subs}</div>`)
        } else {
            const homePage = home(null, "");
            res.send(homePage);
        }
    });

    app.get(eventsListRoute, eventsListCallback);
    app.post(validationRoute, validationCallback);
    app.get(authorizationRoute, authorizationCallback);
    app.get(oauthenticationRoute, oauthenticationCallback);

    if (process.env.NODE_ENV !== 'production') {
        const key = fs.readFileSync("./certs/server.key", "utf-8");
        const cert = fs.readFileSync("./certs/server.crt", "utf-8");
        const credentials = { key, cert };

        const httpsServer = https.createServer(credentials, app);
        httpsServer.listen(443, async () => await setupStore(true));
    } else {
        app.listen(process.env.PORT || 3000, async () => await setupStore(false));
    }
};

export default setupTwitchService;