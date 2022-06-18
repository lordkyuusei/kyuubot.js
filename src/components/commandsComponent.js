const methodsToExecute = {};

const handleCommands = (command, message) => {
    const action = methodsToExecute[command.name];
    return action ? action(command, message) : console.error(`Unrecognized: ${command.name} has no method.`);
}

export default handleCommands;