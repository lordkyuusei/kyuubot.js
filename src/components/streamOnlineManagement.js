import { MessageEmbed } from "discord.js";
import messages from '../store/messages.js';

export const handleUpdate = (channels, channel, { data }) => {
    const liveChannel = channels.cache.get(channel);
    if (liveChannel) {
        const streamOnlineEmbed = new MessageEmbed()
            .setColor('#EA2370')
            .setTitle("Kyuu vient de mettre à jour ses informations de chaîne ! Un live se prépare...")
            .setURL("https://twitch.tv/lkyuusei")
            .setAuthor('El Kyuubot', messages.suc.KYUUBOT_LOGO, 'https://twitch.tv/lkyuusei')
            .setDescription("Vous pouvez regarder via cette adresse : https://twitch.tv/lkyuusei !")
            .setThumbnail(messages.suc.SEKT_LOGO)
            .addFields(
                { name: "Prochain jeu", value: data[0].game_name, },
                { name: "Titre", value: data[0].title, }
            )
            .setImage(data[0].thumbnail_url)
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
            .setColor('#EA2370')
            .setTitle("Kyuu vient de démarrer un live !")
            .setURL("https://twitch.tv/lkyuusei")
            .setAuthor('El Kyuubot', messages.suc.KYUUBOT_LOGO, 'https://twitch.tv/lkyuusei')
            .setDescription("Vous pouvez regarder via cette adresse : https://twitch.tv/lkyuusei !")
            .setThumbnail(messages.suc.SEKT_LOGO)
            .addFields(
                { name: "Présentement en vedette", value: data[0].game_name, },
                { name: "Titre", value: data[0].title, }
            )
            .setImage(data[0].thumbnail_url)
            .setTimestamp()
            .setFooter(`by Lord Kyuusei •`, messages.suc.KYUUBOT_LOGO);

        liveChannel.send(streamOnlineEmbed);
        return true;
    }
    return false;
};
