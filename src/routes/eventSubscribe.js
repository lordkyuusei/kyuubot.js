import { subscribeEvent, activeEvent, getStore } from "../store/requests";
import hmacSign from "../store/hmac";

export const authorizationComponent = ({ id, eventCallback, secret}) => {
    const authorizationRoute = "/api/twitch/eventSubscribe";
    const authorizationCallback = async (req, res) => {
        const { accessToken } = req.query;
        const response = await subscribeEvent(id, accessToken, "stream.online", eventCallback, secret);
        res.send(response);
    }
    return [authorizationRoute, authorizationCallback];
}

export const validationComponent = ({ clientId, secret }, handleLive, { channels }, { channel_id}) => {
    const validationRoute = "/api/twitch/event";
    const validationCallback = async (req, res) => {
        const { subscription, event, challenge } = req.body;
        if (challenge && event === undefined) {
            const id = req.headers["twitch-eventsub-message-id"];
            const ts = req.headers["twitch-eventsub-message-timestamp"];
            const sn = req.headers["twitch-eventsub-message-signature"];
            const bd = JSON.stringify(req.body);
    
            const hmac = hmacSign(secret, `${id}${ts}${bd}`);
            const hmac256 = `sha256=${hmac.toString(16)}`;
    
            if (sn !== hmac256) {
                return;
            } else {
                const { challenge } = req.body;
                res.status(200).send(challenge);
            }
        } else {
            console.log(req.body);
            handleLive(channels, channel_id, req.body);
            res.status(200).send("ok");
        }
    }
    return [validationRoute, validationCallback];
}