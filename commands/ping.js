
/*

A basic ping command

*/

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: "ping",
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Test the bots speed.')
		.toJSON(),
	async execute({client, interaction}) {
		const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
		await interaction.editReply(`:ping_pong:  Latency is ${sent.createdTimestamp - interaction.createdTimestamp}ms`);	
	},
};