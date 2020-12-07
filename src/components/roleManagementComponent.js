const filter = (config, message_id) => message_id === config.roles.message_id;

const prepare = async (config, reaction) => {
    const { id } = reaction.message;
    if (!filter(config, id)) return false;

	if (reaction.partial) {
		try {
            await reaction.fetch();
            return true;
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error);
			return false;
		}
    } else {
        return true;
    }
}

const updateRole = (config, reaction, user, isAdd) =>
    prepare(config, reaction)
        .then(output => {
            if (!output) return false;        
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
        })
        .catch(err => console.error(err));

export default updateRole;