const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    name: "play",
    data: new SlashCommandBuilder()
        .setName("exit")
        .setDescription("⬅Kick the bot from the channel"),
        execute: async({ client, interaction }) => {

            if (!interaction.member.voice.channel) return interaction.reply("❌ You need to be in a voice channel to execute this command!");

            const queue = client.player.nodes.get(interaction.guildId);

            queue.delete();

            await interaction.reply({content: 'Left voice call'});
        }
    
}