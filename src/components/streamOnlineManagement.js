import { MessageEmbed } from "discord.js";
import messages from '../store/messages.js';

const handleLive = (channels, channel, body) => {
    console.log(body);

    const liveChannel = channels.cache.get(channel);
    const streamOnlineEmbed = new MessageEmbed()
        .setColor('#EA2370')
        .setTitle("Kyuu's online!")
        .setURL("https://twitch.tv/lkyuusei")
        .setAuthor('El Kyuubot', messages.suc.KYUUBOT_LOGO, 'https://twitch.tv/lkyuusei')
        .setDescription("Check out https://twitch.tv/lkyuusei now!")
        .setThumbnail(messages.suc.SEKT_LOGO)
        .addFields(
            { name: "Now playing", value: "Ici c le nom du jeu en fait", },
            { name: "Stream status", value: "Ici c le nom du live là", }
        )
        .setImage("https://static-cdn.jtvnw.net/previews-ttv/live_user_lkyuusei-1920x1080.jpg?=48974")
        .setTimestamp()
        .setFooter(`by Lord Kyuusei •`, messages.suc.KYUUBOT_LOGO);

    liveChannel.send(streamOnlineEmbed);
}

export default handleLive;