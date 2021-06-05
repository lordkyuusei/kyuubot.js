import { subscribeEvent } from "../store/requests";
import hmacSign from "../store/hmac";

export const authorizationComponent = ({ id, eventCallback, secret}) => {
    const authorizationRoute = "/api/twitch/eventSubscribe";
    const authorizationCallback = async (req, res) => {
        const { accessToken } = req.query;
        console.log(eventCallback)
        const response = await subscribeEvent(id, accessToken, "stream.online", eventCallback, secret);
        console.log(`A request has been sent to ${response.data[0].transport.callback}`);
        console.log(response);
        res.send(`please check: ${response.data[0].id}`);
    }
    return [authorizationRoute, authorizationCallback];
}

export const validationComponent = (secret) => {
    const validationRoute = "/api/twitch/event";
    const validationCallback = (req, res) => {
        console.log(req);
        const id = req.rawHeaders["Twitch-Eventsub-Message-Id"];
        const ts = req.rawHeaders["Twitch-Eventsub-Message-Timestamp"];
        const sn = req.rawHeaders["Twitch-Eventsub-Message-Signature"];

        const hmac = await hmacSign(secret, `${id}${ts}${req.body || ''}`);
        const challenge = `sha256=${hmac.toString(16)}`;

        if (sn !== challenge) {
            console.log("EUH LA !!!");
            console.log(hmac, challenge);
        } else {
            console.log("omg c passé");
        }
        res.send("<h1>ok</h1>");
    }
    return [validationRoute, validationCallback];
}