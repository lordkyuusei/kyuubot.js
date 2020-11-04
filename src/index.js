import Discord from "discord.js";
import config from "../config.json";

import handleGuildJoin from "./components/guildArrivalComponent.js";
import handleCommands from "./components/commandsComponent.js";
import handleRoleReact from "./components/roleManagementComponent.js";

const argv = process.argv.slice(2);
const arg = argv[0];
const token = argv[1];

if (arg === '--token') {
    config.meta.token = token;
}

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

const handleMessage = (config, message) => {
    const { prefix, commands } = config.meta;
    const { content } = message;

    const command = commands.find(command => content.startsWith(`${prefix}${command.name}`));
    if (command) {
        handleCommands(command, message);
    }
}

client.once('ready', () => {})

client.on('guildMemberAdd', member => handleGuildJoin(config, member));
client.on('messageReactionAdd', (reaction, user) => handleRoleReact(config, reaction, user, true));
client.on('messageReactionRemove', (reaction, user) => handleRoleReact(config, reaction, user, false));
client.on('message', async message => handleMessage(config, message));

client.login(config.meta.token);