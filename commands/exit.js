const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    name: "play",
    data: new SlashCommandBuilder()
        .setName("exit")
        .setDescription("Kick the bot from the channel."),
        execute: async({ client, interaction }) => {
            const queue = client.player.nodes.get(interaction.guildId);

            queue.delete();

            await interaction.reply({content: 'Left voice call'});
        }
    
}