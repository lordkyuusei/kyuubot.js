const home = (accessToken, eventType) => {
    const render = accessToken ? `
        <a href='/api/twitch/eventSubscribe?event=${eventType}'>
            <button>subscribe to ${eventType}</button>
        </a>
    ` : `
        <h1> No access token available </h1>
        <a href='/api/twitch/oauth'><button>get one</button></a>'
    `;
    return render;
}

export default home;