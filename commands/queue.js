/*

Queue command

*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "queue",
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Show the first 15 songs in queue'),

    execute: async({client, interaction}) => {

        // User validation
        if (!interaction.member.voice.channel) return interaction.reply("❌ You need to be in a voice channel to view the queue!");

        const queue = client.player.nodes.get(interaction.guild.id);

        // Validate the queue
        if (!queue) return interaction.reply("There are no songs in the queue");

        // Grabbing all the songs in the queue with the index and song name
        const tracks = queue.tracks.map((track, index) => `${++index}. ${track}`);

        let nowplaying = `Now playing : ${queue.currentTrack}\n\n`;
        let tracksQueue = '';

        // The current song playing
        let currentSong = queue.currentTrack;

        // Since the queue is an array we can get the first 15 from it
        tracksQueue = tracks.slice(0, 15).join('\n')

        // Completing the command
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**Currently Playing**\n` + 
                        (nowplaying ? `\`[${currentSong.duration}]\` ${currentSong.title}` : "None") +
                        `\n\n**Queue**\n${tracksQueue}`
                    )
                    .setThumbnail(queue.currentTrack.thumbnail)
            ]
        })
    }
}