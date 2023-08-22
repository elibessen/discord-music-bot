/*

Shows the current song

*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, Embed } = require("discord.js");

module.exports = {
    name: 'now playing',
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Shows the current song playing'),

        execute: async({client, interaction}) => {

            const queue = client.player.nodes.get(interaction.guild.id);

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: "Now playing 🎵" })
                        .setTitle(`${queue.currentTrack}`)
                        .setURL(`${queue.currentTrack.url}`)
                        .setThumbnail(`${queue.currentTrack.thumbnail}`)
                        .setDescription(`Played by: ${queue.currentTrack.requestedBy}\n${queue.node.createProgressBar()}`)
                ]
            })
        }
}