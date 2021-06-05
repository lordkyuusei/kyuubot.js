import { getAppToken, getAccessToken, refreshAccessToken } from "../store/requests";

const oauthenticationComponent = (twitch) => {
    const oauthenticationRoute = "/api/twitch/oauth";
    const oauthenticationCallback = async (req, res) => {
        const { access_token, refresh_token } = await getAppToken(twitch.id, twitch.secret, twitch.scope);
        console.log(access_token);
        twitch.access_token = access_token;
        twitch.refresh_token = refresh_token
        res.redirect(`/?accessToken=${access_token}`);

    }
    return [oauthenticationRoute, oauthenticationCallback];
}

export default oauthenticationComponent;