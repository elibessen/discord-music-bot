const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActivityType } = require("discord.js");

module.exports = {
    name: "skip",
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song'),
    
        execute: async({client, interaction}) => {       

            // Validation
            if (!interaction.member.voice.channel) return interaction.reply("❌ You need to be in a voice channel to skip a song!");

            const queue = client.player.nodes.get(interaction.guild.id);

            if(!queue) return interaction.reply("❌ There are no songs in the queue!");
            
            // The current song playing
            const nowplaying = queue.currentTrack;

            // Skip the song
            queue.node.skip()

            // Complete the command
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`${nowplaying.title} has been skipped!`)
                        .setThumbnail(nowplaying.thumbnail)
                ]
            })
        }
}