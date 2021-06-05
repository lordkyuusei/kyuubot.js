import { subscribeEvent, activeEvent, getStore } from "../store/requests";
import hmacSign from "../store/hmac";

export const authorizationComponent = ({ id, eventCallback, secret}) => {
    const authorizationRoute = "/api/twitch/eventSubscribe";
    const authorizationCallback = async (req, res) => {
        const { accessToken } = req.query;
        const response = await subscribeEvent(id, accessToken, "stream.online", eventCallback, secret);
        res.send(`waiting...`);
    }
    return [authorizationRoute, authorizationCallback];
}

export const validationComponent = ({ clientId, secret }) => {
    const validationRoute = "/api/twitch/event";
    const validationCallback = (req, res) => {
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
                const { accessToken } = getStore();
                console.log(accessToken);
                activeEvent(challenge, clientId, accessToken);
            }
        } else {
            console.log(req.body);
        }
    }
    return [validationRoute, validationCallback];
}