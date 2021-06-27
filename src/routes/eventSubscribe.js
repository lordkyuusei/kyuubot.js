import hmacSign from "../store/hmac";
import { handleLive, handleUpdate } from '../components/streamOnlineManagement';
import { subscribeEvent, getStore, getChannelData, getStreamData, setStore } from "../store/requests";

export const authorizationComponent = ({ eventCallback }) => {
    const authorizationRoute = "/api/twitch/eventSubscribe";
    const authorizationCallback = async (req, res) => {
        const { event } = req.query;
        const response = await subscribeEvent(event, eventCallback);
        res.send(`<pre>${JSON.stringify(response, null, 2)}</pre>`);
    }
    return [authorizationRoute, authorizationCallback];
}

const validationHmac = (req) => {
    const { clientSecret } = getStore();
    const id = req.headers["twitch-eventsub-message-id"];
    const ts = req.headers["twitch-eventsub-message-timestamp"];
    const sn = req.headers["twitch-eventsub-message-signature"];
    const bd = JSON.stringify(req.body);

    const hmac = hmacSign(clientSecret, `${id}${ts}${bd}`);
    const hmac256 = `sha256=${hmac.toString(16)}`;
    const { challenge } = req.body;

    return sn === hmac256 ? [200, challenge] : [403, "bad request"]
};

const eventToCallback = {
    "stream.online": streamOnlineCallback,
    "channel.update": channelUpdateCallback,
};

const streamOnlineCallback = async (broadcaster_id, req, channels, channel_id) => {
    const info = await getStreamData(broadcaster_id);
    const id = req.headers["twitch-eventsub-message-id"];
    const { requestsIds } = getStore();
    if (info.data !== [] && requestsIds.findIndex(i => i === id) === -1) {
        const success = handleLive(channels, channel_id, info);
        if (success) {
            setStore("requestsIds", [...requestsIds, id]);
            return true;
        }
        return false;
    }
};

const channelUpdateCallback = async (broadcaster_id, req, channels, channel_id) => {
    const info = await getChannelData(broadcaster_id);
    const id = req.headers["twitch-eventsub-message-id"];
    const { requestsIds } = getStore();
    if (info.data !== [] && requestsIds.findIndex(i => i === id) === -1) {
        const success = handleUpdate(channels, channel_id, info);
        if (success) {
            setStore("requestsIds", [...requestsIds, id]);
            return true;
        }
        return false;
    }
}
export const validationComponent = ({ channels }, { channel_id }) => {
    const validationRoute = "/api/twitch/event";
    const validationCallback = async (req, res) => {
        const { subscription, event, challenge } = req.body;
        if (challenge && subscription) {
            console.log("received a request from twitch!");
            const [code, message] = validationHmac(req);
            res.status(code).send(`<pre>${JSON.stringify(message, null, 2)}</pre>`);
        } else if (subscription && event) {
            const { type } = subscription;
            const action = eventToCallback[type];
            if (action) {
                const result = await action("149976943", req, channels, channel_id);
                res.status(result ? 200 : 403, result ? "ok" : "ko");
            } else {
                console.error(`Unrecognized: ${type} has no method.`);
                res.status(400).send("no");
            }
        } else {
            res.status(400).send("no");
        }
    }
    return [validationRoute, validationCallback];
}