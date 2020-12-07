import { MessageEmbed } from "discord.js";
import messages from '../../store/messages.js';

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

const filter = (reaction, user) => reactions.includes(reaction.emoji.name) && !user.bot;

const startSurvey = (args, message) => {
    const [, ...question] = message.content.split(" ");
    const template = surveyArguments.find(arg => Object.keys(arg)[0] === question[0]);
    const survey = template ? template[question[0]] : surveyArguments.slice(-1)[0]._;
    survey.template = survey.template ?? question.join(" ");

    const description = survey.reactions.reduce((acc, react) =>
        `${acc} \n  ${Object.keys(react)[0]} - ${react[Object.keys(react)[0]]}`,
        survey.template
    );

    const embedded = new MessageEmbed()
        .setTitle("A NEW SURVEY APPEARS!")
        .setDescription(description);
    
    message.channel.send(embedded)
        .then(embeddedSurvey => {
            console.log(survey.reactions);
            survey.reactions.map(reaction => embeddedSurvey.react(Object.keys(reaction)[0]));
            const options = { time: survey.duration };
            return embeddedSurvey.awaitReactions(filter, options);
        })
        .catch(err => console.error(err));
}

const surveyArguments = [
    {
        "amongus": {
            duration: 3600,
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
            duration: 600,
            template: null,
            reactions: [
                { '✅': "O.K. / Agreed" },
                { '❌': "K.O. / Disagreed" }
            ]
        }        
    },
];

export default startSurveySafeguard;