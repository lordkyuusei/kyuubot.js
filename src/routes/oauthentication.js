import fetch from "node-fetch";

const oauthenticationComponent = (twitch) => {
    const oauthenticationRoute = "/api/twitch/oauth";
    const twitchOauth = `https://id.twitch.tv/oauth2/authorize?client_id=${twitch.twitchId}&redirect_uri=${twitch.twitchRu}&response_type=code&scope=${twitch.twitchSc}`;
    const oauthenticationCallback = (req, res) => {
        const { code, accessToken, scope } = req.query;
        if (code === undefined && accessToken === undefined)
            res.send(`<a href="${twitchOauth}">Connect to Twitch</a>`)            
        else if (accessToken === undefined) {
            const url = `https://id.twitch.tv/oauth2/token?client_id=${twitch.twitchId}&client_secret=${twitch.twitchSt}&code=${code}&grant_type=authorization_code&redirect_uri=${twitch.twitchRu}`;
            fetch(url, { method: "POST"})
                .then(response => response.text())
                .then(twitch => {
                    console.log(twitch);
                    res.send(`token: ${twitch.access_token} (use ${twitch.refresh_token} to get new). expires in ${twitch.expires_in}s`);
                })
        }
        else
            res.send(`access token: ${accessToken}`);
    }
    return [oauthenticationRoute, oauthenticationCallback];
}

export default oauthenticationComponent;