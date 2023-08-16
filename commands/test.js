const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: "test",
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Tests command handler')
		.toJSON(),
	async execute(interaction) {
		await interaction.reply('Test 123');
	},
};