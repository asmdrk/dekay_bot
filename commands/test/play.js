const {
	SlashCommandBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	ComponentType,
	Collection,
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
				.setDescription("Youtube video to play music from(title or url)")
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

		const ytresponse = await interaction.client.youtube.search.list({
			part: "id, snippet",
			q: source,
			type: "video",
			maxResults: 1, // You can increase this number to get more results.
		});
		const video = ytresponse.data.items[0];
		const videoId = video.id.videoId;
		const title = video.snippet.title;
		const url = `https://www.youtube.com/watch?v=${videoId}`;

		const response = await interaction.reply({
			content: `now queueing ${url} in ${interaction.member.voice.channel}`,
			components: [row],
		});

		const connection = joinVoiceChannel({
			channelId: voiceChannel.id,
			guildId: interaction.guild.id,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});
		const player = interaction.client.player;
		const ytstream = await stream(url);

		const resource = createAudioResource(ytstream.stream, {
			inputType: ytstream.type,
		});
		let queue = interaction.client.resourceQueue;
		let titles = interaction.client.titles;
		titles.push(title);
		const subscription = connection.subscribe(player);
		queue.set(Date.now(), resource);
		if (queue.size === 1) {
			player.play(queue.first());
		}

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
				interaction.client.titles = new Array();
				interaction.client.resourceQueue = new Collection();
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
