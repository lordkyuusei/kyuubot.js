const guildMemberAdd = (config, member, { channels }) => {
    const guest = config.reactionsToRoleMap.find(role => role.emoji === '🍁');
    const role = member.guild.roles.cache.find(role => role.name === guest.role);
    const arrivalChannel = channels.cache.get(config.arrival.channel_id);
    member.roles.add(role);
    arrivalChannel.send(`J'te souhaite, comme on dit, la bienvenue dans la S.E.K.T., @${member.user.username} !`);
    console.log(`Successfully added role ${role.name} to ${member.nickname || member.user.username}!`);
    setTimeout(() => {
        member.roles.remove(role)
        console.log(`Successfully removed role ${role.name} to ${member.nickname || member.user.username}!`);
    }, 1000 * 60 * 10);
}

export default guildMemberAdd;
