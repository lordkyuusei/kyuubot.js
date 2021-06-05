const onair = {
    "type": "stream.live",
    "version": "1",
    "condition": {
        "broadcaster_user_id": "12826"
    },
    "transport": {
        "method": "webhook",
        "callback": "https://thekyuubot.herokuapp.com/api/twitch/validate",
        "secret": "s3cRe7"
    }
}

export default {
    onair
};