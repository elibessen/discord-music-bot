/*

Play command
Sub commands:
    - playlist (URL)
    - play (URL)
    - search terms

*/


const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder  } = require("discord.js");
const { QueryType } = require("discord-player");

const wait = require('node:timers/promises').setTimeout;

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

            // Loading all extractors (Spotify, SoundCloud etc.)
            await client.player.extractors.loadDefault();

            // Defer reply so the bot can take longer to find the music and reply
            await interaction.deferReply()

            // Checking if the user is in the voice channel
            if (!interaction.member.voice.channel) return interaction.reply("❌ You need to be in a voice channel to play a song!");

            // Grabbing the queue
            const queue = await client.player.nodes.create(interaction.guild);

            // If the bot isnt connected to any voice call then connect
            if (!queue.connection) await queue.connect(interaction.member.voice.channel)

            let embed = new EmbedBuilder();

            // Checking what subcommand the user selected

            if(interaction.options.getSubcommand() === "song"){

                // Getting the URL that the user searched
                let url = interaction.options.getString("url");

                console.log(`-> [Playing song] ${url}`);

                // Running a search on YouTube based on the URL
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_VIDEO
                })

                // If the search returns with no results
                if (result.tracks.length === 0){
                    return interaction.reply("No results")
                } 

                const song = result.tracks[0]

                // Playing the first song in the queue
                await queue.node.play(song)
                
                embed
                    .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({ text: `Duration: ${song.duration}`})
            
            } 
            else if (interaction.options.getSubcommand() === "playlist"){

                // Getting the URL that the user searched
                let url = interaction.options.getString("url");

                console.log(`-> [Playing playlist] ${url}`);

                // Running a search on YouTube for playlists based on the URL
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_PLAYLIST
                })

                // If the search returns with no results
                if (result.tracks.length === 0){
                    return interaction.reply(`❌ No playlists found with ${url}`);
                }

                // Adding all the songs in the playlist to the queue
                const playlist = result.playlist;
                queue.addTrack(playlist);
                embed.setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue`).setThumbnail(playlist.thumbnail)

            } 
            else if (interaction.options.getSubcommand() === "search") {

                // Getting all the terms that the user inputted
                let url = interaction.options.getString("searchterms");

                // Running a search on YouTube based on the search terms
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.AUTO
                })

                // If the search returns with no results
                if (result.tracks.length === 0){
                    return interaction.editReply("❌ No results")
                }

                //  Adding to the queue and playing the first song
                const song = result.tracks[0];
                await queue.node.play(song);

                embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})
            }

            // If there is no song playing
            if (!queue.isPlaying) {
                await queue.node.play()
            }

            // Editing the defer reply and completing the command
            await interaction.editReply({
                embeds: [embed],
            })
        },
}
