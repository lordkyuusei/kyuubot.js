import config from "../config.json";
import setupDiscordClient from "./server-startup/discord";
import setupTwitchService from "./server-startup/twitch";

config.meta.token = process.env.TOKEN;
config.twitch.redirectUri = process.env.TWITCH_REDIRECT;
config.twitch.eventCallback = process.env.TWITCH_EVENT_CB;

const client = setupDiscordClient(config);
setupTwitchService(config, client);