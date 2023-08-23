/*

Help command

*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const  { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "help",
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists all commands'),

        execute: async({client, interaction}) => {
            const embed = new EmbedBuilder()
                .setTitle(client.user.username)
                .setDescription(`${client.user.username}'s command list.`)
                .addFields(
                    {
                        name: "/play song",
                        value: "Plays a single song from a YouTube URL.",
                        inline: true
                    },
                    {
                        name: "/play playlist",
                        value: "Plays an entire playlist from a Youtube URL.",
                        inline: true
                    },
                    {
                        name: "/play search",
                        value: "Searches for a song on YouTube.",
                        inline: true
                    },
                    {
                        name: "/skip",
                        value: "Skips the current song playing.",
                        inline: true
                    },
                    {
                        name: "/queue",
                        value: "Lists the first 15 songs in the queue.",
                        inline: true
                    },
                    {
                        name: "/shuffle",
                        value: "Shuffles the queue.",
                        inline: true
                    },
                    {
                        name: "/exit",
                        value: "Kicks the bot from the voice call.",
                        ineline: true
                    },
                )
                .setColor("#00b0f4")
                .setThumbnail(`https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=256`)
                .setFooter({
                    iconURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=256`,
                    text: client.user.username,
                })
                .setTimestamp();

                await interaction.reply({ embeds: [embed] });  
        }
}