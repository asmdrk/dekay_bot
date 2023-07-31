const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("queue")
		.setDescription("View songs currently in queue"),
	async execute(interaction) {
		const titles = interaction.client.titles;
		if (titles.length === 0) {
			await interaction.reply(
				`There is no music queued, so you just wasted my time AND yours.`
			);
		} else {
			await interaction.reply(`Current Queue: ${titles}`);
		}
	},
};
