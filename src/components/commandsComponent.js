import messages from '../store/messages.js';
import ytdl from "ytdl-core";

const playMusicSafeguard = ({ args }, message) => musicCommandChecks(message) === true ? playMusic(args, message) : null;

const playMusic = async (args, message) => {
    const voiceChannel = message.member.voice.channel;
    const command = message.content.split(' ');
    const theme = musicArguments.find(theme => Object.keys(theme)[0] === command[1]);
    const songDetails = await (await ytdl.getBasicInfo(theme[command[1]])).videoDetails;
    console.log(songDetails);
    const song = {
        title: songDetails.title,
        url: songDetails.video_url
    }

    const queue = new Map();
    const queueConstruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [song],
        volume: 5,
        playing: true,
    };
    queue.set(message.guild.id, queueConstruct);

    try {
        const connection = await voiceChannel.join();
        queueConstruct.connection = connection;
        const serverQueue = queue.get(message.guild.id);
        if (!queueConstruct.songs[0]) {
            voiceChannel.leave();
            queue.delete(message.guild.id);
            return
        }
        const dispatcher = serverQueue.connection
            .play(ytdl(song.url))
            .on("finish", () => {
                serverQueue.songs.shift();
            })
            .on("error", error => console.error(error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        serverQueue.textChannel.send(`Ye want'd me to start playing: **${song.title}**`);
    }
    catch(err) {
        console.log(err);
        queue.delete(message.guild.id);
        return message.channel.send(messages.err.ERR_MUSIC_CRASH);
    }
    
}

const musicCommandChecks = (message) => {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
        return message.channel.send(messages.err.ERR_NO_VOICE_CHANNEL);
    }

    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(messages.err.ERR_NO_VOICE_PERMISSIONS);
    }

    const command = message.content.split(' ');
    if (command.length !== 2) {
        return message.channel.send(messages.err.ERR_WRONG_MUSIC_COMMAND);
    }

    const theme = musicArguments.find(theme => Object.keys(theme)[0] === command[1]);
    if (!theme) {
        return message.channel.send(messages.err.ERR_WRONG_MUSIC_ARG);
    }

    return true;

}

const stopMusicSafeguard = (message) => {

}

const musicCommands = [
    {
        "amb": playMusicSafeguard
    },
    {
        "stop": stopMusicSafeguard
    }
];
const musicArguments = [
    {
        "test": "https://youtu.be/55-ERhJEfaM"
    },
    {
        "among_us": "https://www.youtube.com/watch?v=55-ERhJEfaM"
    }
]
const handleCommands = (command, message) => {
    const action = musicCommands.find(action => Object.keys(action)[0] === command.name);
    if (action) {
        action[command.name](command, message);
    } else {
        console.log(`Unrecognized ${command}`);
    }
}

export default handleCommands;