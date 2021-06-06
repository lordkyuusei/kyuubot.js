import { getAppToken, setStore } from "../store/requests";

const oauthenticationComponent = (twitch) => {
    const oauthenticationRoute = "/api/twitch/oauth";
    const oauthenticationCallback = async (req, res) => {
        const { access_token, refresh_token } = await getAppToken(twitch.id, twitch.secret, twitch.scope);
        setStore("accessToken", access_token);
        setStore("refreshToken", refresh_token);
        res.redirect(`/`);

    }
    return [oauthenticationRoute, oauthenticationCallback];
}

export default oauthenticationComponent;