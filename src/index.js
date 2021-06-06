import Discord from "discord.js";
import express from "express";
import fs from "fs";
import https from "https";

import { getStore, setStore, getAppToken } from "./store/requests";
import handleGuildJoin from "./components/guildArrivalComponent.js";
import handleCommands from "./components/commandsComponent.js";
import handleRoleReact from "./components/roleManagementComponent.js";
import handleUpdates from "./components/updatesManagement.js";
import handleLive from "./components/streamOnlineManagement.js";

import home from "./vues/home.js";

import { authorizationComponent, validationComponent} from "./routes/eventSubscribe";
import oauthenticationComponent from './routes/oauthentication';
import eventsListComponent from './routes/eventsList';

import config from "../config.json";
import { version } from "../package.json";

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

const app = express();
app.use(express.json());

config.meta.token = process.env.TOKEN;
config.twitch.redirectUri = process.env.TWITCH_REDIRECT;
config.twitch.eventCallback = process.env.TWITCH_EVENT_CB;

const [authorizationRoute, authorizationCallback] = authorizationComponent(config.twitch);
const [validationRoute, validationCallback] = validationComponent(handleLive, client, config.onair);
const [oauthenticationRoute, oauthenticationCallback] = oauthenticationComponent()
const [eventsListRoute, eventsListCallback] = eventsListComponent();

app.get("/", (req, res) => {
  const { accessToken } = getStore();
  if (accessToken) {
    const onair = home(accessToken, "stream.online");
    const follow = home(accessToken, "channel.follow");
    const subs = `<a href='/api/twitch/events'><button>get events</button></a>`
    res.send(`<div>${onair}</div><div>${follow}</div><div>${subs}</div>`)
  } else {
    const homePage = home(null, "");
    res.send(homePage);
  }
});

app.get(authorizationRoute, authorizationCallback);
app.post(validationRoute, validationCallback);
app.get(oauthenticationRoute, oauthenticationCallback);
app.get(eventsListRoute, eventsListCallback);

if (process.env.NODE_ENV !== 'production') {
  const key = fs.readFileSync("./certs/server.key", "utf-8");
  const cert = fs.readFileSync("./certs/server.crt", "utf-8");

  const credentials = { key, cert };
  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(443, async () => {
    const { TWITCH_ID, TWITCH_SECRET, TWITCH_SCOPE } = process.env;
    setStore("clientId", TWITCH_ID);
    setStore("clientSecret", TWITCH_SECRET);
    setStore("clientScope", TWITCH_SCOPE);

    const response = await getAppToken();
    const { access_token, refresh_token } = response;
    setStore("accessToken", access_token);
    setStore("refreshToken", refresh_token);
  });
} else {
  app.listen(process.env.PORT || 3000, async () => {
    const { TWITCH_ID, TWITCH_SECRET, TWITCH_SCOPE } = process.env;
    setStore("clientId", TWITCH_ID);
    setStore("clientSecret", TWITCH_SECRET);
    setStore("clientScope", TWITCH_SCOPE);

    const response = await getAppToken();
    const { access_token, refresh_token } = response;
    setStore("accessToken", access_token);
    setStore("refreshToken", refresh_token);
  });
}

const handleMessage = (config, message) => {
    const { prefix, commands } = config.meta;
    const { content } = message;

    const command = commands.find(command => content.startsWith(`${prefix}${command.name}`));
    if (command) {
        handleCommands(command, message);
    }
}

client.once('ready', () => handleUpdates(client, config, version));
client.on('guildMemberAdd', member => handleGuildJoin(config, member));
client.on('messageReactionAdd', (reaction, user) => handleRoleReact(config, reaction, user, true));
client.on('messageReactionRemove', (reaction, user) => handleRoleReact(config, reaction, user, false));
client.on('message', async message => handleMessage(config, message));

client.login(config.meta.token);