const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "queue",
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Show the first 10 songs in queue'),

    execute: async({client, interaction}) => {
        const queue = client.player.nodes.get(interaction.guild.id);
        const tracks = queue.tracks.map((track, index) => `${++index}. ${track}`);

        let nowplaying = `Now playing : ${queue.currentTrack}\n\n`;
        let tracksQueue = '';

        if (!queue)
        {
            await interaction.reply("There are no songs in the queue");
            return;
        }

        tracksQueue = tracks.slice(0, 15).join('\n')

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**Currently Playing**\n` + 
                        (nowplaying ? `\`[${nowplaying.duration}]\` ${nowplaying.title}` : "None") +
                        `\n\n**Queue**\n${tracksQueue}`
                    )
            ]
        })
    }
}