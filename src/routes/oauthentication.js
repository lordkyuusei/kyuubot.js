const oauthenticationComponent = (twitch) => {
    const oauthenticationRoute = "/api/twitch/oauth";
    const twitchOauth = `https://id.twitch.tv/oauth2/authorize?client_id=${twitch.twitchId}&redirect_uri=${twitch.twitchRu}&response_type=code&scope=${twitch.twitchSc}`;
    const oauthenticationCallback = (req, res) =>{
        console.log(req);
        res.send(`<a href="${twitchOauth}">Connect to Twitch</a>`)
    }
    return [oauthenticationRoute, oauthenticationCallback];
}

export default oauthenticationComponent;