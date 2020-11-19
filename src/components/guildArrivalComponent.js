const guildMemberAdd = (config, member) => {
    const guest = config.reactionsToRoleMap.find(role => role.emoji === '🍁');
    const role = member.guild.roles.cache.find(role => role.name === guest.role);
    member.roles.add(role);
    console.log(`Successfully added role ${role.name} to ${member.nickname || member.user.username}!`);
}

export default guildMemberAdd;
