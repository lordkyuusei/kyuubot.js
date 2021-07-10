import { MessageEmbed } from "discord.js";
import messages from '../store/messages.js';

export const handleUpdate = (channels, channel, { data }) => {
    const liveChannel = channels.cache.get(channel);
    if (liveChannel) {
        const streamOnlineEmbed = new MessageEmbed()
            .setColor('#0C7CDE')
            .setTitle("Un live est en préparation !")
            .setURL("https://twitch.tv/lkyuusei")
            .setAuthor('El Kyuubot', messages.suc.KYUUBOT_LOGO, 'https://twitch.tv/lkyuusei')
            .setThumbnail(messages.suc.SEKT_LOGO)
            .addFields(
                { name: "En vedette", value: data[0].game_name, },
                { name: "Programme", value: data[0].title, }
            )
            .setImage("https://images.unsplash.com/photo-1579969756514-9f206e7c34a2?w=1920")
            .setTimestamp()
            .setFooter(`by Lord Kyuusei •`, messages.suc.KYUUBOT_LOGO);

        liveChannel.send(streamOnlineEmbed);
        return true;
    }
    return false;
};

export const handleLive = (channels, channel, { data }) => {
    const liveChannel = channels.cache.get(channel);
    if (liveChannel) {
        const streamOnlineEmbed = new MessageEmbed()
            .setColor('#F13CA8')
            .setTitle("Kyuu est en direct !")
            .setURL("https://twitch.tv/lkyuusei")
            .setAuthor('El Kyuubot', messages.suc.KYUUBOT_LOGO, 'https://twitch.tv/lkyuusei')
            .setThumbnail(messages.suc.SEKT_LOGO)
            .addFields(
                { name: "En vedette", value: data[0].game_name, },
                { name: "Programme", value: data[0].title, }
            )
            .setImage(data[0].thumbnail_url.replace("{width}x{height}", "1920x1080"))
            .setTimestamp()
            .setFooter(`by Lord Kyuusei •`, messages.suc.KYUUBOT_LOGO);

        liveChannel.send(streamOnlineEmbed);
        return true;
    }
    return false;
};
