


const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActivityType  } = require("discord.js");
const { Player, QueryType } = require("discord-player");

function updatePresence(result){
    client.user.setPresence({
        activities: [{name: `${result.tracks.length}`, type: ActivityType.Listening} ], status: 'online'
    })

}

module.exports = {
    name: "play",
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song from youtube')
        .addSubcommand(subcommand =>
			subcommand
				.setName("search")
				.setDescription("Searches for a song and plays it")
				.addStringOption(option =>
					option.setName("searchterms").setDescription("search keywords").setRequired(true)
				)
		)
        .addSubcommand(subcommand =>
			subcommand
				.setName("playlist")
				.setDescription("Plays a playlist from YT")
				.addStringOption(option => 
                    option.setName("url").setDescription("the playlist's url").setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("song")
				.setDescription("Plays a single song from YT")
				.addStringOption(option => 
                    option.setName("url").setDescription("the song's url").setRequired(true))
		),
        execute: async ({client, interaction}) => {

            await client.player.extractors.loadDefault();

            // Checking if the user is in the voice channel
            if (!interaction.member.voice.channel) return interaction.reply("You need to be in a voice channel to play a song.");

            const queue = await client.player.nodes.create(interaction.guild);

            if (!queue.connection) await queue.connect(interaction.member.voice.channel)

            let embed = new EmbedBuilder();

            if(interaction.options.getSubcommand() === "song"){
                let url = interaction.options.getString("url");

                console.log(`-> [Playing] ${url}`);

                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_VIDEO
                })

                if (result.tracks.length === 0){
                    return interaction.reply("No results")
                } 

                const song = result.tracks[0]
                updatePresence(result)

                await queue.node.play(song)
                embed
                    .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({ text: `Duration: ${song.duration}`})
            
            } 
            else if (interaction.options.getSubcommand() === "playlist"){

                let url = interaction.options.getString("url");

                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_PLAYLIST
                })

                if (result.tracks.length === 0){
                    return interaction.reply(`No playlists found with ${url}`);
                }

                const playlist = result.playlist;
                queue.addTrack(playlist);
                embed.setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue`).setThumbnail(playlist.thumbnail)

            } 
            else if (interaction.options.getSubcommand() === "search") {
                let url = interaction.options.getString("searchterms");
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.AUTO
                })

                if (result.tracks.length === 0){
                    return interaction.editReply("No results")
                }


                const song = result.tracks[0];
                await queue.node.play(song);

                embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})
            }

            if (!queue.isPlaying) {
                await queue.node.play()
            }

            await interaction.reply({
                embeds: [embed]
            })
        },
}
