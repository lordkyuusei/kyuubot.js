import { playMusicSafeguard, stopMusicSafeguard } from './commands/musicCommands';
import startSurveySafeguard from './commands/surveyCommands';

const methodsToExecute = {
    "amb": playMusicSafeguard,
    "stop": stopMusicSafeguard,
    "survey": startSurveySafeguard
};

const handleCommands = (command, message) => {
    const action = methodsToExecute[command.name];
    return action ? action(command, message) : console.error(`Unrecognized: ${command.name} has no method.`);
}

export default handleCommands;