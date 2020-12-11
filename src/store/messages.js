const errors = {
    ERR_NO_VOICE_CHANNEL: "Ye be not in a voice channel, mate.",
    ERR_WRONG_MUSIC_ARG: "I don't know a damn to the depths thin' to the theme ye provided, mate.",
    ERR_NO_VOICE_PERMISSIONS: "I can't speak in yer voice channel. Please check yer permissions, mate.",
    ERR_WRONG_MUSIC_COMMAND: "The music command ye provided isn't right, mate. Check that there ye wrote somethin' like \"!amb [theme]\", mate.",
    ERR_MUSIC_CRASH: "Arr, somethin' 'appened durin' the lecture. Check yer logs, barman",
    ERR_WRONG_SURVEY_ARG: "So ye provided an empty riddle t' go wit' yer empty survey, right mate?",
    ERR_WRONG_SURVEY_TEMPLATE: "I dunno a thin' about th' template ye provided, mate."
};

const successes = {
    SEKT_LOGO: "https://cdn.discordapp.com/attachments/760071268295770154/774645891197304872/unknown.png",
    KYUUBOT_LOGO: "https://static.wikia.nocookie.net/pokemon-reborn/images/a/a7/VSShade.png",
    CNT_SURVEY_TITLE_0: "A NEW SURVEY APPEARS!",
    CNT_SURVEY_TYPE_0: null,
    CNT_SURVEY_TITLE_1: "AMONG US Weekly Challenge - Agenda",
    CNT_SURVEY_TYPE_1: "'tis time t' throw a new survey fer a week's worth o' traitors. Pick yer available days t' go out 'n slaughter on Among Us, crewmates.",
};

export default {
    err: errors,
    suc: successes,
};