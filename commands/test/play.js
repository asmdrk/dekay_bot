const { SlashCommandBuilder } = require("discord.js");
const {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
} = require("@discordjs/voice");
const ytdl = require("ytdl-core");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Command to play music")
		.addStringOption((option) =>
			option
				.setName("source")
				.setDescription("Source to play music from")
				.setRequired(true)
		),
	async execute(interaction) {
		const source = interaction.options.getString("source");
		await interaction.reply(`${interaction.member.voice.channel}`);
		const voiceChannel = interaction.member.voice.channel;
		if (!voiceChannel) {
			await interaction.reply("Join a voice channel first bozo");
			return;
		}

		const connection = joinVoiceChannel({
			channelId: voiceChannel.id,
			guildId: interaction.guild.id,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});

		const player = createAudioPlayer();
		// Play the audio stream
		const stream = ytdl(source, { filter: "audioonly" });
		const resource = createAudioResource(stream);
		player.play(resource);

		// Assign the player to the voice connection
		connection.subscribe(player);

		await interaction.reply(`Now playing: ${source}`);
	},
};
