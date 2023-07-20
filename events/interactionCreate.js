const { Events } = require("discord.js");

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction, client) {
		if (interaction.isButton()) {
			if (interaction.customId === "beep") {
				if (interaction.user.username === "kongey_dong") {
					await interaction.reply(
						"Greetings Super Ultra Kami Guru, How it do?"
					);
				} else await interaction.reply("Oh. hi :|");
			}
		}
		if (!interaction.isChatInputCommand()) return;
		const command = interaction.client.commands.get(interaction.commandName);
		const user = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(
				`No command matching ${interaction.commandName} was found.`
			);
			return;
		}

		try {
			await command.execute(interaction, client);
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}
	},
};
