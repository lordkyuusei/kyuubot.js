import { getStore, getEventsList } from "../store/requests";

const eventsListComponent = () => {
    const eventsListRoute = "/api/twitch/events";
    const eventsListCallback = async (req, res) => {
        const response = await getEventsList();
        res.send(`<pre>${JSON.stringify(response, null, 2)}</pre>`);
    }
    return [eventsListRoute, eventsListCallback];
}

export default eventsListComponent;