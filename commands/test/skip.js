const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("skip")
		.setDescription("skip current song"),
	async execute(interaction) {
		await interaction.reply({
			content: `Current song skipped by ${interaction.user.username}`,
		});
		queue = interaction.client.resourceQueue;
		player = interaction.client.player;
		queue.delete(queue.firstKey());
		player.stop();
		if (queue.size === 0) {
			console.log("empty");
		} else {
			player.play(queue.first());
		}
	},
};
