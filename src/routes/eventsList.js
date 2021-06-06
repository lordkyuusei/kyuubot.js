import { getStore, getEventsList } from "../store/requests";

const eventsListComponent = ({ id }) => {
    const eventsListRoute = "/api/twitch/events";
    const eventsListCallback = async (req, res) => {
        const { accessToken } = getStore();
        const response = await getEventsList(id, accessToken);
        res.send(response);
    }
    return [eventsListRoute, eventsListCallback];
}

export default eventsListComponent;