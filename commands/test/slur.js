const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("slur")
		.setDescription("Teaches the user morality"),
	async execute(interaction) {
		await interaction.reply("https://tenor.com/view/wse-gif-23048719");
	},
};
