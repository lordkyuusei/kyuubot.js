import { getStore, getEventsList } from "../store/requests";

const eventsListComponent = () => {
    const eventsListRoute = "/api/twitch/events";
    const eventsListCallback = async (req, res) => {
        const response = await getEventsList();
        res.send(response);
    }
    return [eventsListRoute, eventsListCallback];
}

export default eventsListComponent;