import { MessageEmbed } from "discord.js";
import messages from '../../store/messages.js';

const myEmbeddedDiscord = (title, description, duration) => new MessageEmbed()
    .setTitle(title)
    .setDescription(description)
    .setColor('#0099ff')
    .setAuthor('The Kyuubot Surveys You!', messages.suc.KYUUBOT_LOGO, 'https://discord.js.org')
    .setThumbnail(messages.suc.SEKT_LOGO)
    .setTimestamp()
    .setFooter(`by Lord Kyuusei • ends in ${duration} hours`, messages.suc.KYUUBOT_LOGO);

const startSurveySafeguard = ({ args }, message) =>
    startsurveyChecks(message) === true ? startSurvey(args, message) : null;

const startsurveyChecks = (message) => {
    const command = message.content.split(" ");
    if (command.length === 1) {
        return message.channel.send(messages.err.ERR_WRONG_SURVEY_ARG);
    }

    const template = surveyArguments.find(args => command[1] === Object.keys(args)[0]) || null;
    if (command.length === 2 && !template) {
        return message.channel.send(messages.err.ERR_WRONG_SURVEY_TEMPLATE)
    }
    return true;
}

const startSurvey = (args, message) => {
    const [, ...question] = message.content.split(" ");
    const template = surveyArguments.find(arg => Object.keys(arg)[0] === question[0]);
    const survey = template ? template[question[0]] : surveyArguments.slice(-1)[0]._;
    survey.template = survey.template ?? question.join(" ");

    const description = survey.reactions.reduce((acc, react) =>
        `${acc} \n  ${Object.keys(react)[0]} - ${react[Object.keys(react)[0]]}`,
        survey.template
    );

    const filter = (react, user) => survey.reactions.some(em => em[react._emoji.name]) && !user.bot;

    const embedded = myEmbeddedDiscord(survey.title, description, survey.duration / 3600);
    
    message.channel.send(embedded)
        .then(embeddedSurvey => {
            survey.reactions.map(reaction => embeddedSurvey.react(Object.keys(reaction)[0]));
            const options = { time: survey.duration * 1000 };
            return embeddedSurvey.awaitReactions(filter, options);
        })
        .then(embeddedResult => {
            const collected = embeddedResult.array().map(react => react._emoji.name);
            let reacted = [];

            collected.forEach(react => {
                reacted[react] = reacted[react] ? reacted[react] + 1 : 1
            });

            const description = collected.length !== 0 ?
                collected.reduce((acc, react) =>
                    `${acc}\n${react} ${survey.reactions.find(o => Object.keys(o)[0] === react)[react]} - ${reacted[react]} vote${reacted[react] > 1 ? '.s' : ''} ${reacted[react] >= 5 ? '✅' : '❌'}`,
                "@Lord Kyuusei#3323 Days with vote >= 5 are counted as playable:") : 
                "No one voted, or the survey got cancelled.";

            const embedded = new MessageEmbed()
                .setTitle(`RESULTS FOR ${survey.title} (${embeddedResult.array().length} votes):`)
                .setDescription(description);

            return message.channel.send(embedded);

        })
        .catch(err => console.error(err));
}

// 8h: 28800
// 10min: 600
// 30min: 1800
const surveyArguments = [
    {
        "amongus": {
            title: messages.suc.CNT_SURVEY_TITLE_1,
            duration: 1800, // 30 min
            template: messages.suc.CNT_SURVEY_TYPE_1,
            reactions: [
                { '1️⃣' : "M'nday" },
                { '2️⃣' : "Tu'sday" },
                { '3️⃣' : "W'dnesday" },
                { '4️⃣' : "Th'rrrsday" },
                { '5️⃣' : "Frrr'day" },
                { '6️⃣' : "Sat'rrrday" },
                { '7️⃣' : "S'nday" },
            ]
        },
    },
    {
        "_": {
            title: messages.suc.CNT_SURVEY_TITLE_0,
            duration: 600,
            template: messages.suc.CNT_SURVEY_TYPE_0,
            reactions: [
                { '✅': "O.K. / Agreed" },
                { '❌': "K.O. / Disagreed" }
            ]
        }        
    },
];

export default startSurveySafeguard;