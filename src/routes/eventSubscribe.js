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

export const validationComponent = ({ secret }) => {
    const validationRoute = "/api/twitch/event";
    const validationCallback = (req, res) => {
        console.log(req.headers['twitch-eventsub-message-id']);
        const id = req.headers["twitch-eventsub-message-id"];
        const ts = req.headers["twitch-eventsub-message-timestamp"];
        const sn = req.headers["twitch-eventsub-message-signature"];
        const bd1 = res.json({ requestBody: req.body });
        const bd2 = req.body;
        const bd3 = JSON.stringify(req.body);

        console.log(bd1);
        console.log(bd2);
        console.log(bd3);

        const hmac1 = hmacSign(secret, `${id}${ts}${bd1}`);
        const hmac2 = hmacSign(secret, `${id}${ts}${bd2}`);
        const hmac3 = hmacSign(secret, `${id}${ts}${bd3}`);
        const challenge1 = `sha256=${hmac1.toString(16)}`;
        const challenge2 = `sha256=${hmac2.toString(16)}`;
        const challenge3 = `sha256=${hmac3.toString(16)}`;

        console.log(challenge1);
        console.log(challenge2);
        console.log(challenge3);
        console.log(sn);
        if (sn !== challenge1 || sn !== challenge2 || sn !== challenge3) {
            console.log("EUH LA !!!");
        } else {
            console.log("omg c passé");
        }
        res.send("<h1>ok</h1>");
    }
    return [validationRoute, validationCallback];
}