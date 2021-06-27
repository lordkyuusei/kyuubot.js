import fs from "fs";

const changelogs = "./changelog/";

const publishLastUpdates = (updatesChannel, version) => {
    const changelog = fs.readFileSync(`${changelogs}kyuubot.js-v${version}.md`, 'utf8');
    updatesChannel.send(`\`\`\`md\n${changelog}\`\`\``);
}

const handleUpdates = ({ channels }, config, version) => {
    const channel = config.updates.channel_id;
    const updatesChannel = channels.cache.get(channel);
    const messages = updatesChannel.messages.fetch({ limit: 1 }).then(messages => {
        const lastChangelog = messages.first() ?? "";
        const isChangelogLastVersion = lastChangelog.content.includes(version);
        return isChangelogLastVersion ? 0 : publishLastUpdates(updatesChannel, version);
    })
}

export default handleUpdates;