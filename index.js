const fs = require("node:fs");
const path = require("node:path");

// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const { token, ytoken } = require("./config.json");
const { createAudioPlayer, AudioPlayerStatus } = require("@discordjs/voice");

const { google } = require("googleapis");

// set up youtube object for keyword lookup in play
const youtube_key = ytoken;
const youtube = google.youtube({
	version: "v3",
	auth: youtube_key,
});

// Create a new client instance
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.commands = new Collection();
client.resourceQueue = new Collection();
client.player = createAudioPlayer();
client.youtube = youtube;
client.titles = new Array();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);
const queue = client.resourceQueue;
const player = client.player;

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith(".js"));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ("data" in command && "execute" in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
			);
		}
	}
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

player.on(AudioPlayerStatus.Idle, async () => {
	console.log("idle");
	queue.delete(queue.firstKey());
	client.titles.shift();
	if (queue.size === 0) {
		console.log("empty");
	} else {
		player.play(queue.first());
	}
});

player.on(AudioPlayerStatus.Playing, async () => {
	console.log("playing next");
});
11;
// Log in to Discord with your client's token
client.login(token);

// const token =
// 	"";

// const bot = new Discord.Client();

// bot.on("ready", () => {
// 	console.log(`Logged in as ${bot.user.tag}`);
// });

// bot.login(token);
