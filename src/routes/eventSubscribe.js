import { subscribeEvent, activeEvent, getStore, getChannelData, setStore } from "../store/requests";
import hmacSign from "../store/hmac";

export const authorizationComponent = ({ eventCallback }) => {
    const authorizationRoute = "/api/twitch/eventSubscribe";
    const authorizationCallback = async (req, res) => {
        console.log(eventCallback);
        const response = await subscribeEvent("stream.online", eventCallback);
        res.send(response);
    }
    return [authorizationRoute, authorizationCallback];
}

export const validationComponent = (handleLive, { channels }, { channel_id }) => {
    const validationRoute = "/api/twitch/event";
    const validationCallback = async (req, res) => {
        console.log(".??")
        const { subscription, event, challenge } = req.body;
        if (challenge && subscription) {
            const id = req.headers["twitch-eventsub-message-id"];
            const ts = req.headers["twitch-eventsub-message-timestamp"];
            const sn = req.headers["twitch-eventsub-message-signature"];
            const bd = JSON.stringify(req.body);

            const hmac = hmacSign(secret, `${id}${ts}${bd}`);
            const hmac256 = `sha256=${hmac.toString(16)}`;
            const { challenge } = req.body;

            if (sn !== hmac256) {
                console.log("EUH LA");
                console.log(sn, hmac256, challenge);
                return;
            } else {
                console.log(sn, hmac256, challenge);
                res.status(200).send(challenge);
            }
        } else if (subscription && event) {
            const info = await getChannelData("149976943");
            const id = req.headers["twitch-eventsub-message-id"];
            const { requestsIds } = getStore();
            if (requestsIds.findIndex(id) === -1) {
                setStore("requestsIds", [...requestsIds, id]);
                handleLive(channels, channel_id, info);
                res.status(200).send("ok");
            }
            return;
        } else {
            res.status(400).send("no");
        }
    }
    return [validationRoute, validationCallback];
}