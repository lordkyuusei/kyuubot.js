import Discord from "discord.js";
const express = require("express")

import config from "../config.json";
import { version } from "../package.json";

import handleGuildJoin from "./components/guildArrivalComponent.js";
import handleCommands from "./components/commandsComponent.js";
import handleRoleReact from "./components/roleManagementComponent.js";
import handleUpdates from "./components/updatesManagement.js";

import authorizationComponent from "./routes/authorization";
import oauthenticationComponent from './routes/oauthentication';

import bodies from "./store/authorizations";

config.meta.token = process.env.TOKEN;
config.twitch.twitchId = process.env.TWITCH_ID;
config.twitch.twitchSt = process.env.TWITCH_SECRET;
config.twitch.twitchRu = process.env.TWITCH_REDIRECT;
config.twitch.twitchSc = process.env.TWITCH_SCOPE;

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const app = express()

app.get("/", function (req, res) {
  res.send("<h1>Hello World!</h1>")
})

const [authorizationRoute, authorizationCallback] = authorizationComponent(bodies.onair, config.twitch.twitchId);
app.get(authorizationRoute, authorizationCallback);

const [oauthenticationRoute, oauthenticationCallback] = oauthenticationComponent(config.twitch)
app.get(oauthenticationRoute, oauthenticationCallback);

app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running..."));

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