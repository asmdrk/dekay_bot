const {
	SlashCommandBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	ComponentType,
} = require("discord.js");
const { stream } = require("play-dl");
const {
	joinVoiceChannel,
	createAudioPlayer,
	AudioPlayerStatus,
	createAudioResource,
	VoiceConnectionStatus,
} = require("@discordjs/voice");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Command to play music")
		.addStringOption((option) =>
			option
				.setName("source")
				.setDescription("Source to play music from(youtube url)")
				.setRequired(true)
		),
	async execute(interaction) {
		const row = createActionRow();

		const source = interaction.options.getString("source");
		const voiceChannel = interaction.member.voice.channel;
		// if user not in vc
		if (!voiceChannel) {
			await interaction.reply("Join a voice channel first bozo");
			return;
		}
		const response = await interaction.reply({
			content: `now queueing ${interaction.options.getString("source")} in ${
				interaction.member.voice.channel
			}`,
			components: [row],
		});

		const connection = joinVoiceChannel({
			channelId: voiceChannel.id,
			guildId: interaction.guild.id,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});
		const player = interaction.client.player;
		const ytstream = await stream(source);
		const resource = createAudioResource(ytstream.stream, {
			inputType: ytstream.type,
		});
		const queue = interaction.client.resourceQueue;
		const subscription = connection.subscribe(player);
		queue.set(Date.now(), resource);
		if (queue.size === 1) {
			player.play(queue.first());
		}

		player.on(AudioPlayerStatus.Playing, async () => {
			console.log("playing next");
			await interaction.followUp("Playing next song!");
		});
		const collector = response.createMessageComponentCollector({
			componentType: ComponentType.Button,
			time: 3_600_000,
		});

		collector.on("collect", async (i) => {
			const selection = i.customId;
			if (selection === "pause") {
				player.pause();
			} else if (selection === "resume") {
				player.unpause();
			} else if (selection === "stop") {
				player.stop();
				connection.destroy();
			}
			await i.reply({
				content: `${i.user} has selected ${selection}!`,
			});
		});

		function createActionRow() {
			const pauseButton = new ButtonBuilder()
				.setCustomId("pause")
				.setLabel("p")
				.setStyle(ButtonStyle.Primary);

			const resumeButton = new ButtonBuilder()
				.setCustomId("resume")
				.setLabel(`r`)
				.setStyle(ButtonStyle.Primary);

			const stopButton = new ButtonBuilder()
				.setCustomId("stop")
				.setLabel("s")
				.setStyle(ButtonStyle.Primary);

			const row = new ActionRowBuilder()
				.addComponents(pauseButton)
				.addComponents(resumeButton)
				.addComponents(stopButton);
			return row;
		}
		// const collector = response.createMessageComponentCollector({
		// 	componentType: ComponentType.Button,
		// 	time: 3_600_000,
		// });

		// collector.on("collect", async (i) => {
		// 	const selection = i.CustomId;
		// 	await i.reply(`${i.user} has selected ${selection}!`);
		// });
	},
};
