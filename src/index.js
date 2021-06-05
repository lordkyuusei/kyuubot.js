import Discord from "discord.js";
import express from "express";
import fs from "fs";
import http from "http";
import https from "https";

import handleGuildJoin from "./components/guildArrivalComponent.js";
import handleCommands from "./components/commandsComponent.js";
import handleRoleReact from "./components/roleManagementComponent.js";
import handleUpdates from "./components/updatesManagement.js";

import { authorizationComponent, validationComponent} from "./routes/eventSubscribe";
import oauthenticationComponent from './routes/oauthentication';

import config from "../config.json";
import { version } from "../package.json";

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const app = express()

config.meta.token = process.env.TOKEN;
config.twitch.id = process.env.TWITCH_ID;
config.twitch.secret = process.env.TWITCH_SECRET;
config.twitch.redirectUri = process.env.TWITCH_REDIRECT;
config.twitch.scope = process.env.TWITCH_SCOPE;
config.twitch.eventCallback = process.env.TWITCH_EVENT_CB;

const [authorizationRoute, authorizationCallback] = authorizationComponent(config.twitch);
const [validationRoute, validationCallback] = validationComponent(config.twitch);
const [oauthenticationRoute, oauthenticationCallback] = oauthenticationComponent(config.twitch)

app.get("/", (req, res) => {
  const { accessToken } = req.query;
  const display = accessToken ? `<h1>${accessToken}</h1><a href='/api/twitch/eventSubscribe?accessToken=${accessToken}'>event sub</a>` : "<div><a href='/api/twitch/oauth'>oauth</a></div>";
  res.send(display);
});

app.get(authorizationRoute, authorizationCallback);
app.post(validationRoute, validationCallback);
app.get(oauthenticationRoute, oauthenticationCallback);

if (process.env.NODE_ENV !== 'production') {
  const key = fs.readFileSync("./certs/server.key", "utf-8");
  const cert = fs.readFileSync("./certs/server.crt", "utf-8");

  const credentials = { key, cert };
  const httpServer = http.createServer(app);
  const httpsServer = https.createServer(credentials, app);

  httpServer.listen(3000);
  httpsServer.listen(8443);
} else {
  app.listen(process.env.PORT || 3000, 
    () => console.log("Server is running..."));
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