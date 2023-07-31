const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("skip")
		.setDescription("skip current song"),
	async execute(interaction) {
		queue = interaction.client.resourceQueue;
		if (queue.size === 0) {
			await interaction.reply("There is nothing playing chief,,,");
		} else {
			player = interaction.client.player;
			queue.delete(queue.firstKey());
			interaction.client.titles.shift();
			await interaction.reply({
				content: `Current song skipped by ${interaction.user.username}`,
			});
			if (queue.size === 0) {
				player.stop();
				console.log("empty");
			} else {
				player.play(queue.first());
			}
		}
	},
};
