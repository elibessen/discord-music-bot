/*

Help command

*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const  { EmbedBuilder, Embed } = require("discord.js");

module.exports = {
    name: "help",
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists all commands'),

        execute: async({client, interaction}) => {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#34eb86')
                        .setTitle("Commands")
                        .setDescription("Lists all bot commands.")
                        .addFields(
                            {name: '/play song', value: 'Plays a single song from YouTube (URL).'},
                            {name: '/play playlist', value: 'Plays an entire playlist from YouTube (URL).'},
                            {name: '/skip', value: 'Skips the current song.'},
                            {name: '/queue', value: 'Lists the first 15 songs in the queue.'},
                            {name: '/exit', value: 'Kicks the bot from the voice call.'}
                        )
                        .setFooter({ text: 'Music bot'})
                ]
            })
        }
}