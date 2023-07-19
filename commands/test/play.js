const { SlashCommandBuilder } = require("discord.js");
const {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	demuxProbe,
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
		const voiceChannel = interaction.member.voice.channel;
		if (!voiceChannel) {
			await interaction.reply("Join a voice channel first bozo");
			return;
		} else {
			await interaction.reply(
				`Oh! you are in ${interaction.member.voice.channel}`
			);
		}

		const connection = joinVoiceChannel({
			channelId: voiceChannel.id,
			guildId: interaction.guild.id,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});

		const player = createAudioPlayer();

		const stream = ytdl(source, { filter: "audioonly" });
		const resource = createAudioResource(stream);
		connection.subscribe(player);
		player.play(resource);
	},
};
