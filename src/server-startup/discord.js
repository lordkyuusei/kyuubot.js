import Discord from "discord.js";

import { version } from "../../package.json";

import handleCommands from "../components/commandsComponent.js";
import handleUpdates from "../components/updatesManagement.js";
import handleGuildJoin from "../components/guildArrivalComponent.js";
import handleRoleReact from "../components/roleManagementComponent.js";

const setupDiscordClient = (config) => {
    const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });
    const handleMessage = (config, message) => {
        const { prefix, commands } = config.meta;
        const { content } = message;

        const command = commands.find(command => content.startsWith(`${prefix}${command.name}`));
        if (command) {
            handleCommands(command, message);
        }
    }
    client.once('ready', () => handleUpdates(client, config, version));

    client.on('message', async message => handleMessage(config, message));
    client.on('guildMemberAdd', member => handleGuildJoin(config, member, client));
    client.on('messageReactionAdd', (reaction, user) => handleRoleReact(config, reaction, user, true));
    client.on('messageReactionRemove', (reaction, user) => handleRoleReact(config, reaction, user, false));

    client.login(config.meta.token);
    return client;
};

export default setupDiscordClient;