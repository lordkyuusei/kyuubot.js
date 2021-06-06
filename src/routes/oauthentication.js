import { getAppToken, setStore } from "../store/requests";

const oauthenticationComponent = () => {
    const oauthenticationRoute = "/api/twitch/oauth";
    const oauthenticationCallback = async (req, res) => {
        const { access_token, refresh_token } = await getAppToken();
        setStore("accessToken", access_token);
        setStore("refreshToken", refresh_token);
        res.redirect(`/`);

    }
    return [oauthenticationRoute, oauthenticationCallback];
}

export default oauthenticationComponent;