const { SlashCommandBuilder } = require("discord.js");

const gifs = [
	"https://tenor.com/view/spongebob-touch-grass-alphabet-soup-meme-gif-25868068",
	"https://tenor.com/view/wse-gif-23048719",
	"https://tenor.com/view/alyssa-edwards-dont-log-off-delete-the-account-gif-10925708",
	"https://tenor.com/view/michael-jordan-stop-it-get-some-help-help-stop-gif-5322318",
	"https://tenor.com/view/get-out-leave-gif-11630809",
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName("slur")
		.setDescription("Teaches the user morality"),
	async execute(interaction, client) {
		await interaction.reply(gifs[Math.floor(Math.random() * gifs.length)]);
	},
};
