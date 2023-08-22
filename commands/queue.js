/*

Queue command

*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "queue",
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Show the first 10 songs in queue'),

    execute: async({client, interaction}) => {

        if (!interaction.member.voice.channel) return interaction.reply("❌ You need to be in a voice channel to view the queue!");

        const queue = client.player.nodes.get(interaction.guild.id);

        if (!queue)
        {
            await interaction.reply("There are no songs in the queue");
            return;
        }

        const tracks = queue.tracks.map((track, index) => `${++index}. ${track}`);

        let nowplaying = `Now playing : ${queue.currentTrack}\n\n`;
        let tracksQueue = '';

        let currentSong = queue.currentTrack;

        tracksQueue = tracks.slice(0, 15).join('\n')

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