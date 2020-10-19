const Discord = require('discord.js');
const config = require('./config.json');

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

client.once('ready', () => {
    console.log("Ready!");
})

const filter = (message_id) => message_id === config.roles.message_id;

client.on('messageReactionAdd', async (reaction, user) => {
    const { id } = reaction.message;
    if (!filter(id)) return;

	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error);
			return;
		}
	}

    const pair = config.reactionsToRoleMap.find(pair => pair.emoji === reaction._emoji.name);
    if (pair) {
        const { channel } = reaction.message;
        const role = channel.guild.roles.cache.find(role => role.name === pair.role);
        const member = channel.guild.members.cache.find(member => member.id === user.id);
        if (!member.roles.cache.has(role.id)) {
            member.roles.add(role);
            console.log(`Successfully added role ${role.name} to ${member.nickname || member.user.username}!`);
        } else {
            console.log(`${role.name} is already assigned to ${member.nickname || member.user.username}!`);
        }
    } else {
        console.error(`${reaction._emoji.name} doesn't enable any role.`);
    }
});

client.on('messageReactionRemove', async (reaction, user) => {
    const { id } = reaction.message;
    if (!filter(id)) return;

	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error);
			return;
		}
	}

    const pair = config.reactionsToRoleMap.find(pair => pair.emoji === reaction._emoji.name);
    if (pair) {
        const { channel } = reaction.message;
        const role = channel.guild.roles.cache.find(role => role.name === pair.role);
        const member = channel.guild.members.cache.find(member => member.id === user.id);
        if (member.roles.cache.has(role.id)) {
            member.roles.remove(role);
            console.log(`Successfully removed role ${role.name} to ${member.nickname || member.user.username}!`);
        } else {
            console.log(`${role.name} is not assigned to ${member.nickname || member.user.username}!`);
        }
    } else {
        console.error(`${reaction._emoji.name} doesn't enable any role.`);
    }
});

client.login(config.meta.token);