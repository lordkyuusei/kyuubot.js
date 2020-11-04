const filter = (config, message_id) => message_id === config.roles.message_id;

<<<<<<< HEAD:src/components/roleManagementComponent.js
const prepare = async (config, reaction) => {
=======
const argv = process.argv.slice(2);
const command = argv[0];
const token = argv[1];

if (command === '--token') {
    config.meta.token = token;
}

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

client.once('ready', () => {})

const filter = (message_id) => message_id === config.roles.message_id;

client.on('guildMemberAdd', member => {
    const guest = config.reactionsToRoleMap.find(role => role.emoji === '🍁');
    const role = member.guild.roles.cache.find(role => role.name === guest.name);
    member.roles.add(role);
    console.log(`Successfully added role ${role.name} to ${member.nickname || member.user.username}!`);
});

const prepare = async (reaction) => {
>>>>>>> dd1c1ec862138537a3bf335a2895f5c2634a77ce:index.js
    const { id } = reaction.message;
    if (!filter(config, id)) return;

	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error);
			return;
		}
    }
}

const updateRole = (config, reaction, user, isAdd) => {
    prepare(config, reaction);
    const pair = config.reactionsToRoleMap.find(pair => pair.emoji === reaction._emoji.name);

    if (pair) {
        const { channel } = reaction.message;
        const role = channel.guild.roles.cache.find(role => role.name === pair.role);
        const member = channel.guild.members.cache.find(member => member.id === user.id);

        // If the role is not assigned...
        if (!member.roles.cache.has(role.id)) {
            // ... and we want it to be, then we add it
            if (isAdd) {
                member.roles.add(role);
                console.log(`Successfully added role ${role.name} to ${member.nickname || member.user.username}!`);
            }
            // Otherwise, we don't do anything.
            else {
                console.log(`${role.name} is not assigned to ${member.nickname || member.user.username}!`);
            }
        } 
        
        // If the role is assigned...
        else {
            // ... but we don't want it to be, then we remove it
            if (!isAdd) {
                member.roles.remove(role);
                console.log(`Successfully removed role ${role.name} to ${member.nickname || member.user.username}!`);    
            }
            
            // Otherwise, guess what
            else {
                console.log(`${role.name} is already assigned to ${member.nickname || member.user.username}!`);
            }
        }
    } else {
        console.error(`${reaction._emoji.name} doesn't enable any role.`);
    }
}

export default updateRole;