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
        const bd = res.json({ requestBody: req.body });

        console.log(bd);
        console.log(req.body);
        console.log(JSON.stringify(req.body));

        const hmac = hmacSign(secret, `${id}${ts}${bd}`);
        const challenge = `sha256=${hmac.toString(16)}`;

        console.log("EUH LA !!!");
        if (sn !== challenge) {
            console.log(`adding ${id}, ${ts}, and ${bd} together.`)
            console.log(challenge);
            console.log(sn);
        } else {
            console.log("omg c passé");
        }
        res.send("<h1>ok</h1>");
    }
    return [validationRoute, validationCallback];
}