const {
	SlashCommandBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("interact")
		.setDescription("Interact with the bot using buttons!"),
	async execute(interaction, client) {
		const button = new ButtonBuilder()
			.setCustomId("beep")
			.setLabel("beep!")
			.setStyle(ButtonStyle.Primary);

		const row = new ActionRowBuilder().addComponents(button);

		await interaction.reply({
			content: `BEEP BEEP BEEP BEEP`,
			components: [row],
		});
	},
};
