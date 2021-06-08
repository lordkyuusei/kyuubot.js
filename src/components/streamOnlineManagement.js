import { MessageEmbed } from "discord.js";
import messages from '../store/messages.js';

const handleLive = (channels, channel, { data }) => {
    const liveChannel = channels.cache.get(channel);
    const streamOnlineEmbed = new MessageEmbed()
        .setColor('#EA2370')
        .setTitle("Kyuu's online!")
        .setURL("https://twitch.tv/lkyuusei")
        .setAuthor('El Kyuubot', messages.suc.KYUUBOT_LOGO, 'https://twitch.tv/lkyuusei')
        .setDescription("Check out https://twitch.tv/lkyuusei now!")
        .setThumbnail(messages.suc.SEKT_LOGO)
        .addFields(
            { name: "Présentement en vedette", value: data[0].game_name, },
            { name: "Titre", value: data[0].title, }
        )
        .setImage("https://static-cdn.jtvnw.net/previews-ttv/live_user_lkyuusei-1920x1080.jpg")
        .setTimestamp()
        .setFooter(`by Lord Kyuusei •`, messages.suc.KYUUBOT_LOGO);

    liveChannel.send(streamOnlineEmbed);
}

export default handleLive;
