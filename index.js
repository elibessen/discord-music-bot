/*

Discord music bot main

*/

require('dotenv').config();

const {REST} = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, GatewayIntentBits , Collection, Events, ActivityType } = require('discord.js');
const { Player } = require("discord-player")

const fs = require('fs');
const path = require('path');



// Creating a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Creating a collection of commands
client.commands = new Collection();
commandArray = []

// Create paths to the commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Looping through each file and grabbing its data
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
    const commandName = file.split(".")[0];
	const command = require(filePath);
    if ('data' in command && 'execute' in command){
        commandArray.push(commandName);
        console.log(`-> [Loaded Command] ${commandName}`);
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }

}

client.player = new Player(client, {
    ytdlOptions: {
        filter: 'audioonly',
        quality: "highestaudio",
        format: 'mp3',
        highWaterMark: 1 << 25
    }
});

// Once the bot is ready to go online
client.once(Events.ClientReady, () => {
    console.log("-> [Successfully logged in]")
    client.user.setPresence({
        activities: [{name: `Music!`, type: ActivityType.Listening} ], status: 'online'
    })
});

// This code runs anytime someone interacts with the bot
client.on("interactionCreate", async interaction => {
    // Ignore if the chat is not an interaction
	if (!interaction.isCommand()) return;

    // Creating a reference to the commands
	const command = interaction.client.commands.get(interaction.commandName);

    // Ignore if the command is not a registered command
	if (!command) return;

    // Execute the interaction
	try {
		await command.execute({client, interaction});
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// Destroy the client
client.destroy()

// Launch the client
client.login(process.env.TOKEN);