const { Events } = require("discord.js");

module.exports = {
	name: Events.VoiceStateUpdate,
	async execute(interaction) {
		console.log(this.name);
	},
};
