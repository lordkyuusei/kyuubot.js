import { MessageEmbed } from "discord.js";
import messages from '../store/messages.js';

const handleLive = (channels, channel, body) => {
    console.log(body);

    const liveChannel = channels.cache.get(channel);
    const streamOnlineEmbed = new MessageEmbed()
    .setTitle("Kyuu's online!")
    .setDescription("Test de description")
    .setColor('#0099ff')
    .setAuthor('The Kyuubot!', messages.suc.KYUUBOT_LOGO, 'https://discord.js.org')
    .setThumbnail(messages.suc.SEKT_LOGO)
    .setTimestamp()
    .setFooter(`by Lord Kyuusei •`, messages.suc.KYUUBOT_LOGO);

    liveChannel.send(streamOnlineEmbed);
}

export default handleLive;