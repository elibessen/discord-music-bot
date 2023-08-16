/*

Slash command registration/deployment

*/

require('dotenv').config();

const { REST, Routes } = require('discord.js');;
const fs = require('node:fs');
const path = require('node:path');

// Creating a command array and paths to the commands
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Looping through each file and grabbing its data
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.TOKEN);

(async () => {
	try {
		console.log(`-> [Started refreshing] ${commands.length} commands.`);

		// Requesting to update commands globally
		await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
			{ body: commands },
		);

		console.log(`-> [Successfully reloaded]`);
	} catch (error) {
		console.error(error);
	}
})();