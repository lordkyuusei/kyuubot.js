import { subscribeEvent } from "../store/requests";

export const authorizationComponent = ({ id, eventCallback, secret}) => {
    const authorizationRoute = "/api/twitch/eventSubscribe";
    const authorizationCallback = async (req, res) => {
        const { accessToken } = req.query;
        console.log(eventCallback)
        const response = await subscribeEvent(id, accessToken, "stream.live", eventCallback, secret);
        console.log(response);
    }
    return [authorizationRoute, authorizationCallback];
}

export const validationComponent = () => {
    const validationRoute = "/api/twitch/event";
    const validationCallback = (req, res) => {
        console.log(req);
        res.send("<h1>ok</h1>");
    }
    return [validationRoute, validationCallback];
}
export default authorizationComponent;