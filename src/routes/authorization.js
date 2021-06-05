const authorizationComponent = (body, clientId, accessToken) => {
    const authorizationRoute = "/api/twitch/authorization";
    const authorizationCallback = (req, res) => {
        const headers = new Headers({
            "Client-ID": clientId,
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        });
        const authorizationTwitchURL = "https://api.twitch.tv/helix/eventsub/subscriptions";
        const method = "POST";
    }
    return [authorizationRoute, authorizationCallback];
}

export default authorizationComponent;