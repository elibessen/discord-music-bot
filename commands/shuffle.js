const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    name: "shuffle",
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffles the queue'),

        execute: async({client, interaction}) => {

            const queue = client.player.nodes.get(interaction.guild.id);

            // Validation
            if (!interaction.member.voice.channel) return interaction.reply("❌ You need to be in a voice channel to execute this command!");
            if(!queue) return interaction.reply("❌ There are no songs in the queue!"); 
            if(queue.size < 3) return interaction.reply("❌ There needs to be more than 3 songs in queue to shuffle!")  
            
            // A simple shuffle command (thanks discord-player :) )
            queue.tracks.shuffle();
            await interaction.reply({
                content: "Shuffled the queue!"
            })
        }
}