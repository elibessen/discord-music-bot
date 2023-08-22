const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "skip",
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song'),
    
        execute: async({client, interaction}) => {

            if (!interaction.member.voice.channel) return interaction.reply("❌ You need to be in a voice channel to skip a song!");

            const queue = client.player.nodes.get(interaction.guild.id);

            if(!queue){
                await interaction.reply("❌ | There are no songs in the queue");
                return;
            }

            const nowplaying = queue.currentTrack;

            queue.node.skip()

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`${nowplaying.title} has been skipped!`)
                        .setThumbnail(nowplaying.thumbnail)
                ]
            })
        }
}