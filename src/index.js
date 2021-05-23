import Discord from "discord.js";
import Express from "express";

import config from "../config.json";
import { version } from "../package.json";

import handleGuildJoin from "./components/guildArrivalComponent.js";
import handleCommands from "./components/commandsComponent.js";
import handleRoleReact from "./components/roleManagementComponent.js";
import handleUpdates from "./components/updatesManagement.js";

config.meta.token = process.env.TOKEN;

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const web = new Express();

web.use(Express.static("public"));
web.get("/", (req, res) => res.send("<h1>Nope.</h1>"));
web.listen(process.env.PORT || 3000, () => console.log("Running."));

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